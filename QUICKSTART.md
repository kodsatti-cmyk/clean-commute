# Quick Start Guide

**Get the app running in 15 minutes!**

## For Non-Technical Volunteers

Don't worry if you're not a developer! This guide will walk you through everything step-by-step.

### What You Need

1. A computer (Mac, Windows, or Linux)
2. Internet connection
3. A Vercel account (we'll create this - it's free!)

### Step 1: Get the Code (2 minutes)

**Option A: If you have the code already**
- Unzip the folder
- Open Terminal (Mac/Linux) or Command Prompt (Windows)
- Navigate to the folder:
  ```bash
  cd path/to/clean-commute-challenge
  ```

**Option B: If you're cloning from GitHub**
```bash
git clone <repository-url>
cd clean-commute-challenge
```

### Step 2: Install Node.js (if needed)

Check if you have Node.js:
```bash
node --version
```

If you see a version number (like `v20.x.x`), you're good! 

If not:
1. Go to [nodejs.org](https://nodejs.org)
2. Download the LTS version (recommended)
3. Install it (just click Next/Install through the wizard)
4. Restart your terminal and try `node --version` again

### Step 3: Install Dependencies

```bash
npm install
```

This will take 2-3 minutes. Grab a coffee! ☕

**If you see permission errors**, try:
```bash
npm install --legacy-peer-deps
```

### Step 4: Test Locally (Optional)

Want to see it before deploying?

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Press `Ctrl+C` to stop the server when done.

### Step 5: Deploy to Vercel (10 minutes)

Now let's put it on the internet!

1. **Create a GitHub account** (if you don't have one)
   - Go to [github.com](https://github.com)
   - Click "Sign up"

2. **Upload your code to GitHub**
   ```bash
   # Initialize git (if not already done)
   git init
   git add .
   git commit -m "Initial commit"
   
   # Create a new repository on GitHub, then:
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

3. **Create a Vercel account**
   - Go to [vercel.com](https://vercel.com)
   - Click "Sign up"
   - Sign in with your GitHub account

4. **Deploy**
   - Click "Add New Project"
   - Select your `clean-commute-challenge` repository
   - Click "Deploy"
   - Wait 2-3 minutes ⏳
   - You'll get a URL like `https://clean-commute-challenge.vercel.app`

5. **Add Database**
   - Click "Storage" tab in your project
   - Click "Create Database"
   - Select "Postgres"
   - Name it `clean-commute-db`
   - Click "Create"

6. **Initialize Database**
   Open a new terminal and run:
   ```bash
   curl -X POST https://YOUR-APP.vercel.app/api/setup
   ```
   (Replace YOUR-APP with your actual URL)

7. **Set Production URL**
   - In Vercel: Settings → Environment Variables
   - Add: `NEXT_PUBLIC_BASE_URL` = `https://YOUR-APP.vercel.app`
   - Click "Save"
   - Deployments → Redeploy latest

8. **Generate QR Codes**
   - Visit `https://YOUR-APP.vercel.app/admin/qr`
   - Download each QR code
   - Print them
   - Post at office locations

## You're Done! 🎉

Test it:
1. Visit your Vercel URL
2. Click "Log Your Commute"
3. Fill out the form
4. Check the dashboard

## Need Help?

**Common Issues:**

**"Command not found: node"**
→ Install Node.js from [nodejs.org](https://nodejs.org)

**"npm install" fails**
→ Try: `npm install --legacy-peer-deps`

**Database connection error**
→ Wait 5 minutes after creating database, then try again

**QR codes don't work**
→ Make sure `NEXT_PUBLIC_BASE_URL` is set, then regenerate QR codes

**Still stuck?**
→ Open an issue on GitHub or ask in the volunteer Slack channel

## Next Steps

- Share the app URL with your team
- Post QR codes at each office
- Check the dashboard daily to see progress
- Celebrate sustainable commutes! 🚲🌱

---

**Remember**: You're doing great! Every question is valid, and we're here to help.
