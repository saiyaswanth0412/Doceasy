import mongoose from 'mongoose'
import { config } from 'dotenv'

config()

// Import doctor model
import doctorModel from './models/doctorModel.js'

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://yaswanth0412:kgPSbCSoqvrfJqY6@cluster0.n375v.mongodb.net/appointy')
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

// Fullerton, California coordinates
const FULLERTON_LAT = 33.8753
const FULLERTON_LON = -117.9245

const fullertonDoctors = [
  {
    name: 'Dr. Sarah Martinez',
    email: 'sarah.martinez@fullerton.health',
    phone: '(714) 555-0101',
    password: 'doctor123',
    speciality: 'Cardiology',
    degree: 'MD',
    experience: 12,
    about: 'Experienced cardiologist with expertise in coronary artery disease and cardiac interventions',
    fees: 500,
    address: '123 Harbor Blvd, Fullerton, CA 92832',
    available: true,
    image: 'https://via.placeholder.com/150?text=Dr.+Sarah+Martinez',
    date: new Date(),
    location: {
      type: 'Point',
      coordinates: [FULLERTON_LON, FULLERTON_LAT]
    }
  },
  {
    name: 'Dr. James Wilson',
    email: 'james.wilson@fullerton.health',
    phone: '(714) 555-0102',
    password: 'doctor123',
    speciality: 'Neurology',
    degree: 'MD',
    experience: 15,
    about: 'Specialist in neurological disorders and stroke management',
    fees: 550,
    address: '456 Sunny Hills Dr, Fullerton, CA 92835',
    available: true,
    image: 'https://via.placeholder.com/150?text=Dr.+James+Wilson',
    date: new Date(),
    location: {
      type: 'Point',
      coordinates: [FULLERTON_LON - 0.01, FULLERTON_LAT + 0.005]
    }
  },
  {
    name: 'Dr. Emily Chen',
    email: 'emily.chen@fullerton.health',
    phone: '(714) 555-0103',
    password: 'doctor123',
    speciality: 'Pediatrics',
    degree: 'MD',
    experience: 8,
    about: 'Compassionate pediatrician dedicated to child health and development',
    fees: 400,
    address: '789 Bastanchury Rd, Fullerton, CA 92835',
    available: true,
    image: 'https://via.placeholder.com/150?text=Dr.+Emily+Chen',
    date: new Date(),
    location: {
      type: 'Point',
      coordinates: [FULLERTON_LON + 0.01, FULLERTON_LAT - 0.005]
    }
  },
  {
    name: 'Dr. Robert Johnson',
    email: 'robert.johnson@fullerton.health',
    phone: '(714) 555-0104',
    password: 'doctor123',
    speciality: 'Orthopedics',
    degree: 'MD',
    experience: 20,
    about: 'Expert in orthopedic surgery and sports medicine',
    fees: 600,
    address: '321 Associated Rd, Fullerton, CA 92835',
    available: true,
    image: 'https://via.placeholder.com/150?text=Dr.+Robert+Johnson',
    date: new Date(),
    location: {
      type: 'Point',
      coordinates: [FULLERTON_LON + 0.005, FULLERTON_LAT + 0.01]
    }
  },
  {
    name: 'Dr. Jennifer Lee',
    email: 'jennifer.lee@fullerton.health',
    phone: '(714) 555-0105',
    password: 'doctor123',
    speciality: 'Dermatology',
    degree: 'MD',
    experience: 10,
    about: 'Skilled dermatologist specializing in skin conditions and cosmetic treatments',
    fees: 450,
    address: '654 Buena Vista Ave, Fullerton, CA 92835',
    available: true,
    image: 'https://via.placeholder.com/150?text=Dr.+Jennifer+Lee',
    date: new Date(),
    location: {
      type: 'Point',
      coordinates: [FULLERTON_LON - 0.005, FULLERTON_LAT - 0.01]
    }
  }
]

const seedFullertonDoctors = async () => {
  try {
    console.log('\n📍 Adding Fullerton doctors...\n')
    
    for (const doctor of fullertonDoctors) {
      // Check if doctor already exists
      const exists = await doctorModel.findOne({ email: doctor.email })
      
      if (exists) {
        console.log(`⏭️  Skipping ${doctor.name} - already exists`)
        continue
      }
      
      // Create new doctor
      const newDoctor = await doctorModel.create(doctor)
      console.log(`✅ Added ${doctor.name} at Fullerton`)
      console.log(`   📍 Location: ${newDoctor.location.coordinates}`)
    }
    
    console.log('\n✅ Fullerton doctors seeding complete!')
    console.log(`📊 Total Fullerton doctors: ${fullertonDoctors.length}`)
    console.log(`📍 Area: Fullerton, California (${FULLERTON_LAT}, ${FULLERTON_LON})`)
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding doctors:', error)
    process.exit(1)
  }
}

// Run the seeding
connectDB().then(() => {
  seedFullertonDoctors()
})
