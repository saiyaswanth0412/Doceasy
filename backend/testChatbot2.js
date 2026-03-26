import 'dotenv/config'
import axios from 'axios'

async function testGeminiChatbot2() {
  try {
    console.log('Testing Gemini Chatbot - Follow-up Question...\n')

    const response = await axios.post('http://localhost:4000/api/chatbot/send-message', {
      message: 'What information do you need from me to complete the booking?'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.data.success) {
      console.log('✅ SUCCESS!\n')
      console.log(`Q: What information do you need from me to complete the booking?\n`)
      console.log(`A: ${response.data.reply}`)
    } else {
      console.log('❌ Error:', response.data.message)
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    if (error.response?.data) {
      console.error('Response:', error.response.data)
    }
  }
}

testGeminiChatbot2()
