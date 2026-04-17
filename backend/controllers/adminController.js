import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import adminModel from "../models/adminModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js"

// API for admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        const admin = await adminModel.findOne({ email })

        if (admin) {
            const isMatch = await bcrypt.compare(password, admin.password)
            if (!isMatch) {
                return res.json({ success: false, message: "Invalid credentials" })
            }

            const token = jwt.sign({ id: admin._id, role: 'admin', email: admin.email }, process.env.JWT_SECRET)
            return res.json({ success: true, token })
        }

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ role: 'admin', email }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for adding Doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address, longitude, latitude } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.status(400).json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Please enter a strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQU=';
    
    // Upload image to Cloudinary if provided
    if (imageFile) {
      try {
        console.log('📸 File received:', {
          filename: imageFile.filename,
          path: imageFile.path,
          size: imageFile.size
        });
        
        console.log('📸 Uploading to Cloudinary...');
        
        // Use unsigned upload (requires upload preset configured in Cloudinary)
        const cloudName = process.env.CLOUDINARY_NAME;
        const uploadPreset = 'appointy_doctors'; // You need to create this in Cloudinary dashboard
        
        // For now, let's use direct upload with API credentials
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { 
          resource_type: "auto",
          folder: "appointy/doctors",
          eager: [{ quality: "auto" }]
        });
        
        imageUrl = imageUpload.secure_url;
        console.log('✅ Cloudinary upload successful:', imageUrl);
        
        // Delete temp file after upload
        import('fs').then(fs => {
          fs.default.unlink(imageFile.path, (err) => {
            if (err) console.log('Could not delete temp file');
            else console.log('✅ Temp file cleaned up');
          });
        });
      } catch (error) {
        console.error('❌ Cloudinary upload failed');
        console.error('Error:', error.message);
        if (error.error) {
          console.error('Details:', error.error);
        }
        // Continue with placeholder - don't fail the entire request
      }
    } else {
      console.log('⚠️  No image file provided, using placeholder');
    }

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude) || 0, parseFloat(latitude) || 0]
      },
      date: Date.now()
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.status(200).json({ success: true, message: "Doctor Added" });

  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Add prescription to appointment (Admin)
const addPrescription = async (req, res) => {
    try {
        const { appointmentId, medicines, notes } = req.body;

        if (!appointmentId || !medicines || medicines.length === 0) {
            return res.json({ success: false, message: 'Missing appointment ID or medicines' });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({ success: false, message: 'Appointment not found' });
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
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {loginAdmin, addDoctor, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard, addPrescription}