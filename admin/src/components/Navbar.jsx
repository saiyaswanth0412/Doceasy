import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from '../styles/RapidoDark.module.css'

const Navbar = () => {
  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const logout = () => {
    navigate('/')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  const goToUserPanel = () => {
    window.location.href = 'http://localhost:5173'
  }

  const isActive = (path) => location.pathname === path

  const adminMenuItems = [
    { label: 'Dashboard', path: '/admin-dashboard' },
    { label: 'Appointments', path: '/all-appointments' },
    { label: 'Doctors', path: '/doctor-list' },
    { label: 'Add Doctor', path: '/add-doctor' },
  ]

  const doctorMenuItems = [
    { label: 'Dashboard', path: '/doctor-dashboard' },
    { label: 'Appointments', path: '/doctor-appointments' },
    { label: 'Virtual Consults', path: '/doctor-virtual-consults' },
    { label: 'Profile', path: '/doctor-profile' },
  ]

  const menuItems = aToken ? adminMenuItems : doctorMenuItems
  const userRole = aToken ? 'Admin Panel' : 'Doctor Panel'

  return (
    <nav className={styles.topNav}>
      {/* Brand Logo */}
      <a href="/" className={styles.navBrand}>
        <span className={styles.navBrandIcon}>⚕️</span>
        <span>Appointy</span>
      </a>

      {/* Navigation Menu */}
      <ul className={styles.navMenu}>
        {menuItems.map((item) => (
          <li key={item.path}>
            <button
              onClick={() => navigate(item.path)}
              className={`${styles.navItem} ${
                isActive(item.path) ? styles.active : ''
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Right Side: Profile & Actions */}
      <div className={styles.navRight}>
        <button
          onClick={goToUserPanel}
          className={styles.secondaryBtn}
          title="Go to Patient App"
          style={{
            padding: '6px 12px',
            fontSize: '0.85rem',
            textTransform: 'capitalize',
            fontWeight: '600',
          }}
        >
          👥 Patient Side
        </button>

        <div className={styles.navProfile}>
          <span className={styles.navProfileName}>{userRole}</span>
        </div>

        <button onClick={logout} className={styles.navLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
