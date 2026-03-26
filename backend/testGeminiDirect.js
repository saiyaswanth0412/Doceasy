import 'dotenv/config'
import axios from 'axios'

async function testGeminiAPIDirectly() {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY
    console.log('Gemini API Key:', geminiApiKey ? '✓ Found' : '✗ Not found')
    console.log('\nTesting Gemini API directly...\n')

    if (!geminiApiKey) {
      console.error('❌ GEMINI_API_KEY not configured in .env file')
      process.exit(1)
    }

    const model = 'gemini-2.5-flash'
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
    
    const response = await axios.post(
      `${geminiUrl}?key=${geminiApiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: 'What is the capital of France? Give answer in short.'
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('✅ API Response Received!\n')
    console.log('Status:', response.status)
    console.log('\n📋 Full Response:')
    console.log(JSON.stringify(response.data, null, 2))

    if (response.data.candidates && response.data.candidates.length > 0) {
      const reply = response.data.candidates[0].content.parts[0].text
      console.log('\n✅ SUCCESS! Answer from Gemini:\n')
      console.log('Q: What is the capital of France?')
      console.log(`A: ${reply}`)
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.response) {
      console.error('Response Status:', error.response.status)
      console.error('Response Data:', error.response.data)
    }
    process.exit(1)
  }
}

testGeminiAPIDirectly()
