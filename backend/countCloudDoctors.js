import mongoose from 'mongoose'
import { config } from 'dotenv'

config()

import doctorModel from './models/doctorModel.js'

await mongoose.connect(process.env.MONGODB_URI)
const count = await doctorModel.countDocuments()
console.log(`Total doctors in MongoDB Atlas cloud: ${count}`)

const withLocation = await doctorModel.countDocuments({ 'location.coordinates': { $exists: true } })
console.log(`Doctors WITH location field: ${withLocation}`)

process.exit(0)
