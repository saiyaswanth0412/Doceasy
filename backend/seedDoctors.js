import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import doctorModel from './models/doctorModel.js';

const seedDoctors = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/appointy`);
    console.log('Connected to MongoDB');

    // Clear existing doctors (optional)
    // await doctorModel.deleteMany({});

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
        date: Date.now(),
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
        date: Date.now(),
      },
      {
        name: 'Dr. Michael Rodriguez',
        email: 'michael.rodriguez@doceasy.com',
        password: await bcrypt.hash('Doctor123!', 10),
        image: 'https://res.cloudinary.com/demo/image/fetch/https://media.istockphoto.com/id/1248240302/photo/portrait-of-happy-male-doctor-in-white-coat-at-hospital.webp?w=500',
        speciality: 'Dermatologist',
        degree: 'MBBS, MD (Dermatology)',
        experience: '7 years',
        about: 'Expert dermatologist treating skin conditions with the latest dermatological techniques.',
        available: true,
        fees: 55,
        slots_booked: {},
        address: { line1: '789 Skin Care Clinic', line2: 'Chicago, IL' },
        date: Date.now(),
      },
      {
        name: 'Dr. Lisa Anderson',
        email: 'lisa.anderson@doceasy.com',
        password: await bcrypt.hash('Doctor123!', 10),
        image: 'https://res.cloudinary.com/demo/image/fetch/https://media.istockphoto.com/id/1205656456/photo/portrait-of-female-doctor-with-stethoscope-at-hospital.webp?w=500',
        speciality: 'Pediatricians',
        degree: 'MBBS, MD (Pediatrics)',
        experience: '9 years',
        about: 'Dedicated pediatrician providing comprehensive healthcare for infants, children, and adolescents.',
        available: true,
        fees: 45,
        slots_booked: {},
        address: { line1: '321 Kids Health Center', line2: 'Houston, TX' },
        date: Date.now(),
      },
      {
        name: 'Dr. Robert Miller',
        email: 'robert.miller@doceasy.com',
        password: await bcrypt.hash('Doctor123!', 10),
        image: 'https://res.cloudinary.com/demo/image/fetch/https://media.istockphoto.com/id/1438301610/photo/portrait-of-male-doctor-smiling-at-hospital.webp?w=500',
        speciality: 'Neurologist',
        degree: 'MBBS, MD (Neurology)',
        experience: '12 years',
        about: 'Experienced neurologist specializing in neurological disorders and brain health.',
        available: true,
        fees: 70,
        slots_booked: {},
        address: { line1: '654 Brain Care Institute', line2: 'Boston, MA' },
        date: Date.now(),
      },
      {
        name: 'Dr. James Wilson',
        email: 'james.wilson@doceasy.com',
        password: await bcrypt.hash('Doctor123!', 10),
        image: 'https://res.cloudinary.com/demo/image/fetch/https://media.istockphoto.com/id/1205656452/photo/portrait-of-male-doctor-with-arms-crossed-at-hospital.webp?w=500',
        speciality: 'Gastroenterologist',
        degree: 'MBBS, MD (Gastroenterology)',
        experience: '11 years',
        about: 'Expert gastroenterologist diagnosing and treating digestive system disorders.',
        available: true,
        fees: 65,
        slots_booked: {},
        address: { line1: '987 Digestive Health Clinic', line2: 'Miami, FL' },
        date: Date.now(),
      },
    ];

    for (const doctorData of sampleDoctors) {
      await doctorModel.findOneAndUpdate(
        { email: doctorData.email },
        doctorData,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${sampleDoctors.length} sample doctors added/updated successfully!`);
    
    const doctors = await doctorModel.find({}).select('name email speciality');
    console.log('\nDoctor List:');
    doctors.forEach(doc => {
      console.log(`- ${doc.name} (${doc.speciality})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding doctors:', error.message);
    process.exit(1);
  }
};

seedDoctors();
