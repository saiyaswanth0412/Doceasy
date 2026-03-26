import prescriptionModel from '../models/prescriptionModel.js';
import medicineModel from '../models/medicineModel.js';

// Doctor: Create prescription
export const createPrescription = async (req, res) => {
  try {
    const { patientId, appointmentId, medicines, notes } = req.body;
    const doctorId = req.body.userId; // From auth middleware

    if (!patientId || !medicines || medicines.length === 0) {
      return res.status(400).json({ success: false, message: 'Patient ID and medicines are required' });
    }

    const prescription = new prescriptionModel({
      patientId,
      doctorId,
      appointmentId,
      medicines,
      notes,
      status: 'Active'
    });

    await prescription.save();
    
    res.json({
      success: true,
      message: 'Prescription created successfully',
      prescription
    });

  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({ success: false, message: 'Error creating prescription', error: error.message });
  }
};

// Get all medicines
export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await medicineModel.find();
    res.json({ success: true, medicines });
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({ success: false, message: 'Error fetching medicines' });
  }
};

// Get medicines by category
export const getMedicinesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const medicines = await medicineModel.find({ category });
    res.json({ success: true, medicines });
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({ success: false, message: 'Error fetching medicines' });
  }
};

// Patient: Get prescriptions
export const getPatientPrescriptions = async (req, res) => {
  try {
    const patientId = req.body.userId; // From auth middleware
    
    const prescriptions = await prescriptionModel
      .find({ patientId })
      .populate('doctorId', 'name speciality image')
      .populate('medicines.medicineId')
      .sort({ createdAt: -1 });

    res.json({ success: true, prescriptions });

  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ success: false, message: 'Error fetching prescriptions' });
  }
};

// Doctor: Get prescriptions written by doctor
export const getDoctorPrescriptions = async (req, res) => {
  try {
    const doctorId = req.body.userId; // From auth middleware
    
    const prescriptions = await prescriptionModel
      .find({ doctorId })
      .populate('patientId', 'name email')
      .populate('medicines.medicineId')
      .sort({ createdAt: -1 });

    res.json({ success: true, prescriptions });

  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ success: false, message: 'Error fetching prescriptions' });
  }
};

// Admin: Get all prescriptions
export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await prescriptionModel
      .find()
      .populate('patientId', 'name email')
      .populate('doctorId', 'name speciality')
      .populate('medicines.medicineId')
      .sort({ createdAt: -1 });

    res.json({ success: true, prescriptions });

  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ success: false, message: 'Error fetching prescriptions' });
  }
};

// Get single prescription
export const getPrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    
    const prescription = await prescriptionModel
      .findById(prescriptionId)
      .populate('patientId')
      .populate('doctorId')
      .populate('medicines.medicineId');

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    res.json({ success: true, prescription });

  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(500).json({ success: false, message: 'Error fetching prescription' });
  }
};

// Update prescription status
export const updatePrescriptionStatus = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const { status } = req.body;

    if (!['Active', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const prescription = await prescriptionModel.findByIdAndUpdate(
      prescriptionId,
      { status, updatedAt: Date.now() },
      { new: true }
    ).populate('medicines.medicineId');

    res.json({ success: true, message: 'Prescription updated', prescription });

  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({ success: false, message: 'Error updating prescription' });
  }
};

// Download prescription (mark as downloaded)
export const downloadPrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    
    const prescription = await prescriptionModel
      .findByIdAndUpdate(
        prescriptionId,
        { downloadedAt: Date.now() },
        { new: true }
      )
      .populate('patientId')
      .populate('doctorId')
      .populate('medicines.medicineId');

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    // Generate prescription data for PDF/download
    const prescriptionData = {
      prescription,
      generatedAt: new Date().toLocaleString()
    };

    res.json({
      success: true,
      message: 'Prescription ready for download',
      data: prescriptionData
    });

  } catch (error) {
    console.error('Error downloading prescription:', error);
    res.status(500).json({ success: false, message: 'Error downloading prescription' });
  }
};
