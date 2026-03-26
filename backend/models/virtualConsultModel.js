import mongoose from 'mongoose'

const virtualConsultSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String, default: '' },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    symptoms: { type: String, required: true },
    duration: { type: String, required: true },
    medicalHistory: { type: String, default: '' },
    currentMedications: { type: String, default: '' },
    preferredSpeciality: { type: String, required: true },
    preferredDoctorId: { type: String, default: '' },
    preferredDoctorName: { type: String, default: '' },
    assignedDoctorId: { type: String, required: true },
    assignedDoctorName: { type: String, required: true },
    assignedSpeciality: { type: String, required: true },
    problemSummary: { type: String, required: true },
    status: { type: String, enum: ['pending', 'replied'], default: 'pending' },
    doctorReply: { type: String, default: '' },
    repliedAt: { type: Number, default: null },
    createdAtTs: { type: Number, default: Date.now }
  },
  { minimize: false, timestamps: true }
)

const virtualConsultModel =
  mongoose.models.virtual_consult ||
  mongoose.model('virtual_consult', virtualConsultSchema)

export default virtualConsultModel
