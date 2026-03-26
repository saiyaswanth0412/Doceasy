import React, { useContext, useState, useRef, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'

const DoctorSwiper = ({ filteredDoctors = null }) => {
  const navigate = useNavigate()
  const { doctors, token } = useContext(AppContext)
  const { isDark } = useTheme()

  const displayDoctors = filteredDoctors || doctors
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [swipeDirection, setSwipeDirection] = useState(null)
  const cardRef = useRef(null)

  const minSwipeDistance = 50

  // Handle mouse drag
  const handleMouseDown = (e) => {
    setTouchStart(e.clientX)
  }

  const handleMouseMove = (e) => {
    setTouchEnd(e.clientX)
  }

  const handleMouseUp = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      skipDoctor()
    } else if (isRightSwipe) {
      bookDoctor()
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  // Handle touch
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      skipDoctor()
    } else if (isRightSwipe) {
      bookDoctor()
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  const skipDoctor = () => {
    setSwipeDirection('left')
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % displayDoctors.length)
      setSwipeDirection(null)
    }, 300)
  }

  const bookDoctor = () => {
    if (!token) {
      navigate('/login')
      return
    }
    setSwipeDirection('right')
    setTimeout(() => {
      navigate(`/appointment/${displayDoctors[currentIndex]._id}`)
    }, 300)
  }

  const undo = () => {
    setCurrentIndex((prev) => (prev - 1 + displayDoctors.length) % displayDoctors.length)
  }

  if (displayDoctors.length === 0) {
    return (
      <div className={`flex items-center justify-center min-h-96 rounded-2xl ${
        isDark ? 'bg-slate-800' : 'bg-gray-100'
      }`}>
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          No doctors found matching your criteria
        </p>
      </div>
    )
  }

  const currentDoctor = displayDoctors[currentIndex]

  return (
    <div className='w-full max-w-2xl mx-auto'>
      {/* Swipe Instructions */}
      <div className={`text-center mb-6 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        <p className='font-medium'>← Swipe left to skip • Swipe right to book →</p>
      </div>

      {/* Doctor Card */}
      <div
        ref={cardRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative h-96 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing shadow-xl transition-all duration-300 ${
          swipeDirection === 'left' ? 'translate-x-full opacity-0 rotate-12' : ''
        } ${
          swipeDirection === 'right' ? '-translate-x-full opacity-0 -rotate-12' : ''
        } ${
          isDark ? 'bg-slate-800' : 'bg-white'
        }`}
      >
        {/* Doctor Image */}
        <div className='absolute inset-0 h-64 bg-gradient-to-b from-blue-100 to-blue-50 dark:from-blue-900 dark:to-slate-800 overflow-hidden'>
          <img
            src={currentDoctor.image}
            alt={currentDoctor.name}
            className='w-full h-full object-cover'
          />
        </div>

        {/* Info Overlay */}
        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6 pt-20'>
          <div className='text-white'>
            <h2 className='text-3xl font-bold mb-1'>{currentDoctor.name}</h2>
            <p className='text-blue-300 font-semibold mb-3'>{currentDoctor.speciality}</p>

            <div className='flex items-center gap-6 text-sm'>
              <div>
                <p className='text-gray-300 text-xs'>Experience</p>
                <p className='font-bold'>{currentDoctor.experience}</p>
              </div>
              <div>
                <p className='text-gray-300 text-xs'>Qualification</p>
                <p className='font-bold'>{currentDoctor.degree}</p>
              </div>
              <div>
                <p className='text-gray-300 text-xs'>Fee</p>
                <p className='font-bold text-blue-300'>${currentDoctor.fees}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className='absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold bg-white/90 dark:bg-slate-800/90'>
          <span className={currentDoctor.available ? 'text-green-600' : 'text-gray-500'}>
            {currentDoctor.available ? '✓ Available' : '✕ Unavailable'}
          </span>
        </div>

        {/* Card Counter */}
        <div className='absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 text-sm font-bold'>
          {currentIndex + 1}/{displayDoctors.length}
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4 justify-center mt-8'>
        {/* Undo Button */}
        <button
          onClick={undo}
          disabled={currentIndex === 0}
          className={`px-6 py-3 rounded-full font-bold border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            isDark
              ? 'border-slate-600 text-gray-300 hover:bg-slate-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
        >
          ↺ Undo
        </button>

        {/* Skip Button */}
        <button
          onClick={skipDoctor}
          className={`px-8 py-3 rounded-full font-bold transition-all ${
            isDark
              ? 'bg-slate-700 hover:bg-slate-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
        >
          Pass
        </button>

        {/* Book Button */}
        <button
          onClick={bookDoctor}
          className='px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-full transition-all hover:shadow-lg'
        >
          ❤️ Book
        </button>
      </div>

      {/* About Section */}
      <div className={`mt-8 p-6 rounded-2xl ${
        isDark ? 'bg-slate-800' : 'bg-gray-50'
      }`}>
        <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          About Dr. {currentDoctor.name}
        </h3>
        <p className={`text-sm leading-relaxed ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {currentDoctor.about || 'Experienced healthcare professional dedicated to providing quality patient care and treatment excellence.'}
        </p>
      </div>
    </div>
  )
}

export default DoctorSwiper
