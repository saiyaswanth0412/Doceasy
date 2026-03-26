import axios from 'axios'

async function testSpecificMessage() {
  try {
    console.log('Testing specific message: "derma"\n')

    const backendUrl = 'http://localhost:4000'
    const testMsg = 'derma'
    
    const response = await axios.post(`${backendUrl}/api/chatbot/send-message`, {
      message: testMsg
    }, { timeout: 40000 })

    console.log('✅ Success!')
    console.log('Reply:', response.data.reply)

  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', JSON.stringify(error.response.data, null, 2))
    }
  }
}

testSpecificMessage()
