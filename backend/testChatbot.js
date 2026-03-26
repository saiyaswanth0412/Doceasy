import 'dotenv/config'
import axios from 'axios'

async function testGeminiChatbot() {
  try {
    console.log('Testing Gemini-powered Chatbot...\n')

    const response = await axios.post('http://localhost:4000/api/chatbot/send-message', {
      message: 'Hi, I want to book an appointment with a cardiologist. Can you help?'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    })

    console.log('✅ Response Status:', response.status)
    console.log('\n📋 Response Data:')
    console.log(JSON.stringify(response.data, null, 2))

    if (response.data.success) {
      console.log('\n✅ SUCCESS! Chatbot Reply:')
      console.log(`\nQ: Hi, I want to book an appointment with a cardiologist. Can you help?`)
      console.log(`\nA: ${response.data.reply}`)
    } else {
      console.log('\n❌ Error:', response.data.message)
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    if (error.response) {
      console.error('Response data:', error.response.data)
    }
  }
}

testGeminiChatbot()
