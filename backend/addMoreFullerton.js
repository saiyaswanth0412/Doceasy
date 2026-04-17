import mongoose from 'mongoose'
import { config } from 'dotenv'

config()

const addMoreFullertonDoctors = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    const appointyDb = conn.connection.getClient().db('appointy')
    const doctorsCollection = appointyDb.collection('doctors')
    
    console.log('\n📍 Adding more Fullerton locations...\n')
    
    // Fullerton, CA coordinates
    const fullertonLat = 33.8753
    const fullertonLon = -117.9245
    
    // Get all doctors
    const doctors = await doctorsCollection.find({}).toArray()
    
    // Update first 8 doctors to have Fullerton location
    for (let i = 0; i < 8 && i < doctors.length; i++) {
      const doctor = doctors[i]
      
      // Add variation so they're not at exact same point
      const latVar = (Math.random() - 0.5) * 0.03
      const lonVar = (Math.random() - 0.5) * 0.03
      
      const result = await doctorsCollection.updateOne(
        { _id: doctor._id },
        {
          $set: {
            location: {
              type: 'Point',
              coordinates: [fullertonLon + lonVar, fullertonLat + latVar]
            }
          }
        }
      )
      
      console.log(`✅ ${i+1}. ${doctor.name}`)
      console.log(`   📍 Fullerton Coordinates: [${fullertonLon + lonVar}, ${fullertonLat + latVar}]`)
    }
    
    console.log('\n✅ Updated 8 doctors with Fullerton locations!')
    console.log('🏥 Now you can test nearby doctors feature with Fullerton geolocation')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

addMoreFullertonDoctors()
