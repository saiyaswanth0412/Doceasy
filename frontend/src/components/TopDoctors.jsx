import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'

const TopDoctors = () => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)
  const { isDark } = useTheme()

  return (
    <div className={`py-20 px-4 transition-colors duration-300 ${
      isDark ? 'bg-slate-900' : 'bg-white'
    }`}>
      <div className='max-w-6xl mx-auto'>
        {/* Section Header */}
        <div className='text-center mb-14'>
          <h2 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4'>
            Top Doctors to Book
          </h2>
          <p className='text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg'>
            Our highly rated and most-booked doctors available for your consultation.
          </p>
        </div>

        {/* Doctor Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10'>
          {doctors.slice(0, 9).map((item, index) => (
            <div
              key={index}
              onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0) }}
              className={`group rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${
                isDark ? 'bg-slate-800' : 'bg-white'
              } border ${isDark ? 'border-slate-700' : 'border-gray-200'} hover:border-blue-400`}
            >
              {/* Doctor Image */}
              <div className={`relative overflow-hidden h-56 ${
                isDark ? 'bg-slate-700' : 'bg-blue-50'
              }`}>
                <img
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                  src={item.image}
                  alt={item.name}
                />

                {/* Status Badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 ${
                  item.available
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-400 text-white'
                }`}>
                  <span className='w-2 h-2 rounded-full bg-white'></span>
                  {item.available ? 'Available' : 'Unavailable'}
                </div>
              </div>

              {/* Doctor Details */}
              <div className='p-6'>
                <h3 className={`text-xl font-bold mb-1 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {item.name}
                </h3>
                <p className='text-blue-600 dark:text-blue-400 font-semibold text-sm mb-4'>
                  {item.speciality}
                </p>

                {/* Fee Section */}
                <div className={`mb-4 p-3 rounded-lg ${
                  isDark ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-50'
                }`}>
                  <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                    ${item.fees}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    per consultation
                  </p>
                </div>

                {/* Experience */}
                <div className={`space-y-2 mb-4 pb-4 border-b ${
                  isDark ? 'border-slate-700' : 'border-gray-200'
                }`}>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className='font-bold'>Experience:</span> {item.experience}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className='font-bold'>Qualification:</span> {item.degree}
                  </p>
                </div>

                {/* Book Button */}
                <button className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2 px-4 rounded-lg transition-all hover:shadow-md'>
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className='flex justify-center'>
          <button
            onClick={() => { navigate('/doctors'); window.scrollTo(0, 0) }}
            className='px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 font-bold rounded-full hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all duration-300'
          >
            View All Doctors →
          </button>
        </div>
      </div>
    </div>
  )
}

export default TopDoctors
