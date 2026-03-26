# Git Upload Instructions for Doceasy

## Step 1: Restart PowerShell
Close PowerShell completely and open a new one. This ensures Git is recognized in the PATH.

## Step 2: Run These Commands in Order

### First, navigate to project:
```powershell
cd "c:\Users\yaswa\Downloads\Appointy-master\Appointy-master"
```

### Initialize git:
```powershell
git init
git config user.name "Your Name"
git config user.email "your-email@gmail.com"
```

### Check git is working:
```powershell
git status
```

### Add GitHub remote (replace YOUR_USERNAME):
```powershell
git remote add origin https://github.com/YOUR_USERNAME/Doceasy.git
```

### Add all files:
```powershell
git add .
```

### Commit:
```powershell
git commit -m "Initial commit: Doceasy - AI medical appointment booking system"
```

### Push to GitHub:
```powershell
git push -u origin main
```

## Important Notes:
- Replace `YOUR_USERNAME` with your actual GitHub username
- When pushing, you'll be asked for your GitHub password (use Personal Access Token if 2FA is enabled)
- Make sure you've created the repository on GitHub first at: https://github.com/new

## If You Get an Error:
- Check git is installed: `git --version`
- Restart PowerShell and try again
- Verify you created the repository on GitHub
- Make sure repository is PUBLIC (not private)

Done! Your code will be on GitHub.
