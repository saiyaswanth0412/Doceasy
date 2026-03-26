import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from './context/AppContext'
import { assets } from './assets/assets'
import RelatedDoctors from './components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useTheme } from './context/ThemeContext'

const Appointment = () => {
  const { docId } = useParams()
  const navigate = useNavigate()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocInfo = async () => {
    const doc = doctors.find((doc) => doc._id === docId)
    if (doc) {
      // Ensure slots_booked is always at least an empty object
      setDocInfo({ ...doc, slots_booked: doc.slots_booked || {} })
    }
  }

  const getAvailableSlots = () => {
    if (!docInfo) return
    setDocSlots([])

    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      const endTime = new Date(currentDate)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      const timeSlots = []

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })

        const day = currentDate.getDate()
        const month = currentDate.getMonth() + 1
        const year = currentDate.getFullYear()
        const slotDate = `${day}_${month}_${year}`
        const slotTime = formattedTime

        const isSlotAvailable =
          !docInfo?.slots_booked?.[slotDate] ||
          !docInfo.slots_booked[slotDate].includes(slotTime)

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          })
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlots((prev) => [...prev, timeSlots])
    }
  }

  const bookAppointment = async () => {

    if (!token) {
      toast.warning('Login to book appointment')
      return navigate('/login')
    }

    const date = docSlots[slotIndex][0].datetime
  
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    const slotDate = day + "_" + month + "_" + year

    try {

      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo()
    }
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots()
    }
  }, [docInfo])

  return (
    docInfo && (
      <div className='px-4 py-12'>
        <div className='max-w-6xl mx-auto'>
          {/* Doctor details */}
          <div className='flex flex-col sm:flex-row gap-8 mb-12'>
            <div className='sm:w-1/3'>
              <img className='bg-primary w-full rounded-lg shadow-lg' src={docInfo.image} alt={docInfo.name} />
            </div>
            <div className='sm:w-2/3 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg'>
              <p className='flex items-center gap-2 text-3xl font-bold text-gray-700 dark:text-white mb-2'>
                {docInfo.name} <img src={assets.verified_icon} alt="verified" className='w-6 h-6' />
              </p>
              <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6'>
                <p className='font-semibold'>{docInfo.degree} - {docInfo.speciality}</p>
                <button className='py-1 px-3 border border-gray-300 dark:border-gray-600 text-sm rounded-full bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'>
                  {docInfo.experience}
                </button>
              </div>
              
              <div className='mb-6'>
                <p className='flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                  About <img src={assets.info_icon} alt="info" className='w-5 h-5' />
                </p>
                <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>{docInfo.about}</p>
              </div>

              <div className='p-4 bg-blue-50 dark:bg-blue-900 rounded-lg'>
                <p className='text-gray-700 dark:text-gray-300 font-medium mb-1'>Appointment Fee</p>
                <p className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
                  {currencySymbol} {docInfo.fees}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Slots */}
          <div className='mb-12'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>Select Your Appointment Slot</h2>

            {/* Days Scroll */}
            <div className='mb-8'>
              <p className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4'>Choose Date</p>
              <div className='flex gap-3 items-center w-full overflow-x-auto pb-2'>
                {docSlots.length > 0 &&
                  docSlots.map((item, index) => (
                    <div
                      onClick={() => setSlotIndex(index)}
                      key={index}
                      className={`text-center py-4 px-4 min-w-24 rounded-lg cursor-pointer font-semibold transition-all ${
                        slotIndex === index
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                          : 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                      }`}
                    >
                      <p className='text-xs'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                      <p className='text-lg'>{item[0] && item[0].datetime.getDate()}</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Time Slots Scroll */}
            <div className='mb-8'>
              <p className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4'>Choose Time</p>
              <div className='flex items-center gap-3 w-full overflow-x-auto pb-2'>
                {docSlots.length > 0 &&
                  docSlots[slotIndex] &&
                  docSlots[slotIndex].map((item, index) => (
                    <p
                      onClick={() => setSlotTime(item.time)}
                      key={index}
                      className={`text-sm font-medium flex-shrink-0 px-5 py-2 rounded-lg cursor-pointer transition-all ${
                        item.time === slotTime
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                          : 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {item.time.toLowerCase()}
                    </p>
                  ))}
              </div>
            </div>

            {/* Book Button */}
            <button
              onClick={bookAppointment}
              className='w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition-all hover:shadow-lg'
            >
              Book Appointment
            </button>
          </div>

          {/* Related Doctors */}
        </div>
        <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
      </div>
    )
  )
}

export default Appointment
