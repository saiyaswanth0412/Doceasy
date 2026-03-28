import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import adminModel from './models/adminModel.js';
import doctorModel from './models/doctorModel.js';
import userModel from './models/userModel.js';

const seedTestUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 MongoDB Connected');

    // ===== ADMIN USER =====
    const adminPassword = await bcrypt.hash('your_admin_password', 10);
    const admin = await adminModel.findOneAndUpdate(
      { email: 'admin@example.com' },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        date: Date.now()
      },
      { upsert: true, new: true }
    );
    console.log('✅ Admin created/updated');

    // ===== DOCTOR USERS =====
    const doctorPassword = await bcrypt.hash('doctor123', 10);
    const doctors = [
      {
        name: 'Dr. Vikas Singh',
        email: 'doctor1@appointy.com',
        password: doctorPassword,
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemS...',
        speciality: 'Cardiologist',
        degree: 'MBBS, MD',
        experience: '10 years',
        about: 'Expert cardiologist with 10 years of experience in treating heart conditions',
        available: true,
        fees: 500,
        address: { line1: 'Delhi', line2: 'India' },
        date: Date.now()
      },
      {
        name: 'Dr. Priya Sharma',
        email: 'doctor2@appointy.com',
        password: doctorPassword,
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemS...',
        speciality: 'Neurologist',
        degree: 'MBBS, MD',
        experience: '8 years',
        about: 'Specialized in neurological disorders and treatment',
        available: true,
        fees: 550,
        address: { line1: 'Mumbai', line2: 'India' },
        date: Date.now()
      },
      {
        name: 'Dr. Rajesh Patel',
        email: 'doctor3@appointy.com',
        password: doctorPassword,
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemS...',
        speciality: 'General Physician',
        degree: 'MBBS',
        experience: '12 years',
        about: 'General physician with vast experience in family medicine',
        available: true,
        fees: 400,
        address: { line1: 'Bangalore', line2: 'India' },
        date: Date.now()
      }
    ];

    for (const doctorData of doctors) {
      const doctor = await doctorModel.findOneAndUpdate(
        { email: doctorData.email },
        doctorData,
        { upsert: true, new: true }
      );
      console.log(`✅ Doctor created: ${doctor.name}`);
    }

    // ===== PATIENT USERS =====
    const patientPassword = await bcrypt.hash('patient123', 10);
    const patients = [
      {
        name: 'John Doe',
        email: 'patient1@appointy.com',
        password: patientPassword,
        phone: '9876543210',
        address: { line1: 'Delhi', line2: 'India' },
        gender: 'Male',
        dob: '1990-05-15'
      },
      {
        name: 'Sarah Williams',
        email: 'patient2@appointy.com',
        password: patientPassword,
        phone: '9876543211',
        address: { line1: 'Mumbai', line2: 'India' },
        gender: 'Female',
        dob: '1988-03-22'
      },
      {
        name: 'Amit Kumar',
        email: 'patient3@appointy.com',
        password: patientPassword,
        phone: '9876543212',
        address: { line1: 'Bangalore', line2: 'India' },
        gender: 'Male',
        dob: '1995-07-10'
      }
    ];

    for (const patientData of patients) {
      const hashedPass = patientData.password;
      const patient = await userModel.findOneAndUpdate(
        { email: patientData.email },
        { ...patientData, password: hashedPass },
        { upsert: true, new: true }
      );
      console.log(`✅ Patient created: ${patient.name}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 TEST USERS CREATED SUCCESSFULLY!\n');
    
    console.log('📋 ADMIN CREDENTIALS:');
    console.log('   Email: admin@example.com');
    console.log('   Password: your_admin_password\n');

    console.log('👨‍⚕️ DOCTOR CREDENTIALS:');
    console.log('   Email: doctor1@appointy.com');
    console.log('   Email: doctor2@appointy.com');
    console.log('   Email: doctor3@appointy.com');
    console.log('   Password: doctor123\n');

    console.log('👤 PATIENT CREDENTIALS:');
    console.log('   Email: patient1@appointy.com');
    console.log('   Email: patient2@appointy.com');
    console.log('   Email: patient3@appointy.com');
    console.log('   Password: patient123\n');
    
    console.log('='.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    process.exit(1);
  }
};

seedTestUsers();
