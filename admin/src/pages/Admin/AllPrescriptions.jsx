import { useState, useContext, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function AllPrescriptions() {
  const { userToken, backendUrl } = useContext(AppContext)
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${backendUrl}/api/prescription/all-prescriptions`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      if (response.data.success) {
        setPrescriptions(response.data.prescriptions)
      }
    } catch (error) {
      toast.error('Failed to fetch prescriptions')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (prescriptionId, newStatus) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/prescription/${prescriptionId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${userToken}` } }
      )
      if (response.data.success) {
        toast.success('Status updated')
        fetchPrescriptions()
      }
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const filteredPrescriptions = filter === 'All' 
    ? prescriptions 
    : prescriptions.filter(p => p.status === filter)

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">All Prescriptions</h1>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {['All', 'Active', 'Completed', 'Cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Prescriptions Table */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="text-center py-8 text-gray-600">No prescriptions found</div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-800">Patient</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-800">Doctor</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-800">Medicines</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-800">Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-800">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-800">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrescriptions.map((prescription) => (
                  <tr key={prescription._id} className="border-b hover:bg-blue-50">
                    <td className="px-6 py-4">{prescription.patientId?.name || 'N/A'}</td>
                    <td className="px-6 py-4">{prescription.doctorId?.name || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {prescription.medicines.map((med, idx) => (
                          <div key={idx} className="text-gray-600">
                            {med.medicineId?.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(prescription.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        prescription.status === 'Active' ? 'bg-green-100 text-green-800' :
                        prescription.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {prescription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={prescription.status}
                        onChange={(e) => handleStatusChange(prescription._id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none"
                      >
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllPrescriptions
