class ChatbotCache {
  constructor(ttlSeconds = 3600) {
    this.cache = new Map();
    this.ttlSeconds = ttlSeconds;
    this.requestQueue = [];
    this.isProcessing = false;
  }

  generateKey(message) {
    const normalized = message.toLowerCase().trim().replace(/\s+/g, ' ');

    if (normalized.includes('derma') || normalized.includes('skin')) return 'dermatologist_inquiry';
    if (normalized.includes('cardio') || normalized.includes('heart')) return 'cardiologist_inquiry';
    if (normalized.includes('neuro') || normalized.includes('brain')) return 'neurologist_inquiry';
    if (normalized.includes('doctor') || normalized.includes('specialist')) return 'doctor_list_inquiry';
    if (normalized.includes('available') || normalized.includes('slot') || normalized.includes('time')) return 'availability_inquiry';

    return `query_${this.simpleHash(normalized)}`;
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  get(message) {
    const key = this.generateKey(message);
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.response;
  }

  set(message, response) {
    const key = this.generateKey(message);
    this.cache.set(key, {
      response,
      expiresAt: Date.now() + (this.ttlSeconds * 1000)
    });
  }

  async queueRequest(message, apiCall) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ message, apiCall, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return;

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const { message, apiCall, resolve, reject } = this.requestQueue.shift();

      try {
        const result = await apiCall();
        this.set(message, result);
        resolve(result);

        if (this.requestQueue.length > 0) {
          await new Promise(r => setTimeout(r, 2000));
        }
      } catch (error) {
        reject(error);
      }
    }

    this.isProcessing = false;
  }

  getStats() {
    return {
      cachedItems: this.cache.size,
      queuedRequests: this.requestQueue.length,
      isProcessing: this.isProcessing
    };
  }

  clear() {
    this.cache.clear();
  }
}

export default new ChatbotCache(3600);
