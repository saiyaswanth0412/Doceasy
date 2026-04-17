import React, { useState } from 'react'

const TestLocation = () => {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const getLocation = () => {
    setLoading(true)
    setError(null)
    
    if (!navigator.geolocation) {
      setError('Geolocation not supported by browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        setLocation({ latitude, longitude, accuracy })
        setLoading(false)
        console.log('📍 Location:', { latitude, longitude, accuracy })
      },
      (err) => {
        setError(`Error: ${err.message}`)
        setLoading(false)
        console.error('❌ Location error:', err)
      }
    )
  }

  return (
    <div style={{ padding: '20px', border: '2px solid blue', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>🧪 Location Test</h3>
      
      <button 
        onClick={getLocation}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '📍 Getting location...' : '📍 Test Get My Location'}
      </button>

      {location && (
        <div style={{ marginTop: '15px', backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '4px' }}>
          <p style={{ margin: '5px 0' }}>✅ <strong>Latitude:</strong> {location.latitude.toFixed(6)}</p>
          <p style={{ margin: '5px 0' }}>✅ <strong>Longitude:</strong> {location.longitude.toFixed(6)}</p>
          <p style={{ margin: '5px 0' }}>✅ <strong>Accuracy:</strong> {location.accuracy.toFixed(2)} meters</p>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '15px', backgroundColor: '#ffebee', padding: '15px', borderRadius: '4px', color: '#c62828' }}>
          ❌ {error}
        </div>
      )}
    </div>
  )
}

export default TestLocation
