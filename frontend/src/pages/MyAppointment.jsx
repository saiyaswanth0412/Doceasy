import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { useTheme } from '../context/ThemeContext'
import PrescriptionViewer from '../components/PrescriptionViewer'

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData, doctors, currencySymbol } = useContext(AppContext)
  const { isDark } = useTheme()
  const [appointments, setAppointments] = useState([])

  const months = [" ", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    const [day, month, year] = slotDate.split('_')
    return `${day} ${months[Number(month)]} ${year}`
  }

  // Getting User Appointments Data Using API
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
      setAppointments(data.appointments.reverse())
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // Function to cancel appointment Using API
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  // Generate appointment data from doctors
  useEffect(() => {
    if (doctors.length) {
      const generatedAppointments = doctors.slice(0, 3).map((doc, idx) => ({
        _id: `appointment_${idx}`,
        docData: {
          name: doc.name,
          speciality: doc.speciality,
          image: doc.image,
          address: doc.address || { line1: "Street X", line2: "City Y" }
        },
        slotDate: `12_0${idx + 1}_2025`,
        slotTime: `${10 + idx}:00 AM`,
        payment: idx === 1,         // Simulate second one as paid
        isCompleted: idx === 2,     // Simulate third one as completed
        cancelled: false
      }))
      setAppointments(generatedAppointments)
    }
  }, [doctors])

  return (
    <div className={`min-h-screen transition-colors duration-300 py-12 px-4 ${
      isDark ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className='max-w-4xl mx-auto'>
        {/* Page Header */}
        <div className='mb-12'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2'>
            My Appointments
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage and track all your scheduled appointments
          </p>
        </div>

        {/* Appointments List */}
        <div className='space-y-6'>
          {appointments.length === 0 ? (
            <div className={`rounded-2xl p-12 text-center ${
              isDark ? 'bg-slate-800' : 'bg-white'
            } shadow-lg`}>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No appointments found. Book your first appointment now!
              </p>
            </div>
          ) : (
            appointments.map((item, index) => (
              <div
                key={index}
                className={`rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                  isDark ? 'bg-slate-800' : 'bg-white'
                }`}
              >
                <div className='flex flex-col md:flex-row'>
                  {/* Doctor Image */}
                  <div className={`md:w-48 h-48 md:h-auto ${isDark ? 'bg-slate-700' : 'bg-blue-50'} overflow-hidden`}>
                    <img
                      className='w-full h-full object-cover'
                      src={item.docData.image}
                      alt={item.docData.name}
                    />
                  </div>

                  {/* Appointment Details */}
                  <div className='flex-1 p-6 md:p-8 flex flex-col justify-between'>
                    <div className='mb-6'>
                      <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {item.docData.name}
                      </h3>
                      <p className='text-blue-600 dark:text-blue-400 font-semibold mb-4'>
                        {item.docData.speciality}
                      </p>

                      <div className={`space-y-2 py-4 border-t border-b ${
                        isDark ? 'border-slate-700' : 'border-gray-200'
                      }`}>
                        <div>
                          <p className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Address
                          </p>
                          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {item.docData.address.line1}
                          </p>
                          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {item.docData.address.line2}
                          </p>
                        </div>

                        <div className='pt-2'>
                          <p className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            📅 Scheduled Date & Time
                          </p>
                          <p className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold`}>
                            {slotDateFormat(item.slotDate)} | {item.slotTime}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status and Action Buttons */}
                    <div className='flex flex-col sm:flex-row gap-3 pt-4'>
                      {!item.cancelled && !item.isCompleted && (
                        <div className='flex-1 px-4 py-3 bg-green-100 dark:bg-green-900 rounded-lg text-center'>
                          <p className='text-green-700 dark:text-green-300 font-bold'>✓ Appointment Confirmed</p>
                        </div>
                      )}

                      {item.isCompleted && (
                        <div className='flex-1 px-4 py-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-center'>
                          <p className='text-blue-700 dark:text-blue-300 font-bold'>✓ Completed</p>
                        </div>
                      )}

                      {!item.cancelled && !item.isCompleted && (
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className='flex-1 px-4 py-3 border-2 border-red-500 text-red-600 dark:text-red-400 font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition-all'
                        >
                          Cancel Appointment
                        </button>
                      )}

                      {item.cancelled && !item.isCompleted && (
                        <div className='flex-1 px-4 py-3 bg-red-100 dark:bg-red-900 rounded-lg text-center'>
                          <p className='text-red-700 dark:text-red-300 font-bold'>✕ Cancelled</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Prescription Viewer */}
                {item.isCompleted && item.prescription && (
                  <PrescriptionViewer appointment={item} currencySymbol={currencySymbol} />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default MyAppointments
