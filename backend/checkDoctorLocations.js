import mongoose from "mongoose";
import dotenv from "dotenv";
import doctorModel from "./models/doctorModel.js";

dotenv.config();

const checkDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Just READ, don't modify
    const totalDoctors = await doctorModel.countDocuments();
    console.log(`\n📊 Total doctors in database: ${totalDoctors}`);

    // Check which doctors have location
    const withLocation = await doctorModel.countDocuments({ location: { $exists: true } });
    const withoutLocation = totalDoctors - withLocation;

    console.log(`✅ Doctors WITH location: ${withLocation}`);
    console.log(`⚠️  Doctors WITHOUT location: ${withoutLocation}`);

    // Show sample doctor
    const sample = await doctorModel.findOne().lean();
    if (sample) {
      console.log(`\n📍 Sample Doctor: ${sample.name}`);
      console.log(`   Location: ${sample.location ? JSON.stringify(sample.location) : "Not set"}`);
    }

    console.log("\n✅ Database check complete - NO DATA MODIFIED");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

checkDoctors();
