import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useTheme } from '../context/ThemeContext'

const Header = () => {
    const { isDark } = useTheme()
    const navigate = useNavigate()

    return (
        <div className={`relative overflow-hidden rounded-2xl px-6 md:px-12 lg:px-20 py-12 md:py-20 ${
            isDark 
            ? 'bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900' 
            : 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800'
        } shadow-2xl`}>
            
            {/* Animated background elements */}
            <div className='absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse'></div>
            <div className='absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse'></div>

            <div className='relative flex flex-col md:flex-row items-center justify-between gap-8'>
                {/* Left Content */}
                <div className='w-full flex flex-col justify-center gap-6'>
                    <div>
                        <p className='text-yellow-300 font-bold text-sm uppercase tracking-widest mb-2'>Welcome to Doceasy</p>
                        <h1 className='text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight mb-4'>
                            Book Your <br />
                            <span className='bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent'>Perfect Doctor</span>
                        </h1>
                        <p className='text-blue-100 text-lg leading-relaxed'>
                            Healthcare at your fingertips. Find and book appointments with trusted doctors in minutes.
                        </p>
                    </div>

                    {/* Trust Badge */}
                    <div className='flex items-center gap-3 bg-white bg-opacity-10 backdrop-blur-md rounded-full px-6 py-3 w-fit border border-white border-opacity-20'>
                        <img className='w-10 h-10' src={assets.group_profiles} alt="trusted doctors" />
                        <div>
                            <p className='text-white font-bold text-sm'>Trusted by thousands</p>
                            <p className='text-blue-100 text-xs'>Join 50,000+ happy patients</p>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className='flex gap-4'>
                        <a href='#speciality' className='flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold px-8 py-3 rounded-full transition-all hover:shadow-lg hover:scale-105 duration-300'>
                            Get Started <img className='w-4' src={assets.arrow_icon} alt="" />
                        </a>
                        <button onClick={() => navigate('/doctor-discovery')} className='px-8 py-3 rounded-full border-2 border-white text-white font-bold hover:bg-white hover:text-blue-700 transition-all duration-300'>
                            💳 Try Swiper
                        </button>
                    </div>

                    {/* Stats */}
                    <div className='flex gap-8 pt-4'>
                        <div>
                            <p className='text-yellow-300 font-bold text-2xl'>500+</p>
                            <p className='text-blue-100 text-sm'>Expert Doctors</p>
                        </div>
                        <div>
                            <p className='text-yellow-300 font-bold text-2xl'>100%</p>
                            <p className='text-blue-100 text-sm'>Secure & Safe</p>
                        </div>
                        <div>
                            <p className='text-yellow-300 font-bold text-2xl'>24/7</p>
                            <p className='text-blue-100 text-sm'>Support</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header