import mongoose from 'mongoose';
import 'dotenv/config';
import doctorModel from './models/doctorModel.js';

const updateDoctorPhotos = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/appointy`);
    console.log('✅ Connected to MongoDB\n');

    // Get all existing doctors
    const existingDoctors = await doctorModel.find({}).select('_id name email');
    console.log(`📌 Found ${existingDoctors.length} existing doctors\n`);

    // Unsplash photo URLs - diverse and professional
    const unsplashPhotos = [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
    ];

    console.log('🖼️  Updating doctor photos...\n');
    let updated = 0;

    for (let i = 0; i < existingDoctors.length; i++) {
      const doctor = existingDoctors[i];
      const photoUrl = unsplashPhotos[i % unsplashPhotos.length];

      // Update ONLY the image field - nothing else!
      const result = await doctorModel.findByIdAndUpdate(
        doctor._id,
        { image: photoUrl },
        { new: true }
      ).select('name email image');

      console.log(`✅ ${i + 1}. ${result.name}`);
      console.log(`   📷 Photo: ${photoUrl}\n`);
      updated++;
    }

    console.log(`\n🎉 Successfully updated ${updated} doctor photos!`);
    console.log('📌 All other data is SAFE - nothing was deleted or changed');

    // Verify all doctors still have their data
    const allDoctors = await doctorModel.find({}).select('name speciality fees');
    console.log('\n✅ Verification - All doctors intact:');
    allDoctors.forEach((doc, i) => {
      console.log(`${i + 1}. ${doc.name} | ${doc.speciality} | $${doc.fees}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating photos:', error.message);
    process.exit(1);
  }
};

updateDoctorPhotos();
