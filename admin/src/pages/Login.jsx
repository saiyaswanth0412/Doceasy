import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'
import styles from '../styles/RapidoDark.module.css'

const Login = () => {

  const [state, setState] = useState('Admin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => { 
    event.preventDefault();

    if (state === 'Admin') {

      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
      if (data.success) {
        setAToken(data.token)
        localStorage.setItem('aToken', data.token)
      } else {
        toast.error(data.message)
      }

    } else {

      const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
      if (data.success) {
        setDToken(data.token)
        localStorage.setItem('dToken', data.token)
      } else {
        toast.error(data.message)
      }

    }

  }

  return (
    <div className={styles.loginShell}>
      <form onSubmit={onSubmitHandler} className={styles.loginCard}>
        <div className={styles.loginForm}>
          <h1 className={styles.loginTitle}><span style={{ color: 'var(--primary)' }}>{state}</span> Login</h1>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email</label>
            <input onChange={(e) => setEmail(e.target.value)} value={email} className={styles.loginInput} type="email" placeholder='Email' required />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Password</label>
            <input onChange={(e) => setPassword(e.target.value)} value={password} className={styles.loginInput} type="password" placeholder='Password' required />
          </div>
          
          <button className={styles.loginBtn}>Login</button>
          
          {state === 'Admin'
            ? <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Doctor Login? <span onClick={() => setState('Doctor')} style={{ color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer' }}>Click here</span></p>
            : <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Admin Login? <span onClick={() => setState('Admin')} style={{ color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer' }}>Click here</span></p>
          }
        </div>
      </form>
    </div>
  )
}

export default Login