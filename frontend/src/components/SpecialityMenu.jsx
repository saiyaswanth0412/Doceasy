import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const SpecialityMenu = () => {
    const { isDark } = useTheme()

    // Creative speciality descriptions
    const specialityDescriptions = {
        'General physician': 'Your trusted primary care partner',
        'Gynecologist': 'Women\'s health & wellness experts',
        'Dermatologist': 'Skin excellence specialists',
        'Pediatricians': 'Caring for your little ones',
        'Neurologist': 'Brain & nervous system care',
        'Gastroenterologist': 'Digestive health specialists'
    }

    return (
        <div id='speciality' className={`py-20 px-4 transition-colors duration-300 ${
            isDark ? 'bg-slate-900' : 'bg-gray-50'
        }`}>
            <div className='max-w-6xl mx-auto'>
                {/* Section Header */}
                <div className='text-center mb-14'>
                    <p className='text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-3'>
                        ✨ Premium Healthcare
                    </p>
                    <h2 className='text-4xl md:text-5xl font-bold mb-5'>
                        <span className='bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent'>
                            Specialized Care,
                        </span>
                        <br />
                        <span className='bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent'>
                            Tailored to You
                        </span>
                    </h2>
                    <p className='text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed mt-6'>
                        Connect with world-class specialists across all medical disciplines. From routine check-ups to specialized treatments, we've got you covered.
                    </p>
                </div>

                {/* Speciality Cards Grid - Strict 2 columns, 3 rows */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto'>
                    {specialityData.map((item, index) => (
                        <Link 
                            to={`/doctors/${item.speciality}`} 
                            onClick={() => window.scrollTo(0, 0)} 
                            key={index}
                            className={`group flex items-start gap-4 p-6 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden ${
                                isDark 
                                ? 'bg-slate-800 hover:bg-slate-700 hover:shadow-xl' 
                                : 'bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 hover:shadow-xl'
                            } hover:-translate-y-1 border ${
                                isDark ? 'border-slate-700' : 'border-gray-200'
                            } hover:border-blue-400`}
                        >
                            {/* Background Gradient Effect */}
                            <div className='absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-300'></div>

                            {/* Icon Container */}
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-lg relative z-10 shrink-0 ${
                                isDark ? 'bg-blue-900 bg-opacity-50 group-hover:bg-opacity-100' : 'bg-blue-100 group-hover:bg-blue-200'
                            }`}>
                                <img 
                                    className='w-8 h-8 object-contain' 
                                    src={item.image} 
                                    alt={item.speciality}
                                />
                            </div>

                            {/* Speciality Name & Description */}
                            <div className='relative z-10 text-left flex-1'>
                                <p className={`text-base font-bold mb-1 transition-colors ${
                                    isDark ? 'text-gray-100 group-hover:text-blue-300' : 'text-slate-900 group-hover:text-blue-700'
                                }`}>
                                    {item.speciality}
                                </p>
                                <p className={`text-sm transition-all ${
                                    isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {specialityDescriptions[item.speciality]}
                                </p>
                            </div>

                            {/* Hover Arrow */}
                            <div className='absolute top-5 right-5 opacity-80 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 z-10'>
                                <span className='text-lg'>→</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className='mt-16 text-center'>
                    <p className={`text-lg font-medium mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Can't find what you're looking for?
                    </p>
                    <Link 
                        to='/doctors'
                        className='inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-full transition-all hover:shadow-lg hover:scale-105'
                    >
                        View All Doctors →
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SpecialityMenu