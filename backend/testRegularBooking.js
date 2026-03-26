import 'dotenv/config'
import axios from 'axios'
import userModel from './models/userModel.js'
import mongoose from 'mongoose'

async function testRegularBooking() {
  try {
    // First, connect to database directly and verify users
    await mongoose.connect(process.env.MONGODB_URI)
    
    const patient = await userModel.findOne({ email: 'patient1@appointy.com' })
    console.log('Patient found:', patient ? patient._id : 'NOT FOUND')
    console.log('Patient email:', patient?.email)
    
    if(!patient) {
      console.log('❌ Patient does not exist in database!')
      await mongoose.disconnect()
      return
    }

    console.log('\n✅ Patient ID:', patient._id)
    console.log('✅ Patient Email:', patient.email)

    // Now test the booking via the server endpoint (regular booking, not chatbot)
    console.log('\nTesting regular appointment booking...')
    const response = await axios.post('http://localhost:4000/api/user/book-appointment', {
      userId: patient._id.toString(),
      docId: '67617cf0ab4e1a002222222b', // Need to get actual docId
      slotDate: '2026-03-29',
      slotTime: '14:00'
    }, {
      headers: {
        'Authorization': `Bearer test-token`
      }
    })

    console.log('Response:', response.data)
    
    await mongoose.disconnect()
  } catch (error) {
    console.error('Error:', error.message)
    if (error.response?.data) {
      console.error('Response:', error.response.data)
    }
  }
}

testRegularBooking()
