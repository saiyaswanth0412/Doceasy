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

// Coordinates for different cities
const locations = {
  hyderabad: { lat: 17.385, lon: 78.4734 },
  fullerton: { lat: 33.8753, lon: -117.9245 },
  newyork: { lat: 40.7128, lon: -74.0060 },
  losangeles: { lat: 34.0522, lon: -118.2437 }
}

const updateLocations = async () => {
  try {
    console.log('\n📍 Updating all doctors with location data...\n')
    
    const allDoctors = await doctorModel.find({})
    console.log(`Found ${allDoctors.length} doctors to update\n`)
    
    const cityOrder = ['hyderabad', 'fullerton', 'newyork', 'losangeles']
    
    for (let i = 0; i < allDoctors.length; i++) {
      const doctor = allDoctors[i]
      const cityKey = cityOrder[i % cityOrder.length]
      const city = locations[cityKey]
      
      // Add small variation so doctors aren't at exact same location
      const latVariation = (Math.random() - 0.5) * 0.02
      const lonVariation = (Math.random() - 0.5) * 0.02
      
      const updatedDoctor = await doctorModel.findByIdAndUpdate(
        doctor._id,
        {
          location: {
            type: 'Point',
            coordinates: [city.lon + lonVariation, city.lat + latVariation]
          }
        },
        { new: true }
      )
      
      console.log(`✅ Updated ${i + 1}. ${updatedDoctor.name} (${cityKey})`)
      console.log(`   📍 Location: [${updatedDoctor.location.coordinates}]`)
    }
    
    console.log('\n✅ All doctors updated with location data!')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error updating doctors:', error)
    process.exit(1)
  }
}

connectDB().then(() => {
  updateLocations()
})
