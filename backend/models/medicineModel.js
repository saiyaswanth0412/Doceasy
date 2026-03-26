import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  dosage: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ['Antibiotic', 'Painkiller', 'Vitamin', 'Allergy', 'Digestive', 'Cough', 'Cold', 'Antacid', 'Other'],
    default: 'Other',
  },
  sideEffects: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const medicineModel = mongoose.models.medicine || mongoose.model('medicine', medicineSchema);

export default medicineModel;
