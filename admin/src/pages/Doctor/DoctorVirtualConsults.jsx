import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import styles from '../../styles/RapidoDark.module.css'

const DoctorVirtualConsults = () => {
  const { dToken, virtualConsults, getVirtualConsults, sendVirtualConsultReply, addVirtualConsultPrescription, getConsultSummary } = useContext(DoctorContext)
  const [replyDrafts, setReplyDrafts] = useState({})
  const [prescriptionModal, setPrescriptionModal] = useState(false)
  const [selectedConsultId, setSelectedConsultId] = useState(null)
  const [medicines, setMedicines] = useState([])
  const [prescriptionNotes, setPrescriptionNotes] = useState('')
  const [summaries, setSummaries] = useState({})
  const [loadingId, setLoadingId] = useState(null)
  const [summaryModal, setSummaryModal] = useState(false)
  const [selectedSummaryConsult, setSelectedSummaryConsult] = useState(null)

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

  const generateSummary = async (consultId) => {
    setLoadingId(consultId)
    try {
      const result = await getConsultSummary(consultId)
      console.log('Summary result:', result)
      if (result.success) {
        setSummaries((prev) => ({ 
          ...prev, 
          [consultId]: result.summary 
        }))
        console.log('Summary set successfully for:', consultId)
        // Open modal with summary
        setSelectedSummaryConsult(consultId)
        setSummaryModal(true)
      } else {
        console.error('Summary generation failed:', result.error)
      }
    } catch (error) {
      console.error('Error generating summary:', error)
    }
    setLoadingId(null)
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingRight: '8px', paddingBottom: '24px' }}>
        {virtualConsults.length === 0 ? (
          <div className={styles.tableCard} style={{ padding: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>No virtual requests assigned yet.</p>
          </div>
        ) : (
          virtualConsults.map((item, index) => (
            <div key={item._id} style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '16px',
              border: '1px solid rgba(100,200,255,0.15)',
              overflow: 'visible',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              transition: 'all 0.3s ease'
            }}>
              {/* HEADER - Purple Gradient with Status */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '24px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ margin: '0', color: 'white', fontSize: '1.1rem', fontWeight: '700' }}>
                    Patient #{index + 1}
                  </p>
                  <p style={{ margin: '6px 0 0 0', color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
                    {item.userName}
                  </p>
                </div>
                <span style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  backgroundColor: item.status === 'replied' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(245, 158, 11, 0.9)',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {item.status === 'replied' ? '✓ REPLIED' : '⏳ PENDING'}
                </span>
              </div>

              {/* CONTENT */}
              <div style={{ padding: '24px 20px' }}>
                
                {/* Patient Info Grid - Compact Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '12px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}>
                    <p style={{ margin: '0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Age</p>
                    <p style={{ margin: '6px 0 0 0', fontSize: '1.4rem', fontWeight: '800', color: '#3b82f6' }}>{item.age}</p>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(236, 72, 153, 0.05))',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(236, 72, 153, 0.2)'
                  }}>
                    <p style={{ margin: '0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gender</p>
                    <p style={{ margin: '6px 0 0 0', fontSize: '1rem', fontWeight: '700', color: '#ec4899' }}>{item.gender}</p>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.05))',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(168, 85, 247, 0.2)'
                  }}>
                    <p style={{ margin: '0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Duration</p>
                    <p style={{ margin: '6px 0 0 0', fontSize: '1rem', fontWeight: '700', color: '#a855f7' }}>{item.duration}</p>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.05))',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(6, 182, 212, 0.2)'
                  }}>
                    <p style={{ margin: '0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Specialty</p>
                    <p style={{ margin: '6px 0 0 0', fontSize: '0.95rem', fontWeight: '700', color: '#06b6d4', textAlign: 'center' }}>{item.preferredSpeciality}</p>
                  </div>
                </div>

                {/* Chief Complaint */}
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📋 Chief Complaint</p>
                  <div style={{
                    padding: '12px 14px',
                    borderLeft: '4px solid #3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.05)',
                    borderRadius: '8px'
                  }}>
                    <p style={{ margin: '0', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {item.symptoms}
                    </p>
                  </div>
                </div>

                {/* Medical History - if exists */}
                {item.medicalHistory && (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🏥 Medical History</p>
                    <div style={{
                      padding: '12px 14px',
                      borderLeft: '4px solid #06b6d4',
                      backgroundColor: 'rgba(6, 182, 212, 0.05)',
                      borderRadius: '8px'
                    }}>
                      <p style={{ margin: '0', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        {item.medicalHistory}
                      </p>
                    </div>
                  </div>
                )}

                {/* Problem Summary */}
                {item.problemSummary && (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📝 Problem Summary</p>
                    <div style={{
                      padding: '12px 14px',
                      borderLeft: '4px solid #f59e0b',
                      backgroundColor: 'rgba(245, 158, 11, 0.05)',
                      borderRadius: '8px'
                    }}>
                      <p style={{ margin: '0', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        {item.problemSummary}
                      </p>
                    </div>
                  </div>
                )}

                {/* AI ANALYSIS BOX - PROMINENT */}
                {summaries[item._id] ? (
                  <div style={{
                    backgroundColor: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(168, 85, 247, 0.02))',
                    borderRadius: '12px',
                    padding: '18px',
                    border: '2px solid #a855f7',
                    marginBottom: '20px',
                    boxShadow: '0 8px 20px rgba(168, 85, 247, 0.15)',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontWeight: '700', color: '#a855f7', marginBottom: '10px', fontSize: '1rem' }}>✨ AI Analysis Generated</p>
                    <button
                      onClick={() => {
                        setSelectedSummaryConsult(item._id)
                        setSummaryModal(true)
                      }}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: '#a855f7',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)'
                      }}
                    >
                      👁️ View Details
                    </button>
                  </div>
                ) : null}

                {/* Prescription - if given */}
                {item.prescription && (
                  <div style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    marginBottom: '20px'
                  }}>
                    <p style={{ fontWeight: '700', color: '#10b981', marginBottom: '12px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>💊 Prescription Given</p>
                    <div style={{ space: '8px' }}>
                      {item.prescription.medicines && item.prescription.medicines.map((med, i) => (
                        <p key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '6px 0', paddingLeft: '12px', borderLeft: '2px solid #10b981' }}>
                          <span style={{ fontWeight: '600' }}>{med.name}</span> • {med.dosage} ({med.frequency}, {med.duration})
                        </p>
                      ))}
                      {item.prescription.notes && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '10px 0 0 0', fontStyle: 'italic' }}>📌 {item.prescription.notes}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* ACTION BUTTONS */}
                {!summaries[item._id] || !item.prescription ? (
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '20px',
                    flexWrap: 'wrap'
                  }}>
                    {!summaries[item._id] && (
                      <button
                        onClick={() => generateSummary(item._id)}
                        disabled={loadingId === item._id}
                        style={{
                          padding: '11px 18px',
                          backgroundColor: loadingId === item._id ? 'rgba(168, 85, 247, 0.6)' : '#a855f7',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '0.9rem',
                          cursor: loadingId === item._id ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          opacity: loadingId === item._id ? 0.7 : 1,
                          boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)'
                        }}
                      >
                        {loadingId === item._id ? '⏳ Analyzing...' : '🤖 AI Analysis'}
                      </button>
                    )}
                    {!item.prescription && (
                      <button
                        onClick={() => openPrescriptionModal(item._id)}
                        style={{
                          padding: '11px 18px',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        💊 Add Prescription
                      </button>
                    )}
                  </div>
                ) : null}

                {/* REPLY SECTION */}
                <div style={{ borderTop: '1px solid rgba(100,100,100,0.1)', paddingTop: '20px' }}>
                  {item.status === 'replied' ? (
                    <div style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}>
                      <p style={{ fontWeight: '700', color: '#10b981', marginBottom: '12px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>✓ Reply Sent</p>
                      <p style={{ margin: '0', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        {item.doctorReply}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>Your Guidance & Recommendations</label>
                      <textarea
                        value={replyDrafts[item._id] || ''}
                        onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [item._id]: e.target.value }))}
                        style={{
                          minHeight: '100px',
                          marginBottom: '12px',
                          borderRadius: '8px',
                          padding: '12px',
                          border: '1px solid rgba(100,100,100,0.2)',
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-primary)',
                          fontFamily: 'inherit',
                          fontSize: '0.95rem',
                          lineHeight: '1.5'
                        }}
                        placeholder='Write your clinical assessment, recommendations, and guidance for the patient...'
                      />
                      <button
                        onClick={() => submitReply(item._id)}
                        style={{
                          padding: '12px 20px',
                          backgroundColor: '#06b6d4',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          width: '100%',
                          transition: 'all 0.2s',
                          boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
                        }}
                      >
                        📤 Send Reply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Prescription Modal */}
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

      {/* AI Summary Modal */}
      {summaryModal && selectedSummaryConsult && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '16px',
            maxWidth: '700px',
            width: '90%',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            border: '1px solid rgba(100,200,255,0.1)'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '24px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ margin: '0', color: 'white', fontSize: '1.3rem', fontWeight: '700' }}>
                ✨ AI HEALTH ANALYSIS
              </h2>
              <button
                onClick={() => setSummaryModal(false)}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '28px 24px' }}>
              {/* Patient Info Summary */}
              <div style={{ marginBottom: '24px' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Patient Information</p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: 'rgba(59, 130, 246, 0.05)',
                  borderRadius: '10px',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  {virtualConsults.map(c => c._id === selectedSummaryConsult && (
                    <React.Fragment key={c._id}>
                      <div><p style={{ margin: '0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>Age</p><p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: '700', color: '#3b82f6' }}>{c.age}</p></div>
                      <div><p style={{ margin: '0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>Gender</p><p style={{ margin: '4px 0 0 0', fontSize: '0.95rem', fontWeight: '700', color: '#ec4899' }}>{c.gender}</p></div>
                      <div><p style={{ margin: '0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>Duration</p><p style={{ margin: '4px 0 0 0', fontSize: '0.95rem', fontWeight: '700', color: '#a855f7' }}>{c.duration}</p></div>
                      <div><p style={{ margin: '0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>Specialty</p><p style={{ margin: '4px 0 0 0', fontSize: '0.95rem', fontWeight: '700', color: '#06b6d4' }}>{c.preferredSpeciality}</p></div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* AI Summary */}
              <div style={{ marginBottom: '24px' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Detailed Analysis</p>
                <div style={{
                  backgroundColor: 'rgba(168, 85, 247, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '2px solid #a855f7',
                  color: 'var(--text-secondary)',
                  fontSize: '0.96rem',
                  lineHeight: '1.8',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word'
                }}>
                  {summaries[selectedSummaryConsult]}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
                <button
                  onClick={() => setSummaryModal(false)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    flex: 1
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Copy to clipboard
                    navigator.clipboard.writeText(summaries[selectedSummaryConsult])
                    alert('Analysis copied to clipboard!')
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#a855f7',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
                    flex: 1
                  }}
                >
                  📋 Copy Text
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorVirtualConsults
