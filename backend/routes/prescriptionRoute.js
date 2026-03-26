import express from 'express';
import {
  createPrescription,
  getAllMedicines,
  getMedicinesByCategory,
  getPatientPrescriptions,
  getDoctorPrescriptions,
  getAllPrescriptions,
  getPrescription,
  updatePrescriptionStatus,
  downloadPrescription
} from '../controllers/prescriptionController.js';
import authUser from '../middlewares/authUser.js';
import authDoctor from '../middlewares/authDoctor.js';
import authAdmin from '../middlewares/authAdmin.js';

const router = express.Router();

// Medicines routes (public/accessible to all)
router.get('/medicines', getAllMedicines);
router.get('/medicines/category/:category', getMedicinesByCategory);

// Prescription routes
router.post('/create', authDoctor, createPrescription);
router.get('/patient-prescriptions', authUser, getPatientPrescriptions);
router.get('/doctor-prescriptions', authDoctor, getDoctorPrescriptions);
router.get('/all-prescriptions', authAdmin, getAllPrescriptions);
router.get('/:prescriptionId', getPrescription);
router.put('/:prescriptionId/status', updatePrescriptionStatus);
router.post('/:prescriptionId/download', downloadPrescription);

export default router;
