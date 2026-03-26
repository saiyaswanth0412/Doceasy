# ⚡ Quick Start - Appointy Chatbot

## 🚀 What's Ready
✅ Backend chatbot API endpoint (`/api/chatbot/send-message`)  
✅ Frontend chat UI component (floating 💬 button)  
✅ All servers running and hot-reloading  

## ⚠️ ACTION REQUIRED - Security First!

### Step 1: Secure Your GitHub Token
**Your token was exposed in chat - regenerate it NOW!**

1. Visit: https://github.com/settings/tokens
2. Find the token you shared
3. Click "Delete" to revoke it
4. Click "Generate new token (classic)"
5. Name: `appointy-mistral`
6. Scopes: Check ✓ `read:packages`
7. Click "Generate token"
8. Copy the new token

### Step 2: Update .env File
Edit `Appointy-master/.env`:

```env
# Add or update these lines at the bottom:
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
MISTRAL_API_URL=https://api.mistral.ai/v1
MISTRAL_API_KEY=your_mistral_key_here
```

Replace:
- `ghp_xxxxxxxxxxxxxxxxxxxx` with your NEW GitHub token from Step 1
- `your_mistral_key_here` with your Mistral API key (if you have one)

## 🧪 Test the Chatbot

1. **Visit Frontend:** http://localhost:5173/
2. **Login** (if not logged in already)
3. **Look for 💬 button** in bottom-right corner
4. **Click it** to open chat
5. **Type a message** like: "Help me book an appointment"
6. **Hit Enter** to send

## 📝 Example Conversations

**User:** "How do I book an appointment?"  
**Bot:** "I'd be happy to help you book an appointment! You can..."

**User:** "What doctors are available?"  
**Bot:** "We have specialists in various fields including..."

## 🔧 Backend Endpoints

**POST** `/api/chatbot/send-message`

Headers:
```
Authorization: Bearer <user-jwt-token>
Content-Type: application/json
```

Body:
```json
{
  "message": "Your message here"
}
```

Response:
```json
{
  "success": true,
  "reply": "Bot's response here",
  "timestamp": "2024-03-25T10:30:00Z"
}
```

## 🛠️ Files Created/Modified

**New Files:**
- `backend/routes/chatbotRoute.js`
- `backend/controllers/chatbotController.js`
- `frontend/src/components/ChatBot.jsx`
- `frontend/src/components/ChatBot.css`
- `CHATBOT_SETUP.md` (detailed guide)
- `QUICK_START_CHATBOT.md` (this file)

**Modified Files:**
- `backend/server.js` (added chatbot route)
- `frontend/src/App.jsx` (added ChatBot component)
- `.env` (added Mistral config)

## 📱 Features
- Real-time messaging
- Mobile responsive
- Authentication required
- Appointment-focused AI responses
- Smooth animations
- Dark mode compatible

## ❓ Troubleshooting

**Chatbot button not showing?**
- Clear browser cache (Ctrl+Shift+Delete)
- Restart frontend: `npm run dev`

**"Failed to get response" error?**
- Verify GITHUB_TOKEN in .env is correct
- Ensure token has `read:packages` scope
- Restart backend: `npm run server`

**Not seeing HMR updates?**
- Changes were hot-reloaded automatically
- Manual refresh: F5 or Ctrl+R

## 🎯 Next Steps

1. ✅ Regenerate GitHub token immediately
2. ✅ Update .env with new token
3. ✅ Visit http://localhost:5173/ in browser
4. ✅ Test the chatbot
5. ✅ Review CHATBOT_SETUP.md for customization

## 💡 Tips

- Type normally, press Enter to send
- Shift+Enter creates new line without sending
- Click 💬 button to toggle chat
- Bot remembers context within conversation
- Each message has a timestamp

---

**All servers are running and ready!** Just update your .env file and test the chatbot.
