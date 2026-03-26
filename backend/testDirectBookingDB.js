import 'dotenv/config'
import mongoose from 'mongoose'
import userModel from './models/userModel.js'
import doctorModel from './models/doctorModel.js'
import appointmentModel from './models/appointmentModel.js'

async function testDirectBooking() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to DB\n')

    // Get patient
    const patient = await userModel.findOne({ email: 'patient1@appointy.com' })
    console.log('Patient:', patient.name)

    // Get doctor  
    const doctor = await doctorModel.findOne({ name: { $regex: 'Vikas', $options: 'i' } })
    console.log('Doctor:', doctor.name)

    // Check and update slots
    const slotDate = '2026-03-29'
    const slotTime = '14:00'
    
    let slots = doctor.slots_booked || {}
    if (!slots[slotDate]) {
      slots[slotDate] = []
    }
    
    if (slots[slotDate].includes(slotTime)) {
      console.log('❌ Slot already booked')
      return
    }

    slots[slotDate].push(slotTime)

    // Create appointment
    const appointment = {
      userId: patient._id,
      docId: doctor._id,
      userData: patient,
      docData: doctor,
      amount: doctor.fees,
      slotTime,
      slotDate,
      date: Date.now()
    }

    const newAppointment = await appointmentModel.create(appointment)
    await doctorModel.findByIdAndUpdate(doctor._id, { slots_booked: slots })

    console.log('\n✅ APPOINTMENT BOOKED SUCCESSFULLY!')
    console.log('Appointment ID:', newAppointment._id)
    console.log('Doctor:', doctor.name)
    console.log('Date:', slotDate)
    console.log('Time:', slotTime)
    console.log('Fees: ₹' + doctor.fees)

    await mongoose.disconnect()
  } catch (error) {
    console.error('Error:', error.message)
    if (error.response) console.error('Details:', error.response.data)
  }
}

testDirectBooking()
