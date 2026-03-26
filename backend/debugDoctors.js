import mongoose from 'mongoose'
import 'dotenv/config'
import doctorModel from './models/doctorModel.js'

async function checkDoctors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB Connected')
    
    const doctors = await doctorModel.find({}, 'name speciality').lean()
    console.log('\n👨‍⚕️ All Doctors:')
    doctors.forEach((doc, i) => {
      console.log(`   ${i + 1}. ${doc.name} - ${doc.speciality}`)
    })

    // Search for Vikas
    const vikas = await doctorModel.findOne({ name: { $regex: 'Vikas', $options: 'i' } }, 'name speciality')
    console.log('\n🔍 Dr. Vikas Singh:')
    console.log(vikas)

    // Search by speciality
    const cardiologists = await doctorModel.find({ speciality: 'Cardiologist' }, 'name')
    console.log('\nCardiologists found:', cardiologists.length)

    await mongoose.disconnect()
  } catch (error) {
    console.error('Error:', error.message)
  }
}

checkDoctors()
