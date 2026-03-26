import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const PrescriptionModal = ({ appointmentId, backendUrl, token, endpoint = 'admin', onClose, onSuccess }) => {
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  console.log('PrescriptionModal rendered with appointmentId:', appointmentId)

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...medicines]
    newMedicines[index][field] = value
    setMedicines(newMedicines)
  }

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }])
  }

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (medicines.some(m => !m.name || !m.dosage || !m.frequency || !m.duration)) {
      toast.error('Please fill all medicine details')
      return
    }

    setLoading(true)
    try {
      const headers = endpoint === 'doctor' 
        ? { Authorization: `Bearer ${token}` }
        : { atoken: token }

      const { data } = await axios.post(
        `${backendUrl}/api/${endpoint}/add-prescription`,
        { appointmentId, medicines, notes },
        { headers }
      )

      if (data.success) {
        toast.success(data.message)
        onSuccess()
        onClose()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        maxWidth: '42rem',
        width: '100%',
        maxHeight: '24rem',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <div className='p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white'>
          <h2 className='text-2xl font-bold text-gray-800'>Add Prescription</h2>
          <button onClick={onClose} className='text-2xl font-bold text-gray-600 hover:text-gray-800' type='button'>×</button>
        </div>

        <form onSubmit={handleSubmit} className='p-6'>
          <div className='space-y-4'>
            {/* Medicines Section */}
            <div>
              <label className='block text-lg font-semibold text-gray-700 mb-3'>Medicines</label>
              
              {medicines.map((medicine, index) => (
                <div key={index} className='border rounded-lg p-4 mb-4 bg-gray-50'>
                  <div className='grid grid-cols-2 gap-3 mb-3'>
                    <input
                      type='text'
                      placeholder='Medicine Name'
                      value={medicine.name}
                      onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                      className='border border-gray-300 rounded px-3 py-2 text-sm'
                      required
                    />
                    <input
                      type='text'
                      placeholder='Dosage (e.g., 500mg)'
                      value={medicine.dosage}
                      onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                      className='border border-gray-300 rounded px-3 py-2 text-sm'
                      required
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-3 mb-3'>
                    <input
                      type='text'
                      placeholder='Frequency (e.g., Twice daily)'
                      value={medicine.frequency}
                      onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                      className='border border-gray-300 rounded px-3 py-2 text-sm'
                      required
                    />
                    <input
                      type='text'
                      placeholder='Duration (e.g., 7 days)'
                      value={medicine.duration}
                      onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                      className='border border-gray-300 rounded px-3 py-2 text-sm'
                      required
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-3 items-start'>
                    <input
                      type='text'
                      placeholder='Instructions (e.g., After meals)'
                      value={medicine.instructions}
                      onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                      className='border border-gray-300 rounded px-3 py-2 text-sm'
                    />
                    {medicines.length > 1 && (
                      <button
                        type='button'
                        onClick={() => removeMedicine(index)}
                        className='bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-semibold'
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                type='button'
                onClick={addMedicine}
                className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold text-sm'
              >
                + Add Medicine
              </button>
            </div>

            {/* Notes Section */}
            <div>
              <label className='block text-lg font-semibold text-gray-700 mb-2'>Additional Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder='Add any additional notes or warnings...'
                rows='3'
                className='w-full border border-gray-300 rounded px-3 py-2 text-sm'
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 mt-6 pt-4 border-t border-gray-200'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 rounded'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 rounded'
            >
              {loading ? 'Saving...' : 'Save Prescription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PrescriptionModal
