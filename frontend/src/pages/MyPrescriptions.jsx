import { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function MyPrescriptions() {
  const { userToken, backendUrl } = useContext(AppContext)
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {
    if (!userToken) return
    
    setLoading(true)
    try {
      const response = await axios.get(
        `${backendUrl}/api/prescription/patient-prescriptions`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      if (response.data.success) {
        setPrescriptions(response.data.prescriptions)
      }
    } catch (error) {
      toast.error('Failed to fetch prescriptions')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const downloadPrescription = async (prescriptionId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/prescription/${prescriptionId}/download`,
        {},
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      
      if (response.data.success) {
        // Create a downloadable document
        const dataStr = JSON.stringify(response.data.data, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `prescription_${prescriptionId}.json`
        link.click()
        toast.success('Prescription downloaded!')
      }
    } catch (error) {
      toast.error('Failed to download prescription')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-700">My Prescriptions</h1>

        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading prescriptions...</div>
        ) : prescriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">No prescriptions yet</p>
            <p className="text-gray-500">Your prescriptions from doctors will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <div key={prescription._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
                {/* Prescription Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-blue-50 transition"
                  onClick={() => setExpandedId(expandedId === prescription._id ? null : prescription._id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Dr. {prescription.doctorId?.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        prescription.status === 'Active' ? 'bg-green-100 text-green-800' :
                        prescription.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {prescription.status}
                      </span>
                      <span className="text-2xl text-gray-400">
                        {expandedId === prescription._id ? '▼' : '▶'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Prescription Details */}
                {expandedId === prescription._id && (
                  <div className="border-t border-gray-200 bg-blue-50 p-6">
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Medicines</h4>
                      <div className="space-y-3">
                        {prescription.medicines.map((med, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-4">
                            <p className="font-medium text-gray-800">{med.medicineId?.name}</p>
                            <p className="text-sm text-gray-600">Dosage: {med.dosage || 'As prescribed'}</p>
                            <p className="text-sm text-gray-600">Frequency: {med.frequency}</p>
                            <p className="text-sm text-gray-600">Duration: {med.duration}</p>
                            <p className="text-sm text-gray-600">Instructions: {med.instructions}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {prescription.notes && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Doctor's Notes</h4>
                        <p className="text-gray-600 bg-white rounded-lg p-4">{prescription.notes}</p>
                      </div>
                    )}

                    <button
                      onClick={() => downloadPrescription(prescription._id)}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      📥 Download Prescription
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPrescriptions
