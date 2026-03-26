import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import styles from '../../styles/RapidoDark.module.css'

const DoctorDashboard = () => {

  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)


  useEffect(() => {

    if (dToken) {
      getDashData()
    }

  }, [dToken])

  return dashData && (
    <div className={styles.mainContent}>
      <h1 className={styles.pageTitle}>Doctor Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className={styles.metricCard}>
          <img style={{ width: '56px', height: '56px' }} src={assets.earning_icon} alt="" />
          <div>
            <p className={styles.metricValue}>{currency} {dashData.earnings}</p>
            <p className={styles.metricLabel}>Earnings</p>
          </div>
        </div>
        <div className={styles.metricCard}>
          <img style={{ width: '56px', height: '56px' }} src={assets.appointments_icon} alt="" />
          <div>
            <p className={styles.metricValue}>{dashData.appointments}</p>
            <p className={styles.metricLabel}>Appointments</p>
          </div>
        </div>
        <div className={styles.metricCard}>
          <img style={{ width: '56px', height: '56px' }} src={assets.patients_icon} alt="" />
          <div>
            <p className={styles.metricValue}>{dashData.patients}</p>
            <p className={styles.metricLabel}>Patients</p>
          </div>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div style={{ padding: '20px', backgroundColor: 'rgba(255, 107, 53, 0.08)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={assets.list_icon} alt="" />
          <p style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Latest Bookings</p>
        </div>

        <div style={{ padding: '0' }}>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 20px',
                gap: '12px',
                borderBottom: '1px solid var(--border)',
                backgroundColor: 'var(--bg-card)',
                transition: 'background-color 140ms ease',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.05)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'var(--bg-card)')
              }
            >
              <img
                style={{
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  objectFit: 'cover',
                }}
                src={item.userData.image}
                alt=""
              />
              <div style={{ flex: 1, fontSize: '0.95rem' }}>
                <p
                  style={{
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                    marginBottom: '4px',
                  }}
                >
                  {item.userData.name}
                </p>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Booking on {slotDateFormat(item.slotDate)}
                </p>
              </div>
              {item.cancelled ? (
                <p className={styles.badgeError}>Cancelled</p>
              ) : item.isCompleted ? (
                <p className={styles.badgeSuccess}>Completed</p>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    style={{ width: '40px', cursor: 'pointer' }}
                    src={assets.cancel_icon}
                    alt=""
                  />
                  <img
                    onClick={() => completeAppointment(item._id)}
                    style={{ width: '40px', cursor: 'pointer' }}
                    src={assets.tick_icon}
                    alt=""
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard