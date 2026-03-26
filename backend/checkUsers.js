import mongoose from 'mongoose';
import 'dotenv/config';
import adminModel from './models/adminModel.js';
import doctorModel from './models/doctorModel.js';
import userModel from './models/userModel.js';

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 MongoDB Connected\n');

    const admins = await adminModel.find({});
    console.log(`👤 ADMINS in database: ${admins.length}`);
    admins.forEach(a => console.log(`   - ${a.email}`));

    const doctors = await doctorModel.find({});
    console.log(`\n👨‍⚕️ DOCTORS in database: ${doctors.length}`);
    doctors.forEach(d => console.log(`   - ${d.email} (${d.name})`));

    const patients = await userModel.find({});
    console.log(`\n👥 PATIENTS in database: ${patients.length}`);
    patients.forEach(p => console.log(`   - ${p.email} (${p.name})`));

    console.log('\n' + '='.repeat(60));

    // Test login for each
    console.log('\n🔐 Testing login queries:\n');

    const testAdmin = await adminModel.findOne({ email: 'admin@appointy.com' });
    console.log(`Admin lookup: ${testAdmin ? '✅ Found' : '❌ Not found'}`);

    const testDoctor = await doctorModel.findOne({ email: 'doctor1@appointy.com' });
    console.log(`Doctor lookup: ${testDoctor ? '✅ Found' : '❌ Not found'}`);

    const testPatient = await userModel.findOne({ email: 'patient1@appointy.com' });
    console.log(`Patient lookup: ${testPatient ? '✅ Found' : '❌ Not found'}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkUsers();
