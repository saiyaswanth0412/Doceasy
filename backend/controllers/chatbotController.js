import axios from 'axios';
import chatbotCache from '../utils/chatbotCache.js';
import chatbotFallback from '../utils/chatbotFallback.js';

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    // Check cache first - if found, return immediately
    const cachedResponse = chatbotCache.get(message);
    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Verify Gemini API key is set
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return res.status(500).json({
        success: false,
        message: 'Chatbot is not configured - missing GEMINI_API_KEY'
      });
    }

    // System prompt - optimized for token usage
    const systemPrompt = `You are Appointy, a medical appointment booking assistant. Help users book appointments by asking for: specialization, preferred doctor, date (YYYY-MM-DD), and time (HH:MM: 09:00, 10:00, 11:00, 14:00, 15:00, 16:00, 17:00).

When booking confirmed, respond with:
[APPOINTMENT_READY]
{"specialization":"value","doctorName":"value","slotDate":"YYYY-MM-DD","slotTime":"HH:MM"}
[END_APPOINTMENT]

Keep responses brief.`;

    const model = 'gemini-2.5-flash';
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    // Use request queue to prevent rate limiting
    const response = await chatbotCache.queueRequest(message, async () => {
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`[Attempt ${attempt}] Calling Gemini for: "${message.substring(0, 40)}..."`);
          
          const apiResponse = await axios.post(
            `${geminiUrl}?key=${geminiApiKey}`,
            {
              contents: [
                {
                  parts: [{ text: `${systemPrompt}\n\nUser: ${message}` }]
                }
              ],
              generationConfig: {
                temperature: 0.8,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024
              }
            },
            {
              headers: { 'Content-Type': 'application/json' },
              timeout: 30000
            }
          );
          
          console.log('✅ Gemini API success');
          return apiResponse;
        } catch (error) {
          if (error.response?.status === 429 && attempt < 3) {
            const waitTime = attempt * 2000;
            console.log(`⏳ Rate limited. Retry in ${waitTime}ms...`);
            await new Promise(r => setTimeout(r, waitTime));
          } else {
            throw error;
          }
        }
      }
    });

    // Extract response
    let botMessage = 'No response from chatbot';
    let bookingData = null;
    
    if (response.data.candidates?.[0]?.content?.parts?.[0]) {
      botMessage = response.data.candidates[0].content.parts[0].text;
      
      // Parse booking JSON if present
      const bookingMatch = botMessage.match(/\[APPOINTMENT_READY\]([\s\S]*?)\[END_APPOINTMENT\]/);
      if (bookingMatch) {
        try {
          bookingData = JSON.parse(bookingMatch[1]);
          botMessage = botMessage.replace(/\[APPOINTMENT_READY\][\s\S]*?\[END_APPOINTMENT\]/, '').trim();
        } catch (e) {
          console.error('Error parsing booking JSON:', e);
        }
      }
    } else {
      throw new Error('Invalid response format from Gemini API');
    }

    const responseData = {
      success: true,
      reply: botMessage,
      bookingData,
      timestamp: new Date()
    };

    res.json(responseData);

  } catch (error) {
    console.error('❌ Chatbot error:', error.message);
    if (error.response?.data) {
      console.error('API error details:', error.response.data);
    }
    
    // For rate limit and connection errors - use fallback
    const shouldUseFallback = 
      error.response?.status === 429 ||
      error.response?.status === 400 ||
      error.response?.status === 401 ||
      error.response?.status === 503 ||
      error.code === 'ENOTFOUND' ||
      error.code === 'ECONNREFUSED' ||
      error.code === 'ECONNABORTED' ||
      error.message.includes('timeout');

    if (shouldUseFallback) {
      console.log('📱 Using fallback system...');
      const { message } = req.body;
      return res.json(chatbotFallback.formatResponse(message));
    }

    // Unknown error
    res.status(500).json({
      success: false,
      message: 'Failed to get response from chatbot',
      error: error.message
    });
  }
};
