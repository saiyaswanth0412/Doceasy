import mongoose from 'mongoose'
import { config } from 'dotenv'

config()

const checkRawDoctor = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    
    const appointyDb = conn.connection.getClient().db('appointy')
    const doctorsCollection = appointyDb.collection('doctors')
    
    const total = await doctorsCollection.countDocuments()
    console.log(`\n📊 Total doctors in raw collection: ${total}\n`)
    
    const withLoc = await doctorsCollection.countDocuments({ 'location.coordinates': { $exists: true, $ne: null } })
    console.log(`✅ Doctors WITH location.coordinates: ${withLoc}`)
    
    const withoutLoc = total - withLoc
    console.log(`❌ Doctors WITHOUT location.coordinates: ${withoutLoc}\n`)
    
    // Show all doctor names
    const doctors = await doctorsCollection.find({}).project({ name: 1, speciality: 1, location: 1 }).toArray()
    console.log('All doctors:')
    doctors.forEach((doc, i) => {
      const loc = doc.location ? `[${doc.location.coordinates}]` : 'null'
      console.log(`${i+1}. ${doc.name} (${doc.speciality}) - location: ${loc}`)
    })
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

checkRawDoctor()
