import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function countDoctors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const db = mongoose.connection.db;
    const collection = db.collection('doctors');
    
    const allDoctors = await collection.find({}).toArray();
    
    console.log('\n========================================');
    console.log('TOTAL DOCTORS IN DATABASE:', allDoctors.length);
    console.log('========================================\n');
    
    allDoctors.forEach((doc, i) => {
      console.log(`${i+1}. ${doc.name} (${doc.speciality})`);
    });
    
    console.log('\n========================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

countDoctors();
