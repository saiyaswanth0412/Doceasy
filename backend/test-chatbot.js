import axios from 'axios';
import 'dotenv/config';

const testChatbot = async () => {
  try {
    console.log('🧪 Testing Chatbot API Endpoint...');
    console.log('📍 Endpoint: http://localhost:4000/api/chatbot/send-message');
    console.log('🔑 GITHUB_TOKEN:', process.env.GITHUB_TOKEN ? '✅ Configured' : '❌ Missing');
    
    // Test with dummy token (just to see if endpoint responds)
    const response = await axios.post(
      'http://localhost:4000/api/chatbot/send-message',
      { message: 'Hello, test message' },
      {
        headers: {
          'Authorization': 'Bearer test-token-123',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('\n✅ API Response Received!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('\n⚠️ API Response (Error as expected):');
    console.log('Status:', error.response?.status);
    console.log('Response:', JSON.stringify(error.response?.data, null, 2));
    console.log('\nError Message:', error.message);
  }
};

testChatbot();
