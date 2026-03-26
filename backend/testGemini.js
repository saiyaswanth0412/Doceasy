import axios from 'axios'

async function testGeminiAPI() {
  try {
    console.log('Testing Gemini API endpoint...\n')
    
    const response = await axios.post('http://localhost:4000/api/gemini/chat', {
      message: 'What is the capital of France?'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('Response Status:', response.status)
    console.log('Response Data:', JSON.stringify(response.data, null, 2))
    
    if (response.data.success) {
      console.log('\n✅ Success!')
      console.log('Reply:', response.data.reply)
    } else {
      console.log('\n❌ Error:', response.data.message)
    }

  } catch (error) {
    console.error('Test failed:', error.message)
    if (error.response) {
      console.error('Response data:', error.response.data)
    }
  }
}

testGeminiAPI()
