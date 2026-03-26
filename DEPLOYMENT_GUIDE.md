# Appointy Vercel Deployment Guide

## Prerequisites

### Step 1: Install Git
Download and install from: https://git-scm.com/download/win
- Choose "Use Git from the Windows Command Prompt"
- Complete installation

### Step 2: Create GitHub Account & Repository
1. Go to https://github.com
2. Sign up or log in
3. Click "New" to create repository
4. Repository name: `Appointy`
5. Description: "AI-powered medical appointment booking system"
6. Make it **Public** (required for Vercel free tier)
7. Don't initialize with README (we have our own)
8. Click "Create repository"

## GitHub Upload (After Git Installation)

### Step 1: Initialize Local Repository
```powershell
cd "c:\Users\yaswa\Downloads\Appointy-master\Appointy-master"
git init
git config user.name "Your Name"
git config user.email "your-email@example.com"
```

### Step 2: Add GitHub Remote
Replace `YOUR_USERNAME` with your actual GitHub username:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/Appointy.git
git branch -M main
```

### Step 3: Create .gitignore
Create file: `c:\Users\yaswa\Downloads\Appointy-master\Appointy-master\.gitignore`
```
# Dependencies
node_modules/
*.pnp
.pnp.js

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
.next/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/

# Misc
.cache/
*.pem
```

### Step 4: Commit & Push
```powershell
git add .
git commit -m "Initial commit: Appointy medical appointment booking system with AI chatbot"
git push -u origin main
```

## Vercel Deployment

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub account (easier)
3. Authorize Vercel to access your GitHub repos

### Step 2: Deploy Frontend
1. In Vercel dashboard, click "Add New..." → "Project"
2. Select `Appointy` repository
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:**
     - `VITE_BACKEND_URL` = (see Step 4 for backend URL)
4. Click "Deploy"
5. Wait for build to complete
6. Note the deployment URL (e.g., `appointy.vercel.app`)

### Step 3: Deploy Admin Dashboard
1. In Vercel dashboard, click "Add New..." → "Project"
2. Select `Appointy` repository again
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `admin`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:**
     - `VITE_BACKEND_URL` = (see Step 4 for backend URL)
4. Click "Deploy"
5. Note the admin URL

### Step 4: Deploy Backend to Heroku/Railway/Render

**Option A: Railway (Easiest)**
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `Appointy` repo
5. Configure:
   - **Root Directory:** `backend`
   - **Environment Variables:**
     ```
     PORT=4000
     MONGODB_URI=<your_mongodb_atlas_connection_string>
     JWT_SECRET=<generate_secure_key>
     GEMINI_API_KEY=<your_gemini_key>
     ```
6. Deploy and note the URL (e.g., `https://appointy-backend.up.railway.app`)
7. Copy this URL and add to Vercel environment variables as `VITE_BACKEND_URL`

**Option B: Render**
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect GitHub and select `Appointy` repo
5. Configure:
   - **Name:** appointy-backend
   - **Root Directory:** backend
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
6. Add environment variables (same as Railway)
7. Deploy

**Option C: Heroku** (requires credit card)
```powershell
# Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli
heroku login
heroku create appointy-backend
heroku config:set MONGODB_URI=<your_url> --app appointy-backend
heroku config:set GEMINI_API_KEY=<your_key> --app appointy-backend
git push heroku main
```

## Architecture After Deployment

```
Frontend (Vercel)           → appointy.vercel.app
Admin Dashboard (Vercel)    → appointy-admin.vercel.app
Backend API (Railway)       → appointy-backend.up.railway.app
Database (MongoDB Atlas)    → Cloud hosted ✓
```

## Final Steps

### 1. Update Frontend Environment
In Vercel project settings for frontend:
```
VITE_BACKEND_URL = https://appointy-backend.up.railway.app
```

### 2. Update Admin Environment
In Vercel project settings for admin:
```
VITE_BACKEND_URL = https://appointy-backend.up.railway.app
```

### 3. Update Backend CORS
In `backend/server.js`, update CORS to allow Vercel domains:
```javascript
const corsOptions = {
  origin: [
    'https://appointy.vercel.app',
    'https://appointy-admin.vercel.app',
    'http://localhost:5175',
    'http://localhost:5174'
  ],
  credentials: true
};
app.use(cors(corsOptions));
```

### 4. Test Deployed Application
- Visit frontend: https://appointy.vercel.app
- Try booking an appointment
- Admin dashboard: https://appointy-admin.vercel.app
- Verify chatbot works with new backend URL

## Troubleshooting

### Build Fails on Vercel
- Check "Logs" tab in Vercel
- Usually missing environment variables
- Add VITE_BACKEND_URL if not set

### API 404 Errors from Frontend
- Verify VITE_BACKEND_URL is set in Vercel
- Check backend server is running
- Test backend URL directly in browser

### MongoDB Connection Error
- Verify MONGODB_URI is in Railway/backend env vars
- Check MongoDB Atlas connection string format
- Ensure IP whitelist includes backend server IP

### Chatbot Not Responding
- Verify GEMINI_API_KEY is set
- Check API key isn't rate limited
- Review caching system is active

## Commands Reference

```powershell
# After git install, from project root:

# Initialize git
git init
git config user.name "Your Name"
git config user.email "your@email.com"

# Add GitHub remote
git remote add origin https://github.com/USERNAME/Appointy.git
git branch -M main

# Commit and push
git add .
git commit -m "Initial commit: Appointy appointment booking system"
git push -u origin main

# After pushing, update after local changes:
git add .
git commit -m "Description of changes"
git push
```

## Security Checklist

Before deploying:
- [ ] Remove all sensitive data from `.env` files
- [ ] Ensure `.env` is in `.gitignore`
- [ ] Generate new JWT_SECRET for production
- [ ] Verify CORS whitelist is set correctly
- [ ] Confirm API keys are stored only in production env vars
- [ ] Set MongoDB IP whitelist to backend server IP
- [ ] Enable HTTPS on all domains (automatic with Vercel)

## Post-Deployment

1. **Monitor Performance**
   - Check Vercel Analytics tab
   - Review Railway logs for backend errors

2. **Set Up Error Tracking**
   - Optional: Add Sentry for error monitoring

3. **Database Backups**
   - MongoDB Atlas auto-backups every 24 hours

4. **CI/CD Pipeline**
   - Vercel auto-deploys on push to `main`
   - Railway auto-redeploys on git push

---

## Still Need Help?

Contact info:
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- MongoDB Atlas: https://docs.atlas.mongodb.com
