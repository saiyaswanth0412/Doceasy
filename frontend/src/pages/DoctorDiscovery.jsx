import React, { useContext, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'
import DoctorSwiper from '../components/DoctorSwiper'

const DoctorDiscovery = () => {
  const { doctors } = useContext(AppContext)
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('All')
  const [sortBy, setSortBy] = useState('recommended')
  const [showFilters, setShowFilters] = useState(false)

  const specialties = ['All', 'General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist']

  // Filter and sort doctors
  const filteredDoctors = useMemo(() => {
    let result = doctors.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.speciality.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSpecialty = selectedSpecialty === 'All' || doc.speciality === selectedSpecialty
      return matchesSearch && matchesSpecialty
    })

    // Sort
    if (sortBy === 'experience') {
      result = [...result].sort((a, b) => {
        const expA = parseInt(a.experience) || 0
        const expB = parseInt(b.experience) || 0
        return expB - expA
      })
    } else if (sortBy === 'fees_low') {
      result = [...result].sort((a, b) => a.fees - b.fees)
    } else if (sortBy === 'fees_high') {
      result = [...result].sort((a, b) => b.fees - a.fees)
    }

    return result
  }, [doctors, searchQuery, selectedSpecialty, sortBy])

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className='max-w-7xl mx-auto px-4 py-12'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2'>Find Your Doctor</h1>
          <p className='text-gray-600 dark:text-gray-400'>Swipe through doctors and book in seconds</p>
        </div>

        <div className='mb-6'>
          {/* Search Bar */}
          <div className='flex gap-3 mb-4'>
            <div className='flex-1 relative'>
              <input
                type='text'
                placeholder='Search by doctor name or specialty...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                }`}
              />
              <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400'>
                🔍
              </span>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold'
            >
              ⚙️ Filters
            </button>
          </div>

          <div className='flex flex-wrap gap-3 mb-4'>
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedSpecialty === spec
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-100 border-gray-300'}`}>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {/* Specialty Filter */}
                <div>
                  <p className={`text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Specialty
                  </p>
                  <div className='space-y-2 max-h-48 overflow-y-auto'>
                    {specialties.map((spec) => (
                      <label key={spec} className='flex items-center gap-3 cursor-pointer'>
                        <input
                          type='radio'
                          name='specialty'
                          value={spec}
                          checked={selectedSpecialty === spec}
                          onChange={(e) => setSelectedSpecialty(e.target.value)}
                          className='cursor-pointer'
                        />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort Filter */}
                <div>
                  <p className={`text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Sort By
                  </p>
                  <div className='space-y-2'>
                    {[
                      { value: 'recommended', label: 'Recommended' },
                      { value: 'experience', label: 'Most Experienced' },
                      { value: 'fees_low', label: 'Lowest Fee' },
                      { value: 'fees_high', label: 'Highest Fee' }
                    ].map((option) => (
                      <label key={option.value} className='flex items-center gap-3 cursor-pointer'>
                        <input
                          type='radio'
                          name='sort'
                          value={option.value}
                          checked={sortBy === option.value}
                          onChange={(e) => setSortBy(e.target.value)}
                          className='cursor-pointer'
                        />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedSpecialty('All')
                  setSortBy('recommended')
                }}
                className={`w-full mt-4 py-2 rounded-lg font-bold transition-all ${
                  isDark
                    ? 'bg-slate-600 hover:bg-slate-500 text-white'
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
                }`}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Results Summary */}
          <div className={`mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p className='font-medium'>
              Found <span className='text-blue-600 dark:text-blue-400 font-bold'>{filteredDoctors.length}</span> doctor{filteredDoctors.length !== 1 ? 's' : ''}
              {selectedSpecialty !== 'All' && ` specializing in ${selectedSpecialty}`}
            </p>
          </div>
        </div>

      {/* Swiper Section */}
      <div className='pb-12 px-4'>
        <div className='max-w-4xl mx-auto'>
          {filteredDoctors.length > 0 ? (
            <>
              <DoctorSwiper filteredDoctors={filteredDoctors} />
              <div className='mt-12 text-center'>
                <button
                  onClick={() => navigate('/doctors')}
                  className='text-blue-600 dark:text-blue-400 font-bold hover:underline'
                >
                  ← Back to grid view
                </button>
              </div>
            </>
          ) : (
            <div className={`text-center py-20 rounded-2xl ${
              isDark ? 'bg-slate-800' : 'bg-white'
            }`}>
              <p className={`text-xl mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                No doctors found
              </p>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedSpecialty('All')
                  setSortBy('recommended')
                }}
                className='px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all'
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

export default DoctorDiscovery
