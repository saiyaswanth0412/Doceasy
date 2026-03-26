import axios from 'axios'

async function testConnectivity() {
  try {
    console.log('Testing backend connectivity...\n')
    
    // Test 1: Basic connection
    const basicTest = await axios.get('http://localhost:4000/')
    console.log('✅ Backend is responding')
    console.log('Response:', basicTest.data)
    
    // Test 2: Chatbot endpoint
    console.log('\nTesting chatbot endpoint...')
    const chatTest = await axios.post('http://localhost:4000/api/chatbot/send-message', {
      message: 'Hello'
    })
    console.log('✅ Chatbot endpoint works!')
    console.log('Response:', chatTest.data)
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
  }
}

testConnectivity()
