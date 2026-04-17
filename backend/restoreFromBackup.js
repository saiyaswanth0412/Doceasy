import fs from 'fs';
import { BSON } from 'bson';
import mongoose from 'mongoose';
import 'dotenv/config';
import doctorModel from './models/doctorModel.js';

const restoreFromBSON = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(`${process.env.MONGODB_URI}/appointy`);
    console.log('✅ Connected to MongoDB');

    // Read BSON file
    const bsonPath = 'c:\\Users\\yaswa\\OneDrive\\Desktop\\mongo-backup\\appointy\\doctors.bson';
    const bsonData = fs.readFileSync(bsonPath);
    
    console.log(`📁 Reading BSON backup: ${bsonPath}`);
    console.log(`📊 File size: ${bsonData.length} bytes`);

    // Parse BSON data (it's a sequence of BSON documents)
    let offset = 0;
    const doctors = [];
    
    while (offset < bsonData.length) {
      try {
        // Each BSON document starts with a 4-byte size
        const size = bsonData.readUInt32LE(offset);
        if (size <= 0 || offset + size > bsonData.length) break;
        
        // Extract and parse the BSON document
        const documentBuffer = bsonData.slice(offset, offset + size);
        const doc = BSON.deserialize(documentBuffer);
        doctors.push(doc);
        
        offset += size;
      } catch (e) {
        break;
      }
    }

    console.log(`\n✅ Found ${doctors.length} doctors in backup\n`);

    if (doctors.length === 0) {
      console.log('❌ No doctors found in BSON file');
      process.exit(1);
    }

    // Clear existing doctors
    console.log('🗑️  Clearing current doctors...');
    await doctorModel.deleteMany({});

    // Insert all doctors
    await doctorModel.insertMany(doctors);
    console.log(`✅ Restored ${doctors.length} doctors successfully!\n`);

    // Show restored doctors
    const restoredDoctors = await doctorModel.find({}).select('name email speciality');
    console.log('Restored Doctor List:');
    restoredDoctors.forEach(doc => {
      console.log(`- ${doc.name} (${doc.speciality})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Restoration error:', error.message);
    process.exit(1);
  }
};

restoreFromBSON();
