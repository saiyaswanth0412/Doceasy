import axios from 'axios';

async function testChatbotWithFallback() {
  const baseUrl = 'http://localhost:4000/api/chatbot/send-message';
  
  const testMessages = [
    'derma',
    'find one dermatologist',
    'Hi, I need a cardiologist',
    'What doctors are available?',
    'I want to book an appointment'
  ];

  for (const msg of testMessages) {
    console.log(`\n📝 Testing: "${msg}"`);
    try {
      const response = await axios.post(baseUrl, { message: msg });
      console.log(`✅ Reply: ${response.data.reply.substring(0, 100)}...`);
      if (response.data.bookingData) {
        console.log(`📅 Booking data detected`);
      }
      if (response.data.fallback) {
        console.log(`📱 (Fallback response)`);
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
    
    // Wait 2 seconds between messages
    await new Promise(r => setTimeout(r, 2000));
  }
}

testChatbotWithFallback();
