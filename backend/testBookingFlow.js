import 'dotenv/config'
import axios from 'axios'

async function testChatbotBooking() {
  try {
    console.log('=== Testing Chatbot Appointment Booking ===\n')

    // Step 1: User initiates booking request
    console.log('📝 Step 1: User asks to book appointment\n')
    const response1 = await axios.post('http://localhost:4000/api/chatbot/send-message', {
      message: 'I would like to book an appointment with a cardiologist next week on March 30, 2026 at 10:00 AM'
    })

    console.log('🤖 Chatbot:', response1.data.reply)
    console.log('\nBooking Data:', response1.data.bookingData)
    console.log('\n---\n')

    // Step 2: Simulate another message if needed
    console.log('📝 Step 2: Follow-up\n')
    const response2 = await axios.post('http://localhost:4000/api/chatbot/send-message', {
      message: 'Yes, I confirm Dr. Rajesh Sharma on 2026-03-30 at 10:00'
    })

    console.log('🤖 Chatbot:', response2.data.reply)
    console.log('\nBooking Data:', response2.data.bookingData)

    if (response2.data.bookingData) {
      console.log('\n✅ Booking ready to be processed!')
      console.log('\n📝 Step 3: Process Booking\n')
      
      // Step 3: Actually book the appointment
      const bookingResponse = await axios.post('http://localhost:4000/api/chatbooking/book-via-chatbot', {
        userEmail: 'patient1@appointy.com',
        doctorName: response2.data.bookingData.doctorName,
        specialization: response2.data.bookingData.specialization,
        slotDate: response2.data.bookingData.slotDate,
        slotTime: response2.data.bookingData.slotTime
      })

      if (bookingResponse.data.success) {
        console.log('✅ ' + bookingResponse.data.message)
        console.log('\n📋 Appointment Details:')
        console.log(JSON.stringify(bookingResponse.data.appointmentDetails, null, 2))
      } else {
        console.log('❌ ' + bookingResponse.data.message)
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.response?.data) {
      console.error('Response:', error.response.data)
    }
  }
}

testChatbotBooking()
