import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import styles from '../../styles/RapidoDark.module.css'

const DoctorVirtualConsults = () => {
  const { dToken, virtualConsults, getVirtualConsults, sendVirtualConsultReply, addVirtualConsultPrescription } = useContext(DoctorContext)
  const [replyDrafts, setReplyDrafts] = useState({})
  const [prescriptionModal, setPrescriptionModal] = useState(false)
  const [selectedConsultId, setSelectedConsultId] = useState(null)
  const [medicines, setMedicines] = useState([])
  const [prescriptionNotes, setPrescriptionNotes] = useState('')

  useEffect(() => {
    if (dToken) {
      getVirtualConsults()
    }
  }, [dToken])

  const submitReply = (consultId) => {
    const message = (replyDrafts[consultId] || '').trim()
    if (!message) return
    sendVirtualConsultReply(consultId, message)
  }

  const openPrescriptionModal = (consultId) => {
    setSelectedConsultId(consultId)
    setMedicines([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }])
    setPrescriptionNotes('')
    setPrescriptionModal(true)
  }

  const addMedicineField = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }])
  }

  const removeMedicineField = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index))
  }

  const updateMedicineField = (index, field, value) => {
    const updated = [...medicines]
    updated[index][field] = value
    setMedicines(updated)
  }

  const submitPrescription = async () => {
    if (!selectedConsultId) return
    if (medicines.some(med => !med.name || !med.dosage)) {
      alert('Please fill in medicine name and dosage')
      return
    }

    const success = await addVirtualConsultPrescription(selectedConsultId, medicines, prescriptionNotes)
    if (success) {
      setPrescriptionModal(false)
      setMedicines([])
      setPrescriptionNotes('')
      setSelectedConsultId(null)
    }
  }

  return (
    <div className={styles.mainContent}>
      <h1 className={styles.pageTitle}>Virtual Doctor Requests</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '80vh', overflowY: 'scroll', paddingRight: '8px' }}>
        {virtualConsults.length === 0 ? (
          <div className={styles.tableCard} style={{ padding: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>No virtual requests assigned yet.</p>
          </div>
        ) : (
          virtualConsults.map((item, index) => (
            <div key={item._id} className={styles.tableCard} style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
                <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>#{index + 1} • {item.userName} ({item.userEmail})</p>
                <span className={item.status === 'replied' ? styles.badgeSuccess : styles.badgePending} style={{ padding: '6px 12px' }}>
                  {item.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '16px', fontSize: '0.95rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}><span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Age:</span> {item.age}</p>
                <p style={{ color: 'var(--text-secondary)' }}><span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Gender:</span> {item.gender}</p>
                <p style={{ color: 'var(--text-secondary)' }}><span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Preferred Speciality:</span> {item.preferredSpeciality}</p>
                <p style={{ color: 'var(--text-secondary)' }}><span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Duration:</span> {item.duration}</p>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '12px' }}><span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Summary:</span> {item.problemSummary}</p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '12px' }}><span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Symptoms:</span> {item.symptoms}</p>
              {item.medicalHistory && (
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '12px' }}><span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Medical History:</span> {item.medicalHistory}</p>
              )}
              {item.currentMedications && (
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '16px' }}><span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Current Medications:</span> {item.currentMedications}</p>
              )}

              {item.prescription && (
                <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', padding: '16px', border: '1px solid var(--border)', marginBottom: '16px' }}>
                  <p style={{ fontWeight: '600', color: 'var(--accent)', marginBottom: '8px' }}>Prescription Given</p>
                  {item.prescription.medicines && item.prescription.medicines.map((med, i) => (
                    <p key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                      {med.name} - {med.dosage} ({med.frequency}, {med.duration})
                    </p>
                  ))}
                  {item.prescription.notes && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '8px' }}>Notes: {item.prescription.notes}</p>
                  )}
                </div>
              )}

              {item.status === 'replied' ? (
                <div style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', borderRadius: '8px', padding: '16px', border: '1px solid var(--border)', marginBottom: '16px' }}>
                  <p style={{ fontWeight: '600', color: 'var(--accent)', marginBottom: '8px' }}>Your Reply</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{item.doctorReply}</p>
                </div>
              ) : (
                <div>
                  <textarea
                    value={replyDrafts[item._id] || ''}
                    onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [item._id]: e.target.value }))}
                    className={styles.formInput}
                    style={{ minHeight: '96px', marginBottom: '12px' }}
                    placeholder='Write your guidance and recommendation...'
                  />
                  <button
                    onClick={() => submitReply(item._id)}
                    className={styles.primaryBtn}
                  >
                    Send Reply
                  </button>
                </div>
              )}

              {!item.prescription && (
                <button
                  onClick={() => openPrescriptionModal(item._id)}
                  className={styles.primaryBtn}
                  style={{ marginTop: '12px', backgroundColor: 'rgba(34, 197, 94, 0.9)' }}
                >
                  Add Prescription
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {prescriptionModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className={styles.tableCard} style={{ maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}>
            <h2 style={{ marginBottom: '16px' }}>Add Prescription</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Medicines</label>
              {medicines.map((med, index) => (
                <div key={index} style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                  <input
                    type="text"
                    placeholder="Medicine Name"
                    value={med.name}
                    onChange={(e) => updateMedicineField(index, 'name', e.target.value)}
                    className={styles.formInput}
                    style={{ marginBottom: '8px' }}
                  />
                  <input
                    type="text"
                    placeholder="Dosage (e.g., 500mg)"
                    value={med.dosage}
                    onChange={(e) => updateMedicineField(index, 'dosage', e.target.value)}
                    className={styles.formInput}
                    style={{ marginBottom: '8px' }}
                  />
                  <input
                    type="text"
                    placeholder="Frequency (e.g., Twice daily)"
                    value={med.frequency}
                    onChange={(e) => updateMedicineField(index, 'frequency', e.target.value)}
                    className={styles.formInput}
                    style={{ marginBottom: '8px' }}
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 7 days)"
                    value={med.duration}
                    onChange={(e) => updateMedicineField(index, 'duration', e.target.value)}
                    className={styles.formInput}
                    style={{ marginBottom: '8px' }}
                  />
                  <input
                    type="text"
                    placeholder="Instructions (optional)"
                    value={med.instructions}
                    onChange={(e) => updateMedicineField(index, 'instructions', e.target.value)}
                    className={styles.formInput}
                    style={{ marginBottom: '8px' }}
                  />
                  {medicines.length > 1 && (
                    <button
                      onClick={() => removeMedicineField(index)}
                      className={styles.primaryBtn}
                      style={{ backgroundColor: '#ef4444', marginTop: '4px' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addMedicineField}
                className={styles.primaryBtn}
                style={{ marginTop: '8px', backgroundColor: 'rgba(6, 182, 212, 0.9)' }}
              >
                + Add Medicine
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Notes (optional)</label>
              <textarea
                value={prescriptionNotes}
                onChange={(e) => setPrescriptionNotes(e.target.value)}
                className={styles.formInput}
                placeholder="Additional notes and instructions..."
                style={{ minHeight: '80px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={submitPrescription}
                className={styles.primaryBtn}
              >
                Save Prescription
              </button>
              <button
                onClick={() => setPrescriptionModal(false)}
                className={styles.primaryBtn}
                style={{ backgroundColor: '#6b7280' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorVirtualConsults
