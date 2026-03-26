import React from 'react';
import { assets } from '../assets/assets';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer className={`transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-b from-slate-900 to-slate-950' : 'bg-slate-900'
    }`}>
      {/* Main Footer Content */}
      <div className='px-6 md:px-10 lg:px-20 py-16'>
        <div className='grid md:grid-cols-[3fr_1fr_1fr_1fr] gap-12 max-w-6xl mx-auto'>
          {/* Brand Section */}
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <img className='w-8 h-8' src={assets.logo} alt='Doceasy' />
              <h2 className='text-2xl font-bold text-white'>Doceasy</h2>
            </div>
            <p className='text-gray-400 leading-6 max-w-xs'>
              Making healthcare accessible. Book appointments with trusted doctors instantly with our smart scheduling platform.
            </p>

            {/* Social Links */}
            <div className='flex gap-4 pt-4'>
              <button className='w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all'>
                f
              </button>
              <button className='w-10 h-10 rounded-full bg-blue-400 hover:bg-blue-500 text-white flex items-center justify-center transition-all'>
                𝕏
              </button>
              <button className='w-10 h-10 rounded-full bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center transition-all'>
                📷
              </button>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className='text-lg font-bold text-white mb-5'>Company</h3>
            <ul className='space-y-3'>
              <li>
                <a href='/' className='text-gray-400 hover:text-yellow-400 transition-colors'>
                  Home
                </a>
              </li>
              <li>
                <a href='/about' className='text-gray-400 hover:text-yellow-400 transition-colors'>
                  About
                </a>
              </li>
              <li>
                <a href='/contact' className='text-gray-400 hover:text-yellow-400 transition-colors'>
                  Contact
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-yellow-400 transition-colors'>
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className='text-lg font-bold text-white mb-5'>Support</h3>
            <ul className='space-y-3'>
              <li>
                <a href='#' className='text-gray-400 hover:text-yellow-400 transition-colors'>
                  Help Center
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-yellow-400 transition-colors'>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-yellow-400 transition-colors'>
                  Terms of Use
                </a>
              </li>
              <li>
                <a href='#' className='text-gray-400 hover:text-yellow-400 transition-colors'>
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className='text-lg font-bold text-white mb-5'>Get in Touch</h3>
            <ul className='space-y-4'>
              <li>
                <p className='text-gray-400 text-sm mb-1'>Email</p>
                <a href='mailto:customersupport@doceasy.in' className='text-yellow-400 hover:text-yellow-300 transition-colors'>
                  customersupport@doceasy.in
                </a>
              </li>
              <li>
                <p className='text-gray-400 text-sm mb-1'>Phone</p>
                <a href='tel:+919000090000' className='text-yellow-400 hover:text-yellow-300 transition-colors'>
                  +91 9000-090-000
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className='h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent'></div>

      {/* Bottom Footer */}
      <div className='px-6 md:px-10 lg:px-20 py-8'>
        <div className='flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto'>
          <p className='text-gray-400 text-sm'>
            © 2025 Doceasy Technology. All rights reserved.
          </p>
          <p className='text-gray-400 text-sm mt-4 md:mt-0'>
            Powered by <span className='text-yellow-400 font-semibold'>Doceasy</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
