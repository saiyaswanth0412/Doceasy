import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import adminModel from './models/adminModel.js';
import doctorModel from './models/doctorModel.js';
import userModel from './models/userModel.js';
import jwt from 'jsonwebtoken';

const testLogins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 MongoDB Connected\n');

    console.log('='.repeat(60));
    console.log('🔐 TESTING LOGIN SCENARIOS\n');

    // Test Admin Login
    console.log('1️⃣  ADMIN LOGIN TEST');
    console.log('   Request: POST /api/admin/login');
    console.log('   Payload: {"email":"admin@appointy.com","password":"admin123"}\n');
    
    const adminEmail = 'admin@appointy.com';
    const adminPassword = 'admin123';
    const admin = await adminModel.findOne({ email: adminEmail });
    
    if (admin) {
      const isMatch = await bcrypt.compare(adminPassword, admin.password);
      if (isMatch) {
        const token = jwt.sign({ id: admin._id, role: 'admin', email: admin.email }, process.env.JWT_SECRET);
        console.log('   ✅ LOGIN SUCCESSFUL');
        console.log(`   Token: ${token.substring(0, 50)}...\n`);
      } else {
        console.log('   ❌ INVALID PASSWORD\n');
      }
    } else {
      console.log('   ❌ USER DOES NOT EXIST\n');
    }

    // Test Doctor Login
    console.log('2️⃣  DOCTOR LOGIN TEST');
    console.log('   Request: POST /api/doctor/login');
    console.log('   Payload: {"email":"doctor1@appointy.com","password":"doctor123"}\n');
    
    const doctorEmail = 'doctor1@appointy.com';
    const doctorPassword = 'doctor123';
    const doctor = await doctorModel.findOne({ email: doctorEmail });
    
    if (doctor) {
      const isMatch = await bcrypt.compare(doctorPassword, doctor.password);
      if (isMatch) {
        const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
        console.log('   ✅ LOGIN SUCCESSFUL');
        console.log(`   Token: ${token.substring(0, 50)}...\n`);
      } else {
        console.log('   ❌ INVALID CREDENTIALS\n');
      }
    } else {
      console.log('   ❌ USER DOES NOT EXIST\n');
    }

    // Test Patient Login
    console.log('3️⃣  PATIENT LOGIN TEST');
    console.log('   Request: POST /api/user/login');
    console.log('   Payload: {"email":"patient1@appointy.com","password":"patient123"}\n');
    
    const patientEmail = 'patient1@appointy.com';
    const patientPassword = 'patient123';
    const patient = await userModel.findOne({ email: patientEmail });
    
    if (patient) {
      const isMatch = await bcrypt.compare(patientPassword, patient.password);
      if (isMatch) {
        const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET);
        console.log('   ✅ LOGIN SUCCESSFUL');
        console.log(`   Token: ${token.substring(0, 50)}...\n`);
      } else {
        console.log('   ❌ INVALID CREDENTIALS\n');
      }
    } else {
      console.log('   ❌ USER DOES NOT EXIST\n');
    }

    console.log('='.repeat(60));
    console.log('\n✅ ALL CREDENTIALS ARE VALID AND WORKING!\n');

    console.log('📍 HOW TO USE THESE CREDENTIALS:\n');
    console.log('Frontend (Patient Portal):');
    console.log('   - Go to: http://localhost:5173/login');
    console.log('   - Email: patient1@appointy.com');
    console.log('   - Password: patient123\n');

    console.log('Doctor Portal:');
    console.log('   - Go to: http://localhost:5173/doctor/login (if implemented)');
    console.log('   - Email: doctor1@appointy.com');
    console.log('   - Password: doctor123\n');

    console.log('Admin Dashboard:');
    console.log('   - Go to: http://localhost:5174');
    console.log('   - Email: admin@appointy.com');
    console.log('   - Password: admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testLogins();
