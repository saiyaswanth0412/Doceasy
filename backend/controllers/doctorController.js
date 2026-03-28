import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import virtualConsultModel from "../models/virtualConsultModel.js";

// Doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await doctorModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor's appointments
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.user.id;
    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel appointment
const appointmentCancel = async (req, res) => {
  try {
    const docId = req.user.id;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.docId.toString() !== docId) {
      return res.status(403).json({ success: false, message: "Invalid doctor or appointment" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Complete appointment
const appointmentComplete = async (req, res) => {
  try {
    const docId = req.user.id;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.docId.toString() !== docId) {
      return res.status(403).json({ success: false, message: "Invalid doctor or appointment" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
    res.json({ success: true, message: "Appointment Completed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all doctors (for frontend list)
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password -email");
    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle doctor's availability
  const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID missing" });
    }

    const doctor = await doctorModel.findById(docId);

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    doctor.available = !doctor.available;
    await doctor.save();

    res.json({ success: true, message: "Availability changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get doctor's profile
const doctorProfile = async (req, res) => {
  try {
    const docId = req.user.id;
    const profile = await doctorModel.findById(docId).select("-password");
    res.json({ success: true, profileData: profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update doctor's profile
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.user.id;
    const { fees, address, available, about } = req.body; // ✅ include `about`

    await doctorModel.findByIdAndUpdate(docId, {
      fees,
      address,
      available,
      about, // ✅ update `about`
    });

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get dashboard data
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.user.id;
    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    const patientSet = new Set();

    appointments.forEach((a) => {
      if (a.isCompleted || a.payment) earnings += a.amount;
      patientSet.add(a.userId.toString());
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patientSet.size,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor's virtual consultation requests
const doctorVirtualConsults = async (req, res) => {
  try {
    const docId = req.user.id;
    const consults = await virtualConsultModel
      .find({ assignedDoctorId: docId })
      .sort({ createdAt: -1 });

    res.json({ success: true, consults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reply to a virtual consultation request
const replyVirtualConsult = async (req, res) => {
  try {
    const docId = req.user.id;
    const { consultId, doctorReply } = req.body;

    if (!consultId || !doctorReply) {
      return res.status(400).json({ success: false, message: 'Missing consult id or reply' });
    }

    const consult = await virtualConsultModel.findById(consultId);
    if (!consult || consult.assignedDoctorId !== docId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to consultation' });
    }

    consult.doctorReply = doctorReply;
    consult.status = 'replied';
    consult.repliedAt = Date.now();
    await consult.save();

    res.json({ success: true, message: 'Reply sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add prescription to appointment
const addPrescription = async (req, res) => {
  try {
    const docId = req.user.id;
    const { appointmentId, medicines, notes } = req.body;

    if (!appointmentId || !medicines || medicines.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing appointment ID or medicines' });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.docId.toString() !== docId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to add prescription' });
    }

    const prescriptionData = {
      medicines: medicines.map(med => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.instructions || ''
      })),
      notes: notes || '',
      createdAt: new Date()
    };

    await appointmentModel.findByIdAndUpdate(appointmentId, { prescription: prescriptionData });
    res.json({ success: true, message: 'Prescription added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add prescription to virtual consultation
const addVirtualConsultPrescription = async (req, res) => {
  try {
    const docId = req.user.id;
    const { consultId, medicines, notes } = req.body;

    if (!consultId || !medicines || medicines.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing consult ID or medicines' });
    }

    const consult = await virtualConsultModel.findById(consultId);
    if (!consult || consult.assignedDoctorId !== docId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to add prescription' });
    }

    const prescriptionData = {
      medicines: medicines.map(med => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.instructions || ''
      })),
      notes: notes || '',
      createdAt: new Date()
    };

    await virtualConsultModel.findByIdAndUpdate(consultId, { prescription: prescriptionData });
    res.json({ success: true, message: 'Prescription added successfully to virtual consultation' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorList,
  changeAvailability,
  doctorProfile,
  updateDoctorProfile,
  doctorDashboard,
  doctorVirtualConsults,
  replyVirtualConsult,
  addPrescription,
  addVirtualConsultPrescription,
};
