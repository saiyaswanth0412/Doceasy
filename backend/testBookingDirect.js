import 'dotenv/config'
import axios from 'axios'

async function testBookingEndpoint() {
  try {
    console.log('Testing booking endpoint directly...\n')
    console.log('Request payload:')
    const payload = {
      userEmail: 'patient1@appointy.com',
      doctorName: 'Dr. Vikas Singh',
      specialization: 'Cardiologist',
      slotDate: '2026-03-29',
      slotTime: '14:00'
    }
    console.log(JSON.stringify(payload, null, 2))

    const response = await axios.post(
      'http://localhost:4000/api/chatbooking/book-via-chatbot',
      payload
    )

    console.log('\n\nResponse:')
    console.log(JSON.stringify(response.data, null, 2))

  } catch (error) {
    console.error('Error:', error.message)
    if (error.response) {
      console.log('\nResponse Data:')
      console.log(JSON.stringify(error.response.data, null, 2))
    }
  }
}

testBookingEndpoint()
