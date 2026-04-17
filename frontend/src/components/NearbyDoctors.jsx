import React, { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { calculateDistance, getCityFromCoordinates } from '../utils/distance'

const NearbyDoctors = () => {
  const navigate = useNavigate()
  const { backendUrl } = useContext(AppContext)
  const [nearbyDoctors, setNearbyDoctors] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [userCity, setUserCity] = useState('')

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const handleBookAppointment = (doctorId, doctorName) => {
    toast.info(`Redirecting to book appointment with ${doctorName}...`)
    navigate(`/appointment/${doctorId}`)
  }

  const findNearbyDoctors = () => {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            
            // Get user's city
            const city = await getCityFromCoordinates(latitude, longitude)
            setUserCity(city)
            
            // Fetch all doctors
            const response = await axios.get(`${backendUrl}/api/doctor/list`)

            if (response.data.success) {
              const allDoctors = response.data.doctors
              
              // Calculate distance for each doctor and add city name
              const doctorsWithDistance = []
              for (const doctor of allDoctors) {
                if (doctor.location && doctor.location.coordinates) {
                  const [docLon, docLat] = doctor.location.coordinates
                  const distance = calculateDistance(latitude, longitude, docLat, docLon)
                  await delay(500) // Rate limiting for Nominatim API
                  const docCity = await getCityFromCoordinates(docLat, docLon)
                  doctorsWithDistance.push({
                    ...doctor,
                    distance,
                    city: docCity
                  })
                }
              }
              
              // Sort by distance (closest first)
              const sorted = doctorsWithDistance.sort((a, b) => a.distance - b.distance)
              
              setNearbyDoctors(sorted)
              setSearched(true)
              
              if (sorted.length === 0) {
                toast.info('No doctors with location data found')
              } else {
                toast.success(`Found ${sorted.length} doctors sorted by distance!`)
              }
            } else {
              toast.error(response.data.message)
            }
          } catch (error) {
            toast.error('Failed to search nearby doctors')
            console.error(error)
          } finally {
            setLoading(false)
          }
        },
        (error) => {
          setLoading(false)
          toast.error('Could not get your location: ' + error.message)
        }
      )
    } else {
      toast.error('Geolocation is not supported by your browser')
    }
  }

  return (
    <div className='bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 mb-8 text-white'>
      <h2 className='text-2xl font-bold mb-2'>🏥 Find Doctors Near You</h2>
      <p className='mb-4 text-blue-100'>Discover trusted doctors in your area</p>
      
      <button 
        onClick={findNearbyDoctors}
        disabled={loading}
        className='bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 text-blue-900 font-bold px-6 py-3 rounded-lg transition-all duration-300 disabled:cursor-not-allowed'
      >
        {loading ? '📍 Detecting your location...' : '📍 Find Doctors Near Me'}
      </button>

      {searched && userCity && (
        <p className='mt-3 text-sm text-blue-100'>Your location: <span className='font-semibold'>{userCity}</span></p>
      )}

      {searched && nearbyDoctors.length > 0 && (
        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {nearbyDoctors.map((doctor) => (
            <div key={doctor._id} className='bg-white text-gray-900 rounded-lg p-4 hover:shadow-lg transition-shadow'>
              <div className='flex items-start gap-3 mb-3'>
                <img 
                  src={doctor.image} 
                  alt={doctor.name}
                  className='w-16 h-16 rounded-full object-cover'
                />
                <div className='flex-1'>
                  <h3 className='font-bold text-lg'>{doctor.name}</h3>
                  <p className='text-sm text-blue-600'>{doctor.speciality}</p>
                  <p className='text-xs text-gray-500'>⭐ {doctor.experience} yrs</p>
                </div>
              </div>
              
              <div className='mb-3 pb-3 border-b text-sm'>
                <p className='text-gray-600 mb-1'>📍 {doctor.city}</p>
                <p className='font-semibold text-green-600'>🚗 {doctor.distance} km away</p>
              </div>
              
              <p className='text-sm mb-2 text-gray-700 line-clamp-2'>{doctor.about}</p>
              
              <div className='flex justify-between items-center mb-3 text-sm'>
                <span className='font-bold text-green-600'>${doctor.fees}</span>
                <span className='text-gray-500'>{doctor.degree}</span>
              </div>

              <button 
                onClick={() => handleBookAppointment(doctor._id, doctor.name)}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors'>
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}

      {searched && nearbyDoctors.length === 0 && (
        <div className='mt-6 bg-white bg-opacity-20 rounded-lg p-4 text-center'>
          <p className='text-lg'>No doctors with location data found</p>
          <p className='text-sm text-blue-100'>Doctors are being added to the system. Please check back later</p>
        </div>
      )}
    </div>
  )
}

export default NearbyDoctors
