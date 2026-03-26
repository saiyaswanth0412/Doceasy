import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import 'dotenv/config'
import adminModel from './models/adminModel.js'
import doctorModel from './models/doctorModel.js'

const seedAuthData = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/appointy`)

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@doceasy.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!'

    const adminHash = await bcrypt.hash(adminPassword, 10)
    await adminModel.findOneAndUpdate(
      { email: adminEmail },
      {
        $set: { name: 'Doceasy Admin', password: adminHash },
        $setOnInsert: { date: Date.now() }
      },
      { upsert: true, new: true }
    )

    const existingDoctors = await doctorModel.countDocuments()

    if (existingDoctors === 0) {
      const sampleDoctors = [
        {
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@doceasy.com',
          password: await bcrypt.hash('Doctor123!', 10),
          image: 'https://res.cloudinary.com/demo/image/fetch/https://media.istockphoto.com/id/1438301623/photo/medical-doctor-posing-in-clinic.webp?w=500',
          speciality: 'General physician',
          degree: 'MBBS',
          experience: '8 years',
          about: 'Experienced general physician with a passion for preventive care and patient wellness.',
          available: true,
          fees: 50,
          slots_booked: {},
          address: { line1: '123 Medical Plaza', line2: 'New York, NY' },
          date: Date.now()
        },
        {
          name: 'Dr. Emily Chen',
          email: 'emily.chen@doceasy.com',
          password: await bcrypt.hash('Doctor123!', 10),
          image: 'https://res.cloudinary.com/demo/image/fetch/https://media.istockphoto.com/id/1205656455/photo/portrait-of-female-doctor-in-white-coat-at-hospital.webp?w=500',
          speciality: 'Gynecologist',
          degree: 'MBBS, MD (Gynecology)',
          experience: '10 years',
          about: 'Compassionate gynecologist specializing in womens health and reproductive care.',
          available: true,
          fees: 60,
          slots_booked: {},
          address: { line1: '456 Healthcare Center', line2: 'Los Angeles, CA' },
          date: Date.now()
        }
      ]

      await doctorModel.insertMany(sampleDoctors)
    }

    const admins = await adminModel.find({}, 'email').lean()
    const doctors = await doctorModel.find({}, 'email').lean()

    console.log('✅ Auth data seeded')
    console.log('Admin emails:', admins.map((item) => item.email).join(', '))
    console.log('Doctor emails:', doctors.map((item) => item.email).join(', '))
    console.log(`Admin password used: ${adminPassword}`)
    console.log('Doctor password used for seeded docs: Doctor123!')

    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error.message)
    process.exit(1)
  }
}

seedAuthData()
