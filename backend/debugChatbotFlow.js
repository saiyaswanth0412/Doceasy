import axios from 'axios'

async function testChatbotConversation() {
  try {
    console.log('=== Testing Chatbot Conversation Flow ===\n')

    const backendUrl = 'http://localhost:4000'
    const messages = [
      'find one dermatologist',
      'suggest me',
      'derma',
      'I have a preferred doctor'
    ]

    for (const msg of messages) {
      console.log(`📝 User: ${msg}`)
      
      try {
        const response = await axios.post(`${backendUrl}/api/chatbot/send-message`, {
          message: msg
        }, { timeout: 15000 })

        if (response.data.success) {
          console.log(`🤖 Bot: ${response.data.reply}\n`)
        } else {
          console.log(`❌ Error: ${response.data.message}\n`)
        }
      } catch (error) {
        console.error(`❌ Request failed: ${error.message}\n`)
      }
    }

  } catch (error) {
    console.error('Test error:', error.message)
  }
}

testChatbotConversation()
