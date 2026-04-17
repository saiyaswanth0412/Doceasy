import mongoose from 'mongoose'
import { config } from 'dotenv'

config()
import doctorModel from './models/doctorModel.js'

await mongoose.connect(process.env.MONGODB_URI)
const total = await doctorModel.countDocuments()
console.log(`\n📊 Total doctors in Appointy: ${total}\n`)

const withLoc = await doctorModel.countDocuments({ 'location.coordinates': { $exists: true, $ne: null } })
console.log(`✅ Doctors WITH location coordinates: ${withLoc}`)

const withoutLoc = total - withLoc
console.log(`❌ Doctors WITHOUT location coordinates: ${withoutLoc}\n`)

// Show sample doctors
const sample = await doctorModel.find({}).limit(3).select('name speciality location')
console.log('Sample doctors:')
sample.forEach(doc => {
  console.log(`- ${doc.name} (${doc.speciality}): location = ${doc.location ? JSON.stringify(doc.location.coordinates) : 'null'}`)
})

process.exit(0)
