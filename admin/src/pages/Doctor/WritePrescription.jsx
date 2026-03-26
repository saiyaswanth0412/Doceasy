import { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function WritePrescription() {
  const { userToken, backendUrl } = useContext(AppContext)
  const [medicines, setMedicines] = useState([])
  const [selectedMedicines, setSelectedMedicines] = useState([])
  const [patientId, setPatientId] = useState('')
  const [appointmentId, setAppointmentId] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch medicines on component mount
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/prescription/medicines`)
        if (response.data.success) {
          setMedicines(response.data.medicines)
        }
      } catch (error) {
        console.error('Error fetching medicines:', error)
        toast.error('Failed to load medicines')
      }
    }
    fetchMedicines()
  }, [backendUrl])

  const addMedicine = () => {
    setSelectedMedicines([...selectedMedicines, {
      medicineId: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    }])
  }

  const removeMedicine = (index) => {
    setSelectedMedicines(selectedMedicines.filter((_, i) => i !== index))
  }

  const handleMedicineChange = (index, field, value) => {
    const updated = [...selectedMedicines]
    updated[index][field] = value
    setSelectedMedicines(updated)
  }

  const submitPrescription = async () => {
    if (!patientId || selectedMedicines.length === 0) {
      toast.error('Please select patient and add medicines')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        `${backendUrl}/api/prescription/create`,
        {
          patientId,
          appointmentId: appointmentId || null,
          medicines: selectedMedicines,
          notes
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      )

      if (response.data.success) {
        toast.success('Prescription created successfully!')
        setPatientId('')
        setAppointmentId('')
        setSelectedMedicines([])
        setNotes('')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create prescription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">Write Prescription</h1>

        {/* Patient Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Enter patient ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Appointment ID */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Appointment ID (Optional)</label>
          <input
            type="text"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
            placeholder="Enter appointment ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Medicines Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Medicines</h2>
          
          {selectedMedicines.map((med, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium text-gray-700">Medicine {index + 1}</h3>
                <button
                  onClick={() => removeMedicine(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Select Medicine */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Medicine</label>
                  <select
                    value={med.medicineId}
                    onChange={(e) => handleMedicineChange(index, 'medicineId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a medicine</option>
                    {medicines.map((medicine) => (
                      <option key={medicine._id} value={medicine._id}>
                        {medicine.name} ({medicine.dosage})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <input
                    type="text"
                    placeholder="e.g., Twice a day"
                    value={med.frequency}
                    onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g., 7 days"
                    value={med.duration}
                    onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                  <input
                    type="text"
                    placeholder="e.g., After meals"
                    value={med.instructions}
                    onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addMedicine}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            + Add Medicine
          </button>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes or instructions"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={submitPrescription}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Prescription'}
        </button>
      </div>
    </div>
  )
}

export default WritePrescription
