# Chatbot API Testing Guide

## ✅ API Endpoint
**POST** `http://localhost:4000/api/chatbot/send-message`

## 📋 Prerequisites

1. **Backend running**: http://localhost:4000 should be accessible
2. **User authenticated**: You must have a valid JWT token from logging in
3. **GITHUB_TOKEN configured**: Must be set in `.env` file
4. **Network access**: Able to reach `https://models.github.ai/inference`

## 🧪 Test Examples

### Option 1: cURL (Command Line)

First, get a valid JWT token by logging in through the frontend, then replace `YOUR_JWT_TOKEN` in the commands below.

**Basic Test:**
```bash
curl -X POST http://localhost:4000/api/chatbot/send-message \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"How do I book an appointment?"}'
```

**Full Request with all headers visible:**
```bash
curl -v -X POST http://localhost:4000/api/chatbot/send-message \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"What are your office hours?"}'
```

### Option 2: Postman

1. **Method**: POST
2. **URL**: `http://localhost:4000/api/chatbot/send-message`
3. **Headers Tab**:
   - Key: `Authorization`
   - Value: `Bearer YOUR_JWT_TOKEN`
   - Key: `Content-Type`
   - Value: `application/json`
4. **Body Tab** (select Raw, JSON):
   ```json
   {
     "message": "Can you help me book an appointment with a cardiologist?"
   }
   ```
5. Click **Send**

### Option 3: JavaScript/Node.js

```javascript
const fetch = require('node-fetch');

const sendMessage = async (message, token) => {
  try {
    const response = await fetch('http://localhost:4000/api/chatbot/send-message', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });
    
    const data = await response.json();
    console.log('Response:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage:
sendMessage('How much does a consultation cost?', 'YOUR_JWT_TOKEN');
```

### Option 4: Python

```python
import requests
import json

def send_message(message, token):
    url = 'http://localhost:4000/api/chatbot/send-message'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = {'message': message}
    
    response = requests.post(url, headers=headers, json=payload)
    return response.json()

# Usage:
result = send_message('What specialists do you have?', 'YOUR_JWT_TOKEN')
print(result)
```

## 📊 Success Response

```json
{
  "success": true,
  "reply": "I'd be happy to help you book an appointment! You can browse our available doctors, select your preferred specialist, choose a convenient time slot, and complete the booking. Which type of doctor are you looking for?",
  "timestamp": "2024-03-25T10:30:00Z"
}
```

## ❌ Error Responses

### 400 - Empty Message
```json
{
  "success": false,
  "message": "Message cannot be empty"
}
```

### 401 - Missing/Invalid Authentication
```json
{
  "success": false,
  "message": "User not authenticated"
}
```

### 500 - Configuration Missing
```json
{
  "success": false,
  "message": "Chatbot is not configured - missing GITHUB_TOKEN",
  "error": "Environment variable not set"
}
```

### 500 - API Call Failed
```json
{
  "success": false,
  "message": "Failed to get response from chatbot",
  "error": "Request failed with status code 401"
}
```

## 🔍 Debugging

### Check Backend Status
```bash
# The backend should respond with:
curl http://localhost:4000/
# Expected: "API Working"
```

### Verify JWT Token Format
Your JWT token should look like:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTFjMjM0ZTU2YTQ1MjEwMDAwMDAwMCIsImlhdCI6MTcwNTAxNjY2MH0.abc123xyz789...
```

### Common Issues

1. **"Cannot find package '@mistralai/mistralai'"**
   - ✅ FIXED - Now using REST API with axios instead
   - No action needed

2. **"GITHUB_TOKEN is not set"**
   - ✅ Add to `.env`: `GITHUB_TOKEN=your_github_pat`
   - Restart backend: `npm run server`

3. **"User not authenticated"**
   - Make sure you're logged in from frontend first
   - Get token from browser DevTools > Application > localStorage (look for `token` or `userToken`)

4. **"Failed to get response from chatbot"**
   - Verify GITHUB_TOKEN is valid and has correct scopes
   - Check network connectivity to `https://models.github.ai/inference`
   - Check console logs in backend terminal

5. **Connection refused to localhost:4000**
   - Start backend: `npm run server` (from backend directory)
   - Ensure you're in the right directory

## 🎯 Test Conversation Examples

Try these messages to test the chatbot:

- "How do I book an appointment?"
- "What are your office hours?"
- "Which doctors specialize in cardiology?"
- "Can I schedule a virtual consultation?"
- "What is the cancellation policy?"
- "Do you accept insurance?"
- "How long does an appointment usually take?"

## 📝 Testing Workflow

1. Start backend: `npm run server`
2. Visit frontend: http://localhost:5173/
3. Login with test account
4. Click 💬 button in bottom-right
5. Send message through chat UI (easier than manual API testing)
6. OR use one of the API test methods above

---

**All set!** Your chatbot API is now properly configured with the GitHub Mistral models REST API endpoint.
