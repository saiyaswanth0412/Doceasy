import 'dotenv/config'
import axios from 'axios'

async function listAvailableModels() {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY
    
    console.log('Fetching available Gemini models...\n')

    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1/models?key=${geminiApiKey}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('✅ Available Models:\n')
    console.log(JSON.stringify(response.data, null, 2))

    if (response.data.models && response.data.models.length > 0) {
      console.log('\n📋 Model List:')
      response.data.models.forEach((model, index) => {
        console.log(`${index + 1}. ${model.name}`)
        if (model.supportedGenerationMethods) {
          console.log(`   Methods: ${model.supportedGenerationMethods.join(', ')}`)
        }
      })
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.response) {
      console.error('Response Status:', error.response.status)
      console.error('Response Data:', error.response.data)
    }
  }
}

listAvailableModels()
