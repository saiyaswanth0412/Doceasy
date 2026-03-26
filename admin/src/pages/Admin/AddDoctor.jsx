import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import styles from '../../styles/RapidoDark.module.css'

const AddDoctor = () => {

  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')

  const { backendUrl } = useContext(AdminContext)
  const { aToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();

      // Image is optional - only add if selected
      if (docImg) {
        formData.append('image', docImg);
      }
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience);
      formData.append('fees', Number(fees));
      formData.append('about', about);
      formData.append('speciality', speciality);
      formData.append('degree', degree);
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

      // Debugging FormData (optional, can remove later)
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      const response = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: { aToken}  })
      const data= response.data;
      if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')
            } else {
                toast.error(data.message)
            }

    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.error(error);
    }
  }


  return (
    <form onSubmit={onSubmitHandler} className={styles.mainContent}>

      <h1 className={styles.pageTitle}>Add Doctor</h1>

      <div style={{ maxWidth: '800px' }} className={styles.formCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <label htmlFor="doc-img">
            <img style={{ width: '64px', borderRadius: '50%', cursor: 'pointer', backgroundColor: '#1f3052' }} src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" name="" id="doc-img" hidden />
          <p style={{ color: 'var(--text-secondary)' }}>Upload doctor <br /> picture</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Your name</label>
              <input onChange={e => setName(e.target.value)} value={name} className={styles.formInput} type="text" placeholder='Name' required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Doctor Email</label>
              <input onChange={e => setEmail(e.target.value)} value={email} className={styles.formInput} type="email" placeholder='Email' required />
            </div>


            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Set Password</label>
              <input onChange={e => setPassword(e.target.value)} value={password} className={styles.formInput} type="password" placeholder='Password' required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Experience</label>
              <select onChange={e => setExperience(e.target.value)} value={experience} className={styles.formSelect} >
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Years</option>
                <option value="3 Year">3 Years</option>
                <option value="4 Year">4 Years</option>
                <option value="5 Year">5 Years</option>
                <option value="6 Year">6 Years</option>
                <option value="8 Year">8 Years</option>
                <option value="9 Year">9 Years</option>
                <option value="10 Year">10+ Years</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Fees</label>
              <input onChange={e => setFees(e.target.value)} value={fees} className={styles.formInput} type="number" placeholder='Doctor fees' required />
            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Speciality</label>
              <select onChange={e => setSpeciality(e.target.value)} value={speciality} className={styles.formSelect}>
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>


            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Degree</label>
              <input onChange={e => setDegree(e.target.value)} value={degree} className={styles.formInput} type="text" placeholder='Degree' required />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Address</label>
              <input onChange={e => setAddress1(e.target.value)} value={address1} className={styles.formInput} type="text" placeholder='Address 1' required />
              <input onChange={e => setAddress2(e.target.value)} value={address2} className={styles.formInput} type="text" placeholder='Address 2' required />
            </div>

          </div>

        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>About Doctor</label>
          <textarea onChange={e => setAbout(e.target.value)} value={about} className={styles.formInput} rows={5} placeholder='write about doctor'></textarea>
        </div>

        <button type='submit' style={{ marginTop: '24px' }} className={styles.primaryBtn}>Add doctor</button>

      </div>


    </form>
  )
}

export default AddDoctor