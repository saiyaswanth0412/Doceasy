import express from 'express'
import mongoose from 'mongoose'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'

const router = express.Router()

// Endpoint for chatbot to book appointments
router.post('/', async (req, res) => {
  try {
    const { userEmail, doctorName, specialization, slotDate, slotTime } = req.body

    console.log('📌 Booking Request:', { userEmail, doctorName, specialization, slotDate, slotTime })

    // Validate required fields
    if (!userEmail || !doctorName || !slotDate || !slotTime) {
      return res.json({
        success: false,
        message: 'Missing required booking information: userEmail, doctorName, slotDate, slotTime'
      })
    }

    // Find user by email - if not found, use email as guest
    console.log('🔍 Searching for user with email:', userEmail)
    let userData = await userModel.findOne({ email: userEmail })
    console.log('User found:', userData ? userData._id : 'NOT FOUND')
    
    if (!userData) {
      console.log('⚠️  User not found, creating guest booking record')
      // For chatbot, allow guest bookings
      userData = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Guest User',
        email: userEmail,
        phone: 'N/A'
      }
    }

    // Find doctor by name (prioritize name match)
    let doctorData = await doctorModel.findOne({ name: { $regex: doctorName, $options: 'i' } })
    
    // If not found by name, try by speciality (with fuzzy matching)
    if (!doctorData) {
      // Try exact speciality first
      doctorData = await doctorModel.findOne({ speciality: { $regex: specialization, $options: 'i' } })
    }

    if (!doctorData) {
      // If still not found, get list of available doctors
      const docList = await doctorModel.find({}).select('name speciality')
      const availableDocs = docList.map(d => `${d.name} (${d.speciality})`).join(', ')
      return res.json({
        success: false,
        message: `Doctor not found. Available doctors: ${availableDocs || 'None available'}`
      })
    }

    // Check if doctor is available
    if (!doctorData.available) {
      return res.json({
        success: false,
        message: `Doctor ${doctorData.name} is currently not available`
      })
    }

    // Check slot availability
    let slots_booked = doctorData.slots_booked
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({
          success: false,
          message: `Time slot ${slotTime} on ${slotDate} is already booked`
        })
      }
      slots_booked[slotDate].push(slotTime)
    } else {
      slots_booked[slotDate] = [slotTime]
    }

    // Create appointment
    const appointmentData = {
      userId: userData._id,
      docId: doctorData._id,
      userData,
      docData: doctorData,
      amount: doctorData.fees,
      slotTime,
      slotDate,
      date: Date.now()
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    // Update doctor's booked slots
    await doctorModel.findByIdAndUpdate(doctorData._id, { slots_booked })

    res.json({
      success: true,
      message: `Appointment successfully booked with Dr. ${doctorData.name} on ${slotDate} at ${slotTime}`,
      appointmentId: newAppointment._id,
      appointmentDetails: {
        doctor: doctorData.name,
        specialization: doctorData.specialization,
        date: slotDate,
        time: slotTime,
        amount: doctorData.fees
      }
    })

  } catch (error) {
    console.error('Booking error:', error)
    res.json({
      success: false,
      message: `Booking failed: ${error.message}`
    })
  }
})

// Get available doctors by speciality
router.get('/doctors/:speciality', async (req, res) => {
  try {
    const { speciality } = req.params
    const doctors = await doctorModel
      .find({ speciality, available: true })
      .select('name speciality fees')

    res.json({
      success: true,
      doctors
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    })
  }
})

// Get available slots for a doctor
router.get('/available-slots/:docId/:date', async (req, res) => {
  try {
    const { docId, date } = req.params
    const doctor = await doctorModel.findById(docId)

    if (!doctor) {
      return res.json({ success: false, message: 'Doctor not found' })
    }

    const bookedSlots = doctor.slots_booked[date] || []
    const allSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot))

    res.json({
      success: true,
      availableSlots,
      bookedSlots
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    })
  }
})

export default router
