import 'dotenv/config'
import axios from 'axios'

async function testChatbotResponse() {
  try {
    console.log('Testing Chatbot Response with JSON...\n')

    const response = await axios.post('http://localhost:4000/api/chatbot/send-message', {
      message: 'I want to book with Dr. Rajesh Sharma for cardiology on 2026-03-30 at 09:00'
    })

    console.log('Full Response:')
    console.log(JSON.stringify(response.data, null, 2))

    console.log('\n\nReply Text:')
    console.log(response.data.reply)

    console.log('\n\nBooking Data:')
    console.log(response.data.bookingData)

  } catch (error) {
    console.error('Error:', error.message)
  }
}

testChatbotResponse()
