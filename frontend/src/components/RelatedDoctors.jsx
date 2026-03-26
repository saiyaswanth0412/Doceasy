import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext)
  const navigate = useNavigate()
  const { isDark } = useTheme()

  const [relDoc, setRelDoc] = useState([])

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      )
      setRelDoc(doctorsData)
    }
  }, [doctors, speciality, docId])

  return (
    <div className={`py-16 px-4 transition-colors duration-300 ${
      isDark ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className='max-w-6xl mx-auto'>
        {/* Section Header */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4'>
            Related Doctors
          </h2>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Other {speciality} specialists you might be interested in
          </p>
        </div>

        {/* Doctor Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
          {relDoc.map((item, index) => (
            <div
              key={index}
              onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0) }}
              className={`group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer ${
                isDark ? 'bg-slate-800' : 'bg-white'
              } border ${isDark ? 'border-slate-700' : 'border-gray-200'} hover:border-blue-400`}
            >
              {/* Doctor Image */}
              <div className={`relative overflow-hidden h-48 ${
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

              {/* Doctor Info */}
              <div className='p-6'>
                <h3 className={`text-lg font-bold mb-1 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {item.name}
                </h3>
                <p className='text-blue-600 dark:text-blue-400 font-semibold text-sm mb-4'>
                  {item.speciality}
                </p>

                {/* Fee */}
                <div className={`mb-4 p-3 rounded-lg text-center ${
                  isDark ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-50'
                }`}>
                  <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                    ${item.fees}
                  </p>
                </div>

                {/* View Button */}
                <button className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2 rounded-lg transition-all'>
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {relDoc.length === 0 && (
          <div className='text-center py-12'>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No other doctors with this speciality found
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RelatedDoctors
