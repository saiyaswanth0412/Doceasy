import React from 'react'
import { assets } from '../assets/assets'
import { useTheme } from '../context/ThemeContext'

const Contact = () => {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      {/* Page Header */}
      <div className='text-center py-16 px-4'>
        <h1 className='text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3'>
          Get in Touch
        </h1>
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          We're here to help and answer any questions you might have
        </p>
      </div>

      <div className='max-w-6xl mx-auto px-4 pb-20'>
        {/* Main Content Grid */}
        <div className='grid md:grid-cols-2 gap-12 items-start mb-16'>
          {/* Contact Image */}
          <div className='rounded-2xl overflow-hidden shadow-lg'>
            <img className='w-full h-full object-cover' src={assets.contact_image} alt="Contact Us" />
          </div>

          {/* Contact Information */}
          <div className='space-y-8'>
            {/* Office Info Card */}
            <div className={`rounded-2xl p-8 shadow-lg ${
              isDark ? 'bg-slate-800' : 'bg-white'
            }`}>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl'>
                  📍
                </div>
                <h3 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'>
                  Our Office
                </h3>
              </div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                54709 Willms Station <br /> Suite 350, Washington, USA
              </p>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Available Monday to Friday, 9 AM to 6 PM EST
              </p>
            </div>

            {/* Contact Details Card */}
            <div className={`rounded-2xl p-8 shadow-lg ${
              isDark ? 'bg-slate-800' : 'bg-white'
            }`}>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl'>
                  📞
                </div>
                <h3 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'>
                  Contact Details
                </h3>
              </div>
              <div className='space-y-3'>
                <div>
                  <p className={`font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Phone
                  </p>
                  <a href='tel:+14155550132' className='text-blue-600 dark:text-blue-400 hover:underline'>
                    +1 (415) 555-0132
                  </a>
                </div>
                <div>
                  <p className={`font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </p>
                  <a href='mailto:customersupport@doceasy.in' className='text-blue-600 dark:text-blue-400 hover:underline'>
                    customersupport@doceasy.in
                  </a>
                </div>
              </div>
            </div>

            {/* Careers Card */}
            <div className={`rounded-2xl p-8 shadow-lg bg-gradient-to-br from-blue-600 to-blue-700`}>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white text-xl'>
                  💼
                </div>
                <h3 className='text-2xl font-bold text-white'>
                  Careers at Doceasy
                </h3>
              </div>
              <p className='text-blue-100 mb-6'>
                Join our team and help us revolutionize healthcare. Explore exciting opportunities and be part of something meaningful.
              </p>
              <button className='w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition-all'>
                Explore Opportunities
              </button>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className={`rounded-2xl shadow-lg p-8 ${
          isDark ? 'bg-slate-800' : 'bg-white'
        }`}>
          <h2 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-8'>
            Send us a Message
          </h2>

          <form className='space-y-6'>
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <label className={`block font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Name
                </label>
                <input
                  type='text'
                  placeholder='John Doe'
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-all ${
                    isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-300 placeholder-gray-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address
                </label>
                <input
                  type='email'
                  placeholder='you@example.com'
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-all ${
                    isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-300 placeholder-gray-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Subject
              </label>
              <input
                type='text'
                placeholder='How can we help?'
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-all ${
                  isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-300 placeholder-gray-400'
                }`}
              />
            </div>

            <div>
              <label className={`block font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Message
              </label>
              <textarea
                placeholder='Tell us more...'
                rows='5'
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-all resize-none ${
                  isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-300 placeholder-gray-400'
                }`}
              ></textarea>
            </div>

            <button
              type='submit'
              className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg transition-all hover:shadow-lg'
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
