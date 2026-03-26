import React from 'react'
import { assets } from '../assets/assets'
import { useTheme } from '../context/ThemeContext'

const About = () => {
  const { isDark } = useTheme()

  return (
    <div className={`transition-colors duration-300 min-h-screen ${
      isDark ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      {/* Page Header */}
      <div className='text-center py-16 px-4'>
        <h1 className='text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3'>
          About Doceasy
        </h1>
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Your trusted health companion
        </p>
      </div>

      <div className='max-w-6xl mx-auto px-4 pb-20'>
        {/* Main Content Section */}
        <div className='grid md:grid-cols-2 gap-12 items-center mb-20'>
          {/* Image */}
          <div className='rounded-2xl overflow-hidden shadow-lg'>
            <img className='w-full h-full object-cover' src={assets.about_image} alt="About Doceasy" />
          </div>

          {/* Content */}
          <div className='space-y-6'>
            <div>
              <h2 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4'>
                Welcome to Doceasy
              </h2>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Your trusted health companion for managing healthcare needs conveniently and efficiently. We understand the challenges you face when scheduling appointments and managing health records.
              </p>
            </div>

            <div className={`rounded-xl p-6 ${isDark ? 'bg-slate-800' : 'bg-blue-50'}`}>
              <h3 className='text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3'>
                Our Commitment
              </h3>
              <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Doceasy is committed to excellence in healthcare technology. We continuously integrate the latest advancements to improve your experience. Whether booking your first appointment or managing ongoing care, we're here to support you.
              </p>
            </div>

            <div className={`rounded-xl p-6 bg-gradient-to-r from-blue-600 to-blue-700`}>
              <h3 className='text-2xl font-bold text-white mb-3'>
                Our Vision
              </h3>
              <p className='text-blue-100 leading-relaxed'>
                To create a seamless healthcare experience by bridging the gap between patients and providers, making quality care accessible when you need it.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className='mb-20'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3'>
              Why Choose Doceasy?
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Experience healthcare the modern way
            </p>
          </div>

          {/* Feature Cards */}
          <div className='grid md:grid-cols-3 gap-8'>
            {/* Efficiency Card */}
            <div className={`group rounded-2xl p-8 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${
              isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gradient-to-br hover:from-blue-50'
            }`}>
              <div className='w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform'>
                ⚡
              </div>
              <h3 className='text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'>
                Efficiency
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                Streamlined appointment scheduling that fits into your busy lifestyle. Book in seconds, not hours.
              </p>
            </div>

            {/* Convenience Card */}
            <div className={`group rounded-2xl p-8 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${
              isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gradient-to-br hover:from-blue-50'
            }`}>
              <div className='w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform'>
                🏥
              </div>
              <h3 className='text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'>
                Convenience
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                Access to a network of trusted healthcare professionals in your area. Find the right doctor for your needs.
              </p>
            </div>

            {/* Personalization Card */}
            <div className={`group rounded-2xl p-8 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${
              isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gradient-to-br hover:from-blue-50'
            }`}>
              <div className='w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform'>
                🎯
              </div>
              <h3 className='text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'>
                Personalization
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                Tailored recommendations and reminders to help you stay on top of your health. Personalized care matters.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className={`rounded-2xl p-12 shadow-lg ${
          isDark ? 'bg-slate-800' : 'bg-white'
        }`}>
          <h2 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-8 text-center'>
            Our Core Values
          </h2>

          <div className='grid md:grid-cols-2 gap-8'>
            <div className='flex gap-4'>
              <div className='text-4xl'>🤝</div>
              <div>
                <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Trust
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  We build trust through transparency, security, and reliable service every single day.
                </p>
              </div>
            </div>

            <div className='flex gap-4'>
              <div className='text-4xl'>💡</div>
              <div>
                <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Innovation
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  We continuously innovate to bring cutting-edge technology to healthcare accessibility.
                </p>
              </div>
            </div>

            <div className='flex gap-4'>
              <div className='text-4xl'>❤️</div>
              <div>
                <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Care
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your health and satisfaction are at the heart of everything we do.
                </p>
              </div>
            </div>

            <div className='flex gap-4'>
              <div className='text-4xl'>📈</div>
              <div>
                <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Growth
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  We're committed to continuous improvement and helping our community thrive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
