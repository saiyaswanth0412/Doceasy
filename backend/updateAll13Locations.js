import mongoose from 'mongoose'
import { config } from 'dotenv'

config()

const updateAll13Doctors = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    const appointyDb = conn.connection.getClient().db('appointy')
    const doctorsCollection = appointyDb.collection('doctors')
    
    console.log('\n📍 Adding location data to all 13 doctors...\n')
    
    // Coordinates for different cities
    const locations = [
      { lat: 17.385, lon: 78.4734, city: 'Hyderabad' },
      { lat: 33.8753, lon: -117.9245, city: 'Fullerton' },
      { lat: 40.7128, lon: -74.0060, city: 'New York' },
      { lat: 34.0522, lon: -118.2437, city: 'Los Angeles' }
    ]
    
    // Get all doctors
    const doctors = await doctorsCollection.find({}).toArray()
    
    for (let i = 0; i < doctors.length; i++) {
      const doctor = doctors[i]
      const locIndex = i % locations.length
      const city = locations[locIndex]
      
      // Add small variation
      const latVar = (Math.random() - 0.5) * 0.05
      const lonVar = (Math.random() - 0.5) * 0.05
      
      const result = await doctorsCollection.updateOne(
        { _id: doctor._id },
        {
          $set: {
            location: {
              type: 'Point',
              coordinates: [city.lon + lonVar, city.lat + latVar]
            }
          }
        }
      )
      
      console.log(`✅ ${i+1}. ${doctor.name} (${city.city})`)
      console.log(`   📍 Location: [${city.lon + lonVar}, ${city.lat + latVar}]`)
    }
    
    console.log('\n✅ Updated all 13 doctors with location data!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

updateAll13Doctors()
