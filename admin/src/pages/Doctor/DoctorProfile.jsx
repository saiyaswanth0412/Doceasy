import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import styles from '../../styles/RapidoDark.module.css'

const DoctorProfile = () => {

    const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)
    const { currency} = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)

    const updateProfile = async () => {

        try {

            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }

            setIsEdit(false)

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData && (
        <div className={styles.mainContent}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p className={styles.pageTitle}>Doctor Profile</p>
                <div>
                    <img className={styles.card} style={{ width: '100%', maxWidth: '256px', borderRadius: '8px' }} src={profileData.image} alt="" />
                </div>

                <div className={styles.formCard}>

                    {/* ----- Doc Info : name, degree, experience ----- */}

                    <p className={styles.heading3}>{profileData.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <p className={styles.textMuted}>{profileData.degree} - {profileData.speciality}</p>
                        <button style={{ padding: '2px 8px', border: '1px solid #ff6b35', fontSize: '12px', borderRadius: '12px' }}>{profileData.experience}</button>
                    </div>

                    {/* ----- Doc About ----- */}
                    <div style={{ marginTop: '16px' }}>
                        <p className={styles.formLabel}>About :</p>
                        <p className={styles.text} style={{ maxWidth: '700px', marginTop: '4px' }}>
                            {
                                isEdit
                                    ? <textarea onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} type='text' className={styles.formTextarea} rows={8} value={profileData.about} />
                                    : profileData.about
                            }
                        </p>
                    </div>

                    <p className={styles.text} style={{ marginTop: '16px' }}>
                        Appointment fee: <span style={{ fontWeight: 'bold' }}>{currency} {isEdit ? <input type='number' onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} className={styles.formInput} value={profileData.fees} /> : profileData.fees}</span>
                    </p>

                    <div style={{ display: 'flex', gap: '8px', paddingTop: '8px' }}>
                        <p className={styles.formLabel}>Address:</p>
                        <p className={styles.textSmall}>
                            {isEdit ? <input type='text' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} className={styles.formInput} value={profileData.address.line1} /> : profileData.address.line1}
                            <br />
                            {isEdit ? <input type='text' onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} className={styles.formInput} value={profileData.address.line2} /> : profileData.address.line2}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '4px', paddingTop: '8px', alignItems: 'center' }}>
                        <input type="checkbox" onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} checked={profileData.available} />
                        <label className={styles.text}>Available</label>
                    </div>

                    {
                        isEdit
                            ? <button onClick={updateProfile} className={styles.primaryBtn} style={{ marginTop: '20px' }}>Save</button>
                            : <button onClick={() => setIsEdit(prev => !prev)} className={styles.primaryBtn} style={{ marginTop: '20px' }}>Edit</button>
                    }

                </div>
            </div>
        </div>
    )
}

export default DoctorProfile