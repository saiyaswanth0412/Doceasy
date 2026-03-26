import React, { useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'

const VirtualDoctor = () => {
  const { backendUrl, token, doctors } = useContext(AppContext)
  const { isDark } = useTheme()

  const [loading, setLoading] = useState(false)
  const [requests, setRequests] = useState([])
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    symptoms: '',
    duration: '',
    medicalHistory: '',
    currentMedications: '',
    preferredSpeciality: 'General physician',
    preferredDoctorId: ''
  })

  const specialities = ['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist']

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => doc.speciality === formData.preferredSpeciality)
  }, [doctors, formData.preferredSpeciality])

  const fetchRequests = async () => {
    if (!token) return
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/virtual-consults`, {
        headers: { token }
      })

      if (data.success) {
        setRequests(data.consults)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!token) {
      toast.error('Please login to use Virtual Doctor')
      return
    }

    try {
      setLoading(true)
      const payload = {
        ...formData,
        age: Number(formData.age)
      }

      const { data } = await axios.post(`${backendUrl}/api/user/virtual-consult`, payload, {
        headers: { token }
      })

      if (data.success) {
        toast.success(data.message)
        setFormData((prev) => ({
          ...prev,
          symptoms: '',
          duration: '',
          medicalHistory: '',
          currentMedications: '',
          preferredDoctorId: ''
        }))
        fetchRequests()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [token])

  return (
    <div className={`min-h-screen transition-colors duration-300 py-12 px-4 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-10'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2'>Virtual Doctor</h1>
          <p className='text-gray-600 dark:text-gray-400'>Submit your symptoms, get problem summary, and receive a doctor response.</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <form onSubmit={onSubmit} className='bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg space-y-4'>
            <h2 className='text-xl font-bold text-blue-600 dark:text-blue-400'>Consultation Form</h2>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <input
                type='number'
                min='1'
                placeholder='Age'
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className='px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-transparent'
                required
              />
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className='px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-transparent'
                required
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <textarea
              placeholder='Describe your symptoms'
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-transparent min-h-28'
              required
            />

            <input
              type='text'
              placeholder='How long have you had this problem? (e.g. 3 days)'
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-transparent'
              required
            />

            <textarea
              placeholder='Medical history (optional)'
              value={formData.medicalHistory}
              onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
              className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-transparent min-h-24'
            />

            <textarea
              placeholder='Current medications (optional)'
              value={formData.currentMedications}
              onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
              className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-transparent min-h-24'
            />

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <select
                value={formData.preferredSpeciality}
                onChange={(e) => setFormData({ ...formData, preferredSpeciality: e.target.value, preferredDoctorId: '' })}
                className='px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-transparent'
                required
              >
                {specialities.map((speciality) => (
                  <option key={speciality} value={speciality}>{speciality}</option>
                ))}
              </select>

              <select
                value={formData.preferredDoctorId}
                onChange={(e) => setFormData({ ...formData, preferredDoctorId: e.target.value })}
                className='px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-transparent'
              >
                <option value=''>Any doctor</option>
                {filteredDoctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>Dr. {doc.name}</option>
                ))}
              </select>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 disabled:opacity-60'
            >
              {loading ? 'Submitting...' : 'Submit to Virtual Doctor'}
            </button>
          </form>

          <div className='bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg'>
            <h2 className='text-xl font-bold text-blue-600 dark:text-blue-400 mb-4'>My Virtual Requests</h2>

            <div className='space-y-4 max-h-[720px] overflow-y-auto pr-1'>
              {requests.length === 0 ? (
                <p className='text-gray-500 dark:text-gray-400'>No virtual consultation requests yet.</p>
              ) : (
                requests.map((item) => (
                  <div key={item._id} className='border border-gray-200 dark:border-slate-700 rounded-xl p-4'>
                    <div className='flex items-center justify-between gap-4 mb-2'>
                      <p className='font-semibold text-slate-900 dark:text-white'>Assigned: Dr. {item.assignedDoctorName}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'replied' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'}`}>
                        {item.status}
                      </span>
                    </div>

                    <p className='text-sm text-gray-700 dark:text-gray-300 mb-2'>
                      <span className='font-semibold'>Summary:</span> {item.problemSummary}
                    </p>
                    <p className='text-sm text-gray-700 dark:text-gray-300 mb-2'>
                      <span className='font-semibold'>Symptoms:</span> {item.symptoms}
                    </p>

                    {item.doctorReply ? (
                      <div className='mt-3 p-3 rounded-lg bg-blue-50 dark:bg-slate-700'>
                        <p className='text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1'>Doctor Reply</p>
                        <p className='text-sm text-gray-700 dark:text-gray-200'>{item.doctorReply}</p>
                      </div>
                    ) : (
                      <p className='mt-3 text-sm text-gray-500 dark:text-gray-400'>Awaiting doctor response...</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VirtualDoctor
