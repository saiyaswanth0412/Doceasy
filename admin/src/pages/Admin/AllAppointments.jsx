import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import styles from '../../styles/RapidoDark.module.css'
import PrescriptionModal from '../../components/PrescriptionModal'

const AllAppointments = () => {

  const { aToken, appointments, cancelAppointment, getAllAppointments, backendUrl } = useContext(AdminContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  const handleAddPrescription = (appointmentId) => {
    setSelectedAppointmentId(appointmentId)
    setShowPrescriptionModal(true)
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>All Appointments</h1>

      <div className={styles.tableCard} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>#</th>
              <th>Patient</th>
              <th>Age</th>
              <th>Date & Time</th>
              <th>Doctor</th>
              <th>Fees</th>
              <th>Prescription</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments && appointments.map((item, index) => (
              <tr key={index} className={styles.tableRow}>
                <td className={styles.tableCell}>{index + 1}</td>
                <td className={styles.tableCell}>
                  <div className={styles.flexBetween} style={{ gap: '8px', justifyContent: 'flex-start' }}>
                    <img src={item.userData.image} alt="" style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />
                    <span className={styles.tableCellPrimary}>{item.userData.name}</span>
                  </div>
                </td>
                <td className={styles.tableCell}>{calculateAge(item.userData.dob)}</td>
                <td className={styles.tableCell}>{slotDateFormat(item.slotDate)} {item.slotTime}</td>
                <td className={styles.tableCell}>
                  <div className={styles.flexBetween} style={{ gap: '8px', justifyContent: 'flex-start' }}>
                    <img src={item.docData.image} alt="" style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />
                    <span className={styles.tableCellPrimary}>{item.docData.name}</span>
                  </div>
                </td>
                <td className={styles.tableCell}>{currency}{item.amount}</td>
                <td className={styles.tableCell}>
                  {item.prescription && item.prescription.medicines && item.prescription.medicines.length > 0 ? (
                    <span className={styles.badgeSuccess}>✓ Added</span>
                  ) : (
                    <span className={styles.badgeError}>Pending</span>
                  )}
                </td>
                <td className={styles.tableCell}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {!item.cancelled && (
                      <button
                        onClick={() => handleAddPrescription(item._id)}
                        className={styles.successBtn}
                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      >
                        {item.prescription && item.prescription.medicines && item.prescription.medicines.length > 0 ? 'Edit Rx' : 'Add Rx'}
                      </button>
                    )}
                    {item.cancelled ? (
                      <span className={styles.badgeError}>Cancelled</span>
                    ) : item.isCompleted ? (
                      <span className={styles.badgeSuccess}>Completed</span>
                    ) : (
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className={styles.dangerBtn}
                        style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPrescriptionModal && (
        <PrescriptionModal
          appointmentId={selectedAppointmentId}
          backendUrl={backendUrl}
          token={aToken}
          endpoint="admin"
          onClose={() => setShowPrescriptionModal(false)}
          onSuccess={() => getAllAppointments()}
        />
      )}
    </div>
  )
}

export default AllAppointments