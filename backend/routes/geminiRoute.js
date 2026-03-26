import express from 'express'
import axios from 'axios'
import authUser from '../middlewares/authUser.js'

const router = express.Router()

// Gemini API endpoint for chat (no auth required for testing)
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body

    if (!message || message.trim() === '') {
      return res.json({ success: false, message: 'Message is required' })
    }

    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      return res.json({ success: false, message: 'Gemini API key not configured' })
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
                text: message
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

    if (response.data.candidates && response.data.candidates.length > 0) {
      const reply = response.data.candidates[0].content.parts[0].text
      return res.json({ success: true, reply: reply })
    } else {
      return res.json({ success: false, message: 'No response from Gemini API' })
    }
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message)
    return res.json({ success: false, message: error.message })
  }
})

export default router
