const axios = require('axios');

async function testChatbot() {
  try {
    console.log('Sending message "derma" to chatbot...\n');
    const response = await axios.post('http://localhost:4000/api/chatbot/send-message', {
      message: 'derma'
    });
    
    console.log('\n✅ Response received:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('\n❌ Request failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.message);
    if (error.response?.data) {
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testChatbot();
