import axios from 'axios'

async function testChatbotErrorDetailed() {
  try {
    console.log('=== Testing with Error Details ===\n')

    const backendUrl = 'http://localhost:4000'
    
    const testMsg = 'find one dermatologist'
    console.log(`📝 Testing message: "${testMsg}"\n`)
    
    const response = await axios.post(`${backendUrl}/api/chatbot/send-message`, {
      message: testMsg
    }, { timeout: 15000 })

    console.log('Status:', response.status)
    console.log('Response:')
    console.log(JSON.stringify(response.data, null, 2))

  } catch (error) {
    console.error('❌ Request error:', error.message)
    if (error.response) {
      console.error('\nResponse status:', error.response.status)
      console.error('Response data:')
      console.error(JSON.stringify(error.response.data, null, 2))
    }
  }
}

testChatbotErrorDetailed()
