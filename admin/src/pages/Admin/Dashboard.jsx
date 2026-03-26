import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import styles from '../../styles/RapidoDark.module.css'

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div>
      <h1 className={styles.pageTitle}>Admin Dashboard</h1>

      <div className={styles.gridContainerWide}>
        <div className={styles.metricCard}>
          <p className={styles.metricLabel}>👨‍⚕️ Total Doctors</p>
          <p className={styles.metricValue}>{dashData.doctors}</p>
          <p className={styles.metricSubtext}>Active doctors in system</p>
        </div>
        <div className={styles.metricCard}>
          <p className={styles.metricLabel}>📅 Appointments</p>
          <p className={styles.metricValue}>{dashData.appointments}</p>
          <p className={styles.metricSubtext}>Total bookings</p>
        </div>
        <div className={styles.metricCard}>
          <p className={styles.metricLabel}>👥 Patients</p>
          <p className={styles.metricValue}>{dashData.patients}</p>
          <p className={styles.metricSubtext}>Registered users</p>
        </div>
      </div>

      <div className={styles.tableCard} style={{ marginTop: '32px' }}>
        <div className={styles.tableCardHeader}>
          <div className={styles.flexBetween}>
            <h2 className={styles.tableCardTitle}>📋 Latest Appointments</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing last 5 bookings
            </span>
          </div>
        </div>

        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Doctor</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dashData.latestAppointments && dashData.latestAppointments.slice(0, 5).map((item, index) => (
              <tr key={index} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <div className={styles.flexBetween} style={{ gap: '12px' }}>
                    <img
                      src={item.docData.image}
                      alt=""
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                      }}
                    />
                    <span className={styles.tableCellPrimary}>{item.docData.name}</span>
                  </div>
                </td>
                <td className={styles.tableCell}>{slotDateFormat(item.slotDate)}</td>
                <td className={styles.tableCell}>
                  {item.cancelled ? (
                    <span className={styles.badgeError}>Cancelled</span>
                  ) : item.isCompleted ? (
                    <span className={styles.badgeSuccess}>Completed</span>
                  ) : (
                    <span className={styles.badgePending}>Pending</span>
                  )}
                </td>
                <td className={styles.tableCell}>
                  {!item.cancelled && !item.isCompleted && (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className={styles.dangerBtn}
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard