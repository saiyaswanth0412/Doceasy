# 🚀 Quick Start: Deploy Doceasy to GitHub + Vercel

This guide gets you from local to production in 5 steps.

## Step-by-Step Deployment

### STEP 1: Install Git (if not already installed)

**Windows:**
1. Download from: https://git-scm.com/download/win
2. Run installer
3. Choose "Use Git from the Windows Command Prompt"
4. Complete installation

**Verify installation:**
```powershell
git --version
```

---

### STEP 2: Create GitHub Repository

1. Go to https://github.com
2. Log in or sign up
3. Click **New** button (top left)
4. Fill in:
   - Repository name: `Doceasy`
   - Description: `AI-powered medical appointment booking system`
   - Select **Public** (required for free Vercel deployment)
   - Do NOT check "Initialize with README"
5. Click **Create repository**

📝 **Save these URLs:**
- Repository URL: `https://github.com/YOUR_USERNAME/Doceasy.git`
- Your GitHub username: `YOUR_USERNAME`

---

### STEP 3: Push Code to GitHub

**In PowerShell, from project root:**

```powershell
# Navigate to project
cd "c:\Users\yaswa\Downloads\Appointy-master\Appointy-master"

# Check git is ready
git status

# Initialize git
git init
git config user.name "Your Full Name"
git config user.email "your-email@gmail.com"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/Doceasy.git
git branch -M main

# Add all files
git add .

# Commit
git commit -m "Initial commit: Doceasy - AI medical appointment booking system"

# Push to GitHub (will ask for password)
git push -u origin main
```

✅ **Success:** Code is now on GitHub!

---

### STEP 4: Create Backend Deployment (Railway)

Railway is the easiest for backend deployment.

**1. Create Railway Account**
- Go to https://railway.app
- Click "Start Project"
- Sign up with GitHub (authorize Railway access)

**2. Create New Project**
- Click "New Project"
- Select "Deploy from GitHub repo"
- Find and select `Appointy` repository

**3. Configure Backend**
- In "Root Directory": set to `backend`
- In "System" tab, environment variables:
  - Click "New Variable" and add these:
  - `MONGODB_URI` = your MongoDB Atlas connection string
  - `JWT_SECRET` = generate random string (e.g., `abc123def456ghi789jkl`)
  - `GEMINI_API_KEY` = your Google Gemini API key
  - `CLOUDINARY_NAME` = your Cloudinary account name
  - `CLOUDINARY_API_KEY` = your Cloudinary API key
  - `CLOUDINARY_SECRET_KEY` = your Cloudinary secret

**4. Deploy**
- Railway auto-detects Node.js app
- Deployment starts automatically
- Wait for "Deployment Live" message

**5. Get Backend URL**
- In Railway dashboard, find "URL"
- Copy the URL (e.g., `https://appointy-backend.up.railway.app`)
- ⚠️ Save this - you'll need it for Vercel

---

### STEP 5: Deploy Frontend & Admin to Vercel

**1. Create Vercel Account**
- Go to https://vercel.com
- Sign up with GitHub (easier)
- Authorize access to your repositories

**2. Deploy Frontend**
- In Vercel dashboard: "Add New..." → "Project"
- Select `Doceasy` repository from GitHub
- Settings:
  - **Framework Preset:** Vite
  - **Root Directory:** `frontend`
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`
- Environment Variables:
  - `VITE_BACKEND_URL` = `https://appointy-backend.up.railway.app` (from Step 4)
- Click **Deploy**
- Wait for build to complete (usually 2-3 minutes)

**3. Deploy Admin Dashboard**
- In Vercel: "Add New..." → "Project" again
- Select `Appointy` repository again
- Settings:
  - **Framework Preset:** Vite
  - **Root Directory:** `admin`
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`
- Environment Variables:
  - `VITE_BACKEND_URL` = `https://doceasy-backend.up.railway.app` (same as frontend)
- Click **Deploy**

---

## 🎉 You're Live!

After deployments complete, you'll have:

| Component | URL |
|-----------|-----|
| **Patient Portal** | `https://doceasy.vercel.app` |
| **Admin Dashboard** | `https://doceasy-admin.vercel.app` |
| **Backend API** | `https://doceasy-backend.up.railway.app` |

---

## ✅ Post-Deployment Verification

### Test Frontend
1. Visit `https://doceasy.vercel.app`
2. Try sending a message to chatbot: "I need a dermatologist"
3. Verify response appears (may use fallback if API quota reached)

### Test Admin
1. Visit `https://doceasy-admin.vercel.app`
2. Log in with: `admin@appointy.com` / `admin123`
3. Verify dashboard loads

### Test API
1. Visit `https://doceasy-backend.up.railway.app` in browser
2. Should see: `API Working`

---

## 🆘 Troubleshooting

### "Git is not recognized"
- Git not installed properly
- Restart PowerShell after installing Git
- Or download GitHub Desktop: https://desktop.github.com

### "Repository not found" on git push
- Check GitHub repository URL is correct
- Make sure you created the repo on GitHub first
- Verify you're logged in: `git config user.email`

### Frontend shows 404 errors
- Verify `VITE_BACKEND_URL` is set in Vercel
- Should be: `https://appointy-backend.up.railway.app` (no trailing slash)
- Check backend logs for CORS errors

### Chatbot shows "Service Unavailable"
- Backend might be sleeping (Railway free tier hibernates)
- Click on frontend link to wake backend up
- Try sending another message

### "Cannot connect to Mong oDB"
- Check `MONGODB_URI` is correct in Railway
- Verify database connection string format
- Check MongoDB Atlas IP whitelist includes Railway's IP

### Vercel build fails
- Click "Logs" in Vercel to see error
- Usually missing environment variable
- Add all required vars to Vercel project settings

---

## 📱 Environment Variables Quick Reference

### Backend (Railway)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/doceasy
JWT_SECRET=your-secret-key-here
GEMINI_API_KEY=your-api-key-here
CLOUDINARY_NAME=your-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_SECRET_KEY=your-secret
```

### Frontend & Admin (Vercel)
```
VITE_BACKEND_URL=https://doceasy-backend.up.railway.app
```

---

## 🔐 Security Best Practices

- ✅ Never commit `.env` files (they're in `.gitignore`)
- ✅ Keep API keys secret - only add to deployment configs
- ✅ Use strong JWT_SECRET (random string, min 32 chars)
- ✅ MongoDB uses strong password
- ✅ All production URLs should use HTTPS (automatic on Vercel/Railway)

---

## ⚡ Performance Tips

- Frontend builds take 2-3 minutes on Vercel
- Backend starts in 30 seconds on Railway
- First API call may be slow (cold start) - wait 5 seconds
- Chatbot caches responses - subsequent calls are instant
- Fallback system ensures chatbot always works

---

## 📞 Getting Help

- **Vercel Issues:** https://vercel.com/support
- **Railway Issues:** https://docs.railway.app
- **GitHub Issues:** In repository Issues tab
- **MongoDB Issues:** https://docs.atlas.mongodb.com
- **Gemini API:** https://ai.google.dev/docs

---

## 🎓 What's Next?

- ✅ Code is deployed
- ✅ Database is live
- ✅ AI chatbot is running
- ✅ Users can book appointments

**Optional improvements:**
- Add custom domain
- Set up analytics
- Add error monitoring (Sentry)
- Enable auto-scaling
- Set up backup strategies

---

## 📋 Deployment Checklist

- [ ] Git installed
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Backend deployed to Railway
- [ ] Backend URL copied
- [ ] Vercel account created
- [ ] Frontend deployed to Vercel
- [ ] Admin deployed to Vercel
- [ ] All environment variables set
- [ ] Frontend loads without errors
- [ ] Admin loads without errors
- [ ] Chatbot responds to messages
- [ ] Fallback system working

---

**🚀 Congratulations! Appointy is now live on the internet!**

Share your deployment URLs with friends and colleagues. Users can now access the app anytime, anywhere.

---

*Total deployment time: 30-45 minutes*  
*Difficulty level: Beginner-friendly*  
*Cost: Free tier available on all platforms*
