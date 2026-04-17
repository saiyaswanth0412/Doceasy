import mongoose from 'mongoose';
import 'dotenv/config';
import doctorModel from './models/doctorModel.js';

const checkDoctorPhotos = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/appointy`);
    console.log('✅ Connected to MongoDB\n');

    const doctors = await doctorModel.find({}).select('name email image');
    
    console.log(`📊 Checking ${doctors.length} doctors:\n`);
    
    doctors.forEach((doc, i) => {
      console.log(`${i + 1}. ${doc.name} (${doc.email})`);
      
      if (doc.image.startsWith('data:image')) {
        console.log('   ❌ Uses Base64 (NOT Cloudinary)');
      } else if (doc.image.includes('cloudinary.com') || doc.image.includes('res.cloudinary')) {
        console.log('   ✅ Uses Cloudinary CDN');
        console.log(`   URL: ${doc.image.substring(0, 80)}...`);
      } else if (doc.image.includes('unsplash')) {
        console.log('   📸 Uses Unsplash URL');
      } else {
        console.log(`   ℹ️  Other URL type: ${doc.image.substring(0, 50)}...`);
      }
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkDoctorPhotos();
