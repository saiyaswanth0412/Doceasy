import mongoose from 'mongoose'
import { config } from 'dotenv'

config()

import doctorModel from './models/doctorModel.js'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/appointy')
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

const checkDoctors = async () => {
  try {
    console.log('\n📊 Checking all doctors in database...\n')
    
    const allDoctors = await doctorModel.find({})
    console.log(`Total doctors: ${allDoctors.length}\n`)
    
    const doctorsWithLocation = allDoctors.filter(d => d.location && d.location.coordinates)
    const doctorsWithoutLocation = allDoctors.filter(d => !d.location || !d.location.coordinates)
    
    console.log(`✅ Doctors WITH location: ${doctorsWithLocation.length}`)
    console.log(`❌ Doctors WITHOUT location: ${doctorsWithoutLocation.length}\n`)
    
    console.log('Doctors with location details:')
    doctorsWithLocation.forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.name} (${doc.speciality})`)
      console.log(`   Email: ${doc.email}`)
      console.log(`   Location: [${doc.location.coordinates}]`)
      console.log(`   Address: ${doc.address}\n`)
    })
    
    if (doctorsWithoutLocation.length > 0) {
      console.log('\nDoctors without location:')
      doctorsWithoutLocation.forEach((doc, index) => {
        console.log(`${index + 1}. ${doc.name} (${doc.speciality})`)
      })
    }
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error checking doctors:', error)
    process.exit(1)
  }
}

connectDB().then(() => {
  checkDoctors()
})
