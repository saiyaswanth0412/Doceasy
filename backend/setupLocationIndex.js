import mongoose from "mongoose";
import dotenv from "dotenv";
import doctorModel from "./models/doctorModel.js";

dotenv.config();

const updateDoctorLocations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Set default locations for all doctors (if they don't have one)
    const result = await doctorModel.updateMany(
      { location: { $exists: false } },
      {
        $set: {
          location: {
            type: "Point",
            coordinates: [78.4734, 17.3850] // Default: Hyderabad, India
          }
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} doctors with default location`);

    // Ensure geospatial index exists
    await doctorModel.collection.createIndex({ location: "2dsphere" });
    console.log("✅ Geospatial index created");

    // List a sample doctor to verify
    const sample = await doctorModel.findOne().lean();
    if (sample) {
      console.log("📍 Sample doctor location:", sample.location);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

updateDoctorLocations();
