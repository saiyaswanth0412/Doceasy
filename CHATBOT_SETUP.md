# Appointy Chatbot Setup Guide

## ⚠️ Security Note
You exposed a GitHub PAT token in your request. **Please regenerate it immediately** at https://github.com/settings/tokens to prevent unauthorized access.

## Overview
The Appointy chatbot is now integrated using Mistral AI model via GitHub's API. The chatbot helps users with appointment booking assistance.

## Features
- 💬 Real-time conversation with Mistral AI
- 📱 Responsive chat interface
- 🔐 Secure authentication with user tokens
- 🎯 Appointment booking focused responses
- ⌨️ Send with Enter key (Shift+Enter for new line)

## Setup Instructions

### 1. GitHub Token Configuration
1. Go to https://github.com/settings/tokens/new
2. Create a new Personal Access Token (Classic)
3. Select scope: `read:packages` (for Model access)
4. Copy the token

### 2. Environment Variables
Update the `.env` file in the project root:

```env
# Existing variables...
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
VITE_CURRENCY=₹

# New Mistral Configuration
GITHUB_TOKEN=your_regenerated_github_pat_here
MISTRAL_API_URL=https://api.mistral.ai/v1
MISTRAL_API_KEY=your_mistral_api_key_here
```

### 3. Backend Setup
The chatbot backend route is already configured:
- Route: `/api/chatbot/send-message`
- Method: POST
- Requires: User authentication token
- Request body: `{ message: "user message" }`

### 4. Frontend Integration
The ChatBot component is already added to the frontend App.jsx and will appear as:
- Floating button in bottom-right corner (💬)
- Click to open/close chat window
- Responsive design for mobile devices

## File Structure

```
backend/
  ├── routes/chatbotRoute.js          (New)
  ├── controllers/chatbotController.js (New)
  └── server.js                        (Updated)

frontend/
  ├── src/components/
  │   ├── ChatBot.jsx                 (New)
  │   └── ChatBot.css                 (New)
  └── src/App.jsx                     (Updated)
```

## API Documentation

### Send Message Endpoint
**POST** `/api/chatbot/send-message`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <user_token>"
}
```

**Request Body:**
```json
{
  "message": "How can I book an appointment?"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "reply": "I'd be happy to help you book an appointment...",
  "timestamp": "2024-03-25T10:30:00Z"
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm run server
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

The chatbot will be available at `http://localhost:5173/`

## Customization

### Modify Bot Behavior
Edit `backend/controllers/chatbotController.js`:
```javascript
const systemPrompt = `Your custom system prompt here...`;
```

### Styling
Edit `frontend/src/components/ChatBot.css` to customize:
- Colors (currently gradient purple)
- Position (currently bottom-right)
- Size and animations
- Responsive breakpoints

### Conversation Context
Currently, each message is stateless. To add conversation history:
1. Store messages in MongoDB
2. Include previous messages in API request
3. Update controller to build context

## Troubleshooting

### "Failed to get response from chatbot"
- Verify `GITHUB_TOKEN` in `.env` file
- Ensure token has `read:packages` scope
- Check GitHub Models API availability

### Chatbot not appearing
- Clear browser cache
- Restart frontend dev server
- Check browser console for errors

### Authentication errors
- Ensure user is logged in before using chatbot
- Verify JWT token is valid
- Check `authUser` middleware in backend

## Next Steps
1. Update the `.env` file with your GitHub token
2. Restart backend and frontend servers
3. Visit http://localhost:5173/
4. Click the 💬 button in bottom-right corner
5. Start chatting!

## Notes
- The chatbot is available only for authenticated users
- Mistral responses are limited to 500 tokens
- Temperature is set to 0.7 for balanced creativity
- Messages are not permanently stored (consider adding persistence later)

## Support
For issues or feature requests, contact the development team or check the main README.md
