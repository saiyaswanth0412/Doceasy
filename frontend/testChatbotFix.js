import axios from 'axios'

async function testChatbot() {
  try {
    console.log('Testing chatbot from frontend perspective...\n')
    
    const backendURL = 'http://localhost:4000' // What frontend now uses
    
    const response = await axios.post(`${backendURL}/api/chatbot/send-message`, {
      message: 'Hi, I want to book an appointment'
    })

    if (response.status === 200) {
      console.log('✅ Chatbot responds successfully!')
      console.log('\nChatbot reply:')
      console.log(response.data.reply)
      
      if (response.data.bookingData) {
        console.log('\n📋 Booking data ready:')
        console.log(JSON.stringify(response.data.bookingData, null, 2))
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testChatbot()
