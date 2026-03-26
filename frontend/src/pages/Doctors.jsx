import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'

const Doctors = () => {

  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();
  const { isDark } = useTheme()

  const { doctors } = useContext(AppContext)
  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }
  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  const specialities = ['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist']

  return (
    <div className={`min-h-screen transition-colors duration-300 py-12 px-4 ${
      isDark ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-12'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2'>Find Your Doctor</h1>
              <p className='text-gray-600 dark:text-gray-400'>Browse through our specialized doctors</p>
            </div>
            <button
              onClick={() => navigate('/doctor-discovery')}
              className='px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold rounded-lg transition-all shadow-md hover:shadow-lg whitespace-nowrap'
            >
              💳 Try Swiper View
            </button>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-8'>
          {/* Filter Sidebar */}
          <div className={`sm:w-1/4 ${showFilter ? 'block' : 'hidden sm:block'}`}>
            <div className='bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md'>
              <h3 className='text-lg font-bold mb-6 text-blue-600 dark:text-blue-400'>Specialities</h3>
              <div className='space-y-3'>
              {specialities.map((spec, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)
                    setShowFilter(false)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    speciality === spec
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold'
                      : 'bg-gray-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-slate-600'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Doctor Cards */}
        <div className='sm:w-3/4'>
          {/* Mobile Filter Toggle */}
          <button 
            onClick={() => setShowFilter(!showFilter)} 
            className='sm:hidden mb-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition'
          >
            {showFilter ? '✕ Close Filters' : '⊞ Show Filters'}
          </button>

          {/* Grid of Doctor Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filterDoc.map((item, index) => (
              <div
                key={index}
                onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0) }}
                className='group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-400 dark:hover:border-blue-500'
              >
                {/* Doctor Image */}
                <div className='relative overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100 dark:from-slate-700 dark:to-slate-800 h-48'>
                  <img className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300' src={item.image} alt={item.name} />
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold ${item.available ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </div>
                </div>

                {/* Doctor Info */}
                <div className='p-5'>
                  <h3 className='text-lg font-bold text-slate-900 dark:text-white mb-1'>{item.name}</h3>
                  <p className='text-sm text-blue-600 dark:text-blue-400 font-semibold mb-3'>{item.speciality}</p>
                  
                  {/* Fees */}
                  <div className='mb-4 p-3 bg-blue-50 dark:bg-slate-700 rounded-lg'>
                    <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>${item.fees}</p>
                    <p className='text-xs text-gray-600 dark:text-gray-400'>per consultation</p>
                  </div>

                  {/* Experience */}
                  <p className='text-xs text-gray-600 dark:text-gray-400'><span className='font-semibold'>Experience:</span> {item.experience}</p>
                  <p className='text-xs text-gray-600 dark:text-gray-400 mb-4'><span className='font-semibold'>Qualification:</span> {item.degree}</p>

                  {/* CTA Button */}
                  <button className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2 rounded-lg transition-all group-hover:shadow-md'>
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filterDoc.length === 0 && (
            <div className='text-center py-12'>
              <p className='text-gray-500 dark:text-gray-400 text-lg'>No doctors found in this speciality</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

export default Doctors
