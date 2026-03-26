import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import styles from '../../styles/RapidoDark.module.css'

const DoctorVirtualConsults = () => {
  const { dToken, virtualConsults, getVirtualConsults, sendVirtualConsultReply } = useContext(DoctorContext)
  const [replyDrafts, setReplyDrafts] = useState({})

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

              {item.status === 'replied' ? (
                <div style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', borderRadius: '8px', padding: '16px', border: '1px solid var(--border)' }}>
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
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DoctorVirtualConsults
