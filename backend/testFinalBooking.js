import 'dotenv/config'
import axios from 'axios'

async function testFullBooking() {
  try {
    console.log('=== Complete Chatbot Appointment Booking Test ===\n')

    // Step 1: Get booking data from chatbot
    console.log('Step 1️⃣: Asking chatbot to book an appointment...\n')
    const chatResponse = await axios.post('http://localhost:4000/api/chatbot/send-message', {
      message: 'I want to book an appointment with Dr. Vikas Singh for cardiology on 2026-03-29 at 14:00'
    })

    console.log('🤖 Chatbot Response:')
    console.log(chatResponse.data.reply || '(Processing booking...)')
    
    if (chatResponse.data.bookingData) {
      console.log('\n✅ Booking Information Extracted:')
      console.log(JSON.stringify(chatResponse.data.bookingData, null, 2))
      
      // Step 2: Complete the booking
      console.log('\n\nStep 2️⃣: Completing the appointment booking...\n')
      
      const bookingResponse = await axios.post('http://localhost:4000/api/chatbooking/book-via-chatbot', {
        userEmail: 'patient1@appointy.com',
        doctorName: chatResponse.data.bookingData.doctorName,
        specialization: chatResponse.data.bookingData.specialization,
        slotDate: chatResponse.data.bookingData.slotDate,
        slotTime: chatResponse.data.bookingData.slotTime
      })

      if (bookingResponse.data.success) {
        console.log('✅ ' + bookingResponse.data.message)
        console.log('\n📋 Appointment Details:')
        const details = bookingResponse.data.appointmentDetails
        console.log(`   Doctor: ${details.doctor}`)
        console.log(`   Specialization: ${details.specialization}`)
        console.log(`   Date: ${details.date}`)
        console.log(`   Time: ${details.time}`)
        console.log(`   Fees: ₹${details.amount}`)
        console.log('\n🎉 Appointment Successfully Booked!')
      } else {
        console.log('❌ Booking Error:', bookingResponse.data.message)
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.response?.data) {
      console.error('Error Details:', error.response.data)
    }
  }
}

testFullBooking()
