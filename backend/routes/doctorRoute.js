import express from 'express';
import { loginDoctor, appointmentsDoctor, appointmentCancel, doctorList, nearbyDoctors, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile, changeAvailability, doctorVirtualConsults, replyVirtualConsult, addPrescription, addVirtualConsultPrescription, getVirtualConsultSummary } from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';
const doctorRouter = express.Router();

doctorRouter.post("/login", loginDoctor)
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel)
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor)
doctorRouter.get("/list", doctorList)
doctorRouter.post("/nearby", nearbyDoctors)
doctorRouter.post("/change-availability", authDoctor, changeAvailability)
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete)
doctorRouter.get("/dashboard", authDoctor, doctorDashboard)
doctorRouter.get("/profile", authDoctor, doctorProfile)
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile)
doctorRouter.get('/virtual-consults', authDoctor, doctorVirtualConsults)
doctorRouter.post('/virtual-consult-reply', authDoctor, replyVirtualConsult)
doctorRouter.post('/add-prescription', authDoctor, addPrescription)
doctorRouter.post('/add-virtual-consult-prescription', authDoctor, addVirtualConsultPrescription)
doctorRouter.post('/get-consult-summary', authDoctor, getVirtualConsultSummary)

export default doctorRouter;