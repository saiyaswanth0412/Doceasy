import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const Banner = () => {
    const navigate = useNavigate()
    const { isDark } = useTheme()

    return (
        <div className={`relative overflow-hidden rounded-2xl my-20 mx-4 md:mx-10 ${
            isDark
            ? 'bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900'
            : 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700'
        }`}>
            {/* Animated background elements */}
            <div className='absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse'></div>
            <div className='absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse'></div>

            <div className='relative flex items-center justify-between px-6 sm:px-10 md:px-14 lg:px-20 py-8 sm:py-12 md:py-16 lg:py-20'>
                {/* Left Content */}
                <div className='flex-1'>
                    <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight'>
                        Ready to get better?
                    </h2>
                    <p className='text-blue-100 text-sm md:text-base mb-8 max-w-md'>
                        Book an appointment with our top specialists. Your health is our priority.
                    </p>
                    <button
                        onClick={() => { navigate('/login'); window.scrollTo(0, 0) }}
                        className='bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold px-8 py-3 rounded-full transition-all hover:shadow-lg hover:scale-105 duration-300'
                    >
                        Get Started Today
                    </button>
                </div>

                {/* Right Image */}
                <div className='hidden md:block md:w-1/2 lg:w-[350px] relative'>
                    <div className='relative'>
                        <div className='absolute inset-0 bg-gradient-to-r from-yellow-300 to-blue-400 rounded-2xl blur-2xl opacity-30'></div>
                        <img
                            className='w-full relative z-10 drop-shadow-2xl'
                            src={assets.appointment_img}
                            alt="Book appointment"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner