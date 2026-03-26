# Pre-Deployment Checklist for Appointy

Complete this checklist before deploying to production (GitHub + Vercel).

## ✅ Code Quality & Testing

### Backend
- [ ] All environment variables set in `.env`
  - [ ] `MONGODB_URI` set and tested
  - [ ] `JWT_SECRET` is secure (generated, not hardcoded)
  - [ ] `GEMINI_API_KEY` is valid and working
  - [ ] `CLOUDINARY_*` keys are configured
- [ ] No hardcoded secrets in code
- [ ] All API endpoints tested with Postman/Thunder Client
- [ ] Error handling working (chatbot fallback system active)
- [ ] CORS configuration updated for Vercel domains
- [ ] Server starts without errors: `node server.js`

### Frontend
- [ ] `VITE_BACKEND_URL` environment variable set
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in browser dev tools
- [ ] All pages load correctly
- [ ] Chatbot component renders and functions
- [ ] No broken images or missing assets
- [ ] Mobile responsive design verified

### Admin Dashboard
- [ ] Connects to backend correctly
- [ ] Admin login works
- [ ] Can add/edit/delete doctors
- [ ] Appointment management functional
- [ ] Dashboard analytics load

## 🔐 Security Review

- [ ] `.env` files are in `.gitignore`
- [ ] No API keys/secrets in any `.js` files
- [ ] No sensitive data in constants
- [ ] Password hashing verified (JWT implementation)
- [ ] HTTPS will be enforced in production
- [ ] API endpoints require authentication where needed
- [ ] Input validation in place on backend
- [ ] SQL injection / NoSQL injection protections verified

## 📦 GitHub Preparation

- [ ] `.gitignore` created and complete
- [ ] `README.md` updated with Appointy info (use `GITHUB_README.md` as reference)
- [ ] `DEPLOYMENT_GUIDE.md` is comprehensive
- [ ] `CHATBOT_SOLUTION.md` documents the solution
- [ ] No large files (>50MB) in repo
- [ ] No dependencies in node_modules tracked
- [ ] All necessary documentation is present
- [ ] Project root has meaningful `.gitignore`

### Optional: GitHub Specific
- [ ] Create `.github/workflows/` for CI/CD (optional)
- [ ] Add GitHub Issue templates (optional)
- [ ] Add pull request template (optional)
- [ ] Create LICENSE file (optional, MIT recommended)

## 🌍 Environment Variables - Production

### Frontend (Vercel)
```env
VITE_BACKEND_URL=https://appointy-backend.up.railway.app
```

### Admin (Vercel)
```env
VITE_BACKEND_URL=https://appointy-backend.up.railway.app
```

### Backend (Railway/Render)
```env
PORT=4000
MONGODB_URI=<production_mongodb_atlas_string>
JWT_SECRET=<generate_new_secure_key>
GEMINI_API_KEY=<your_api_key>
CLOUDINARY_NAME=<your_name>
CLOUDINARY_API_KEY=<your_key>
CLOUDINARY_SECRET_KEY=<your_secret>
NODE_ENV=production
```

## 🧪 Pre-Deployment Testing

### Local Testing (All Servers Running)

#### Backend Tests
```bash
# Test backend is running
curl http://localhost:4000

# Test chatbot endpoint
curl -X POST http://localhost:4000/api/chatbot/send-message \
  -H "Content-Type: application/json" \
  -d '{"message":"find a dermatologist"}'

# Test database connection
curl http://localhost:4000/test-db
```

#### Frontend Tests
- [ ] Visit http://localhost:5175
- [ ] Browse without errors in console
- [ ] Test chatbot: send message "derma"
- [ ] Verify response appears
- [ ] Check Network tab - requests go to `http://localhost:4000`

#### Admin Tests
- [ ] Visit http://localhost:5174
- [ ] Login with admin credentials
- [ ] Add a test doctor
- [ ] View appointments

### Fallback System Test
- [ ] Temporarily disable Gemini API key
- [ ] Send message to chatbot
- [ ] Verify fallback response appears (not an error)
- [ ] Re-enable API key

## 📋 Files to Review/Create

- [ ] `.env` (backend) - Create with test values
- [ ] `frontend/.env.local` - Already has `VITE_BACKEND_URL`
- [ ] `admin/.env.local` - Create with `VITE_BACKEND_URL`
- [ ] `.gitignore` - ✅ Created
- [ ] `DEPLOYMENT_GUIDE.md` - ✅ Created
- [ ] `CHATBOT_SOLUTION.md` - ✅ Created
- [ ] `GITHUB_README.md` - ✅ Created (use as reference for README.md)

## 🚢 Deployment Readiness

### GitHub Upload
- [ ] Initialize git: `git init`
- [ ] Create GitHub repository (public)
- [ ] Add remote: `git remote add origin https://github.com/YOU/Appointy.git`
- [ ] Add all files: `git add .`
- [ ] Commit: `git commit -m "Initial commit: Appointy"`
- [ ] Push: `git push -u origin main`

### Vercel Deployment
- [ ] Vercel account created
- [ ] GitHub connected to Vercel
- [ ] Project 1 - Frontend config:
  - [ ] Root directory: `frontend`
  - [ ] Build: `npm run build`
  - [ ] Output: `dist`
  - [ ] Environment: `VITE_BACKEND_URL=<backend_url>`
- [ ] Project 2 - Admin config:
  - [ ] Root directory: `admin`
  - [ ] Build: `npm run build`
  - [ ] Output: `dist`
  - [ ] Environment: `VITE_BACKEND_URL=<backend_url>`
- [ ] Project 3 - Backend (Railway/Render):
  - [ ] All environment variables set
  - [ ] Deployment successful
  - [ ] API accessible from Vercel

### Database
- [ ] MongoDB Atlas account created
- [ ] Cluster created
- [ ] User created with strong password
- [ ] IP whitelist includes:
  - [ ] Local development IP (0.0.0.0 for testing)
  - [ ] Railway/backend server IP
  - [ ] Render/Heroku server IP (if used)
- [ ] Connection string obtained and stored

### Post-Deployment
- [ ] Frontend loads at vercel URL
- [ ] Admin loads at vercel URL
- [ ] Backend API responds
- [ ] Frontend successfully calls backend
- [ ] Chatbot works end-to-end
- [ ] User can book appointment
- [ ] Appointment appears in admin

## 🔍 Final Verification

- [ ] README has been updated for Appointy
- [ ] All three applications deployed
- [ ] Domain names are working
- [ ] HTTPS is enabled on all services
- [ ] API endpoints are accessible
- [ ] Database queries working
- [ ] User authentication working
- [ ] Chatbot functioning
- [ ] Admin features operational
- [ ] No console errors in production
- [ ] Performance is acceptable
- [ ] Mobile view responsive

## 📞 Troubleshooting During Deployment

### If Frontend 404 Errors:
- [ ] Check `VITE_BACKEND_URL` is set in Vercel env
- [ ] Verify backend URL is correct (no trailing slash)
- [ ] Check backend CORS allows frontend domain

### If Chatbot Fails:
- [ ] Verify `GEMINI_API_KEY` in backend
- [ ] Check fallback system is active in logs
- [ ] Verify database connection working

### If Database Fails:
- [ ] Check `MONGODB_URI` connection string
- [ ] Verify IP whitelist in MongoDB Atlas
- [ ] Test connection locally before deploying

### If Build Fails:
- [ ] Check build logs in Vercel
- [ ] Usually missing env variables
- [ ] Try local build first: `npm run build`

## ✨ Success Indicators

You're ready to deploy when:
- ✅ All local servers running without errors
- ✅ Frontend, Admin, Backend all accessible locally
- ✅ Git repo pushed to GitHub
- ✅ All three Vercel projects deployed
- ✅ Vercel URLs accessible from browser
- ✅ Cross-domain communication working
- ✅ Chatbot responds with real or fallback data
- ✅ No console errors in production
- ✅ All tests from checklist passed

## 🎉 Post-Deployment

- [ ] Monitor Vercel analytics dashboard
- [ ] Check Railway/backend logs for errors
- [ ] Do final end-to-end test:
  - [ ] Create new patient account
  - [ ] Search for doctor
  - [ ] Use chatbot to understand appointment
  - [ ] Book appointment successfully
  - [ ] Verify appointment appears in admin
  - [ ] Doctor can see appointment in dashboard
- [ ] Announce deployment to stakeholders
- [ ] Set up error monitoring (optional: Sentry)
- [ ] Plan for future improvements

## 📊 Deployment Metrics

Track these numbers:
- Response time: Should be <500ms for pages, <200ms for API calls
- API success rate: Should be >95%
- Chatbot response rate: Should be >90%
- Database query time: Should be <100ms
- Build time: Should be <5 minutes

---

**Status:** Ready to Deploy ✅

**Last Updated:** March 25, 2024

**Next Step:** Follow the DEPLOYMENT_GUIDE.md for detailed GitHub and Vercel setup instructions.
