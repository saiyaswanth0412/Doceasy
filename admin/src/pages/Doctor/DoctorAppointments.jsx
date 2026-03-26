import React, { useState } from 'react'
import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import styles from '../../styles/RapidoDark.module.css'
import PrescriptionModal from '../../components/PrescriptionModal'

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment, backendUrl } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  const handleAddPrescription = (appointmentId) => {
    console.log('Add Rx clicked for appointment:', appointmentId)
    setSelectedAppointmentId(appointmentId)
    setShowPrescriptionModal(true)
  }

  return (
    <div className={styles.mainContent}>

      <p className={styles.pageTitle}>All Appointments</p>

      <div className={styles.tableCard}>
        <div className={`${styles.table} ${styles.tableHeader}`}>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Prescription</p>
          <p>Action</p>
        </div>
        {appointments.map((item, index) => (
          <div className={styles.tableRow} key={index}>
            <p className={styles.tableCell}>{index+1}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src={item.userData.image} style={{ width: '32px', borderRadius: '50%' }} alt="" /> <p>{item.userData.name}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', display: 'inline-block', border: '1px solid #ff6b35', padding: '2px 8px', borderRadius: '12px' }}>
                {item.payment?'Online':'CASH'}
              </p>
            </div>
            <p className={styles.tableCell}>{calculateAge(item.userData.dob)}</p>
            <p className={styles.tableCell}>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <p className={styles.tableCell}>{currency}{item.amount}</p>
            <p className={styles.tableCell}>
              {item.prescription && item.prescription.medicines && item.prescription.medicines.length > 0 ? (
                <span className={styles.badgeSuccess}>✓ Added</span>
              ) : (
                <span className={styles.badgeError}>Pending</span>
              )}
            </p>
            {item.cancelled
              ? <p className={styles.badgeError}>Cancelled</p>
              : <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {item.isCompleted && (
                    <p className={styles.badgeSuccess}>Completed</p>
                  )}
                  <button
                    onClick={() => {
                      console.log('Button clicked for appointment:', item._id)
                      handleAddPrescription(item._id)
                    }}
                    className={styles.successBtn}
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                  >
                    {item.prescription && item.prescription.medicines && item.prescription.medicines.length > 0 ? 'Edit Rx' : 'Add Rx'}
                  </button>
                  {!item.isCompleted && (
                    <>
                      <img onClick={() => cancelAppointment(item._id)} style={{ width: '40px', cursor: 'pointer' }} src={assets.cancel_icon} alt="" />
                      <img onClick={() => completeAppointment(item._id)} style={{ width: '40px', cursor: 'pointer' }} src={assets.tick_icon} alt="" />
                    </>
                  )}
                </div>
            }
          </div>
        ))}
      </div>

      {showPrescriptionModal && (
        <PrescriptionModal
          appointmentId={selectedAppointmentId}
          backendUrl={backendUrl}
          token={dToken}
          endpoint="doctor"
          onClose={() => setShowPrescriptionModal(false)}
          onSuccess={() => getAppointments()}
        />
      )}

    </div>
  )
}

export default DoctorAppointments