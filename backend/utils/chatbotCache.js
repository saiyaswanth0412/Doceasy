// Response cache for chatbot to reduce API calls and prevent rate limiting
class ChatbotCache {
  constructor(ttlSeconds = 3600) {
    this.cache = new Map();
    this.ttlSeconds = ttlSeconds;
    this.requestQueue = [];
    this.isProcessing = false;
  }

  // Generate cache key from message (normalize for similar queries)
  generateKey(message) {
    // Normalize: lowercase, trim, remove extra spaces
    const normalized = message.toLowerCase().trim().replace(/\s+/g, ' ');
    // Hash similar queries (e.g., "find dermatologist" = "derma" = "dermatologist")
    if (normalized.includes('derma') || normalized.includes('skin')) {
      return 'dermatologist_inquiry';
    }
    if (normalized.includes('cardio') || normalized.includes('heart')) {
      return 'cardiologist_inquiry';
    }
    if (normalized.includes('neuro') || normalized.includes('brain')) {
      return 'neurologist_inquiry';
    }
    if (normalized.includes('doctor') || normalized.includes('specialist')) {
      return 'doctor_list_inquiry';
    }
    if (normalized.includes('available') || normalized.includes('slot') || normalized.includes('time')) {
      return 'availability_inquiry';
    }
    // For unique queries, use hash of message
    return `query_${this.simpleHash(normalized)}`;
  }

  // Simple hash function
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Get from cache if available and not expired
  get(message) {
    const key = this.generateKey(message);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    console.log(`✅ Cache HIT for: "${message.substring(0, 40)}..."`);
    return entry.response;
  }

  // Store in cache
  set(message, response) {
    const key = this.generateKey(message);
    this.cache.set(key, {
      response,
      expiresAt: Date.now() + (this.ttlSeconds * 1000)
    });
    console.log(`📝 Cached response for: "${message.substring(0, 40)}..."`);
  }

  // Queue API request and process sequentially to prevent rate limiting
  async queueRequest(message, apiCall) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ message, apiCall, resolve, reject });
      this.processQueue();
    });
  }

  // Process queued requests one at a time with delays
  async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const { message, apiCall, resolve, reject } = this.requestQueue.shift();

      try {
        console.log(`🔄 Processing queued request: "${message.substring(0, 40)}..."`);
        const result = await apiCall();
        
        // Add to cache
        this.set(message, result);
        
        resolve(result);

        // Add delay between requests to prevent rate limiting
        if (this.requestQueue.length > 0) {
          await new Promise(r => setTimeout(r, 2000)); // 2 second delay between queued requests
        }
      } catch (error) {
        reject(error);
      }
    }

    this.isProcessing = false;
  }

  // Get cache statistics
  getStats() {
    return {
      cachedItems: this.cache.size,
      queuedRequests: this.requestQueue.length,
      isProcessing: this.isProcessing
    };
  }

  // Clear cache
  clear() {
    this.cache.clear();
    console.log('🗑️  Cache cleared');
  }
}

export default new ChatbotCache(3600); // 1 hour TTL
