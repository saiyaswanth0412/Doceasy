import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const adminPanelUrl = import.meta.env.VITE_ADMIN_PANEL_URL || 'http://localhost:5174'
  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)
  const { isDark, toggleTheme } = useTheme()

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  return (
    <div className='bg-gradient-to-r from-blue-600 to-blue-800 dark:from-slate-900 dark:to-slate-800 shadow-lg sticky top-0 z-50'>
      <div className='flex items-center justify-between px-4 sm:px-8 py-4'>
        <ul className='hidden md:flex items-center gap-8 font-semibold text-white'>
          <li>
            <NavLink to='/' className={({ isActive }) => isActive ? 'text-yellow-300 border-b-2 border-yellow-300 pb-1' : 'hover:text-yellow-300 transition'}>HOME</NavLink>
          </li>
          <li>
            <NavLink to='/doctors' className={({ isActive }) => isActive ? 'text-yellow-300 border-b-2 border-yellow-300 pb-1' : 'hover:text-yellow-300 transition'}>DOCTORS</NavLink>
          </li>
          <li>
            <NavLink to='/doctor-discovery' className={({ isActive }) => isActive ? 'text-yellow-300 border-b-2 border-yellow-300 pb-1' : 'hover:text-yellow-300 transition'}>💳 SWIPER</NavLink>
          </li>
          <li>
            <NavLink to='/virtual-doctor' className={({ isActive }) => isActive ? 'text-yellow-300 border-b-2 border-yellow-300 pb-1' : 'hover:text-yellow-300 transition'}>VIRTUAL DOCTOR</NavLink>
          </li>
          <li>
            <NavLink to='/about' className={({ isActive }) => isActive ? 'text-yellow-300 border-b-2 border-yellow-300 pb-1' : 'hover:text-yellow-300 transition'}>ABOUT</NavLink>
          </li>
          <li>
            <NavLink to='/contact' className={({ isActive }) => isActive ? 'text-yellow-300 border-b-2 border-yellow-300 pb-1' : 'hover:text-yellow-300 transition'}>CONTACT</NavLink>
          </li>
        </ul>

        <div className='flex items-center gap-4'>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className='p-2 rounded-full bg-white dark:bg-slate-700 text-slate-900 dark:text-yellow-300 hover:scale-110 transition transform'
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* ✅ Admin Panel Button - show only on home page  */}
          {location.pathname === '/' && (
            <button
              onClick={() => window.open(adminPanelUrl, '_self')}
              className='bg-yellow-400 text-slate-900 text-xs px-4 py-2 rounded-full font-bold hover:bg-yellow-300 transition hidden md:block'
            >
              Admin Panel
            </button>
          )}


          {token && userData ? (
            <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-10 h-10 rounded-full border-2 border-yellow-300' src={userData.image || '/fallback-user.png'} alt="profile" />
              <span className='text-white font-semibold hidden sm:inline text-sm'>Profile</span>
              <div className='absolute top-0 right-0 pt-12 text-base font-medium z-20 hidden group-hover:block'>
                <div className='min-w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl p-4 space-y-3'>
                  <p onClick={() => { navigate('my-profile'); setShowMenu(false) }} className='hover:bg-blue-100 dark:hover:bg-slate-700 px-4 py-2 rounded cursor-pointer transition'>My Profile</p>
                  <p onClick={() => { navigate('my-appointments'); setShowMenu(false) }} className='hover:bg-blue-100 dark:hover:bg-slate-700 px-4 py-2 rounded cursor-pointer transition'>My Appointments</p>
                  <hr className='dark:border-slate-600' />
                  <p onClick={logout} className='hover:bg-red-100 dark:hover:bg-red-900/20 px-4 py-2 rounded cursor-pointer transition text-red-600'>Logout</p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className='bg-yellow-400 text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-yellow-300 transition hidden md:block'
            >
              Login
            </button>
          )}

          <img onClick={() => setShowMenu(!showMenu)} className='w-6 md:hidden text-white cursor-pointer' src={assets.menu_icon} alt="" />

          {/* ---- Mobile Menu ---- */}
          <div className={`md:hidden fixed right-0 top-16 bottom-0 z-20 overflow-hidden bg-white dark:bg-slate-900 transition-all ${showMenu ? 'w-64' : 'w-0'}`}>
            <div className='flex items-center justify-between px-5 py-6'>
              <h2 className='text-xl font-bold text-blue-600 dark:text-blue-400'>Menu</h2>
              <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-6 cursor-pointer' alt="" />
            </div>
            <ul className='flex flex-col gap-4 px-5 text-lg font-semibold'>
              <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-3 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-800 transition block'>HOME</p></NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/doctors' ><p className='px-4 py-3 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-800 transition block'>DOCTORS</p></NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/doctor-discovery' ><p className='px-4 py-3 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-800 transition block'>💳 SWIPER</p></NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/virtual-doctor' ><p className='px-4 py-3 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-800 transition block'>VIRTUAL DOCTOR</p></NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/about' ><p className='px-4 py-3 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-800 transition block'>ABOUT</p></NavLink>
              <NavLink onClick={() => setShowMenu(false)} to='/contact' ><p className='px-4 py-3 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-800 transition block'>CONTACT</p></NavLink>
              {!token && (
                <button
                  onClick={() => { navigate('/login'); setShowMenu(false) }}
                  className='bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition w-full'
                >
                  Login
                </button>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
