import 'dotenv/config'
import axios from 'axios'

async function testFullBooking() {
  try {
    console.log('=== Full Booking Test ===\n')

    // Get booking data from chatbot
    console.log('Step 1: Getting booking recommendation from chatbot...\n')
    const chatResponse = await axios.post('http://localhost:4000/api/chatbot/send-message', {
      message: 'I want to book an appointment with Dr. Rajesh Sharma for cardiology on 2026-03-30 at 09:00'
    })

    console.log('Chatbot Reply:', chatResponse.data.reply || '(booking data extracted)')
    console.log('Booking Data:', chatResponse.data.bookingData)

    if (chatResponse.data.bookingData) {
      console.log('\n\nStep 2: Processing booking with patient email...\n')
      
      const bookingResponse = await axios.post('http://localhost:4000/api/chatbooking/book-via-chatbot', {
        userEmail: 'patient1@appointy.com',
        doctorName: chatResponse.data.bookingData.doctorName,
        specialization: chatResponse.data.bookingData.specialization,
        slotDate: chatResponse.data.bookingData.slotDate,
        slotTime: chatResponse.data.bookingData.slotTime
      })

      if (bookingResponse.data.success) {
        console.log('✅ ' + bookingResponse.data.message)
        console.log('\n📋 Appointment Confirmed:')
        console.log(JSON.stringify(bookingResponse.data.appointmentDetails, null, 2))
      } else {
        console.log('❌ Error:', bookingResponse.data.message)
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.response?.data) {
      console.error('Details:', error.response.data)
    }
  }
}

testFullBooking()
