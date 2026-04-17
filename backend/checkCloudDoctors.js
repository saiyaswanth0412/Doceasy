import mongoose from 'mongoose'
import { config } from 'dotenv'

config()

import doctorModel from './models/doctorModel.js'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://yaswanth0412:kgPSbCSoqvrfJqY6@cluster0.n375v.mongodb.net/appointy')
    console.log('✅ Connected to MongoDB Atlas')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

const checkCloudDoctors = async () => {
  try {
    console.log('\n📊 Checking doctors in MongoDB Atlas...\n')
    
    const allDoctors = await doctorModel.find({})
    console.log(`Total doctors: ${allDoctors.length}\n`)
    
    const withLocation = allDoctors.filter(d => d.location)
    const withoutLocation = allDoctors.filter(d => !d.location)
    
    console.log(`✅ Doctors WITH location field: ${withLocation.length}`)
    console.log(`❌ Doctors WITHOUT location field: ${withoutLocation.length}\n`)
    
    if (withLocation.length > 0) {
      console.log('Sample doctor WITH location:')
      const doc = withLocation[0]
      console.log(`Name: ${doc.name}`)
      console.log(`Location: ${JSON.stringify(doc.location)}`)
    }
    
    if (withoutLocation.length > 0) {
      console.log('\nSample doctor WITHOUT location:')
      const doc = withoutLocation[0]
      console.log(`Name: ${doc.name}`)
      console.log(`Location field exists: ${!!doc.location}`)
    }
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

connectDB().then(() => {
  checkCloudDoctors()
})
