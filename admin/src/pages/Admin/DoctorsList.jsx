import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import styles from '../../styles/RapidoDark.module.css'

const DoctorsList = () => {

  const { doctors , aToken , getAllDoctors, changeAvailability} = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
        getAllDoctors()
    }
}, [aToken])

  return (
    <div className={styles.mainContent}>
      <h1 className={styles.pageTitle}>All Doctors</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px', marginTop: '24px' }}>
        {doctors.map((item, index) => (
          <div className={styles.card} key={index} style={{ overflow: 'hidden', transition: 'all 140ms ease' }}>
            <img style={{ width: '100%', height: '200px', objectFit: 'cover', backgroundColor: 'var(--bg-darker)', cursor: 'pointer' }} src={item.image} alt={item.name} />
            <div style={{ padding: '16px' }}>
              <p style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>{item.name}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '16px' }}>{item.speciality}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} style={{ cursor: 'pointer' }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList