# Pushing to GitHub - Setup Guide

## Current Status
✅ Git repository initialized locally  
✅ 12 commits made  
⏳ Not yet connected to GitHub  

## Option 1: Quick Setup (Recommended for New Repository)

### Step 1: Configure Git (First Time Only)

Set your GitHub username and email:

```bash
cd /Users/kodsatti/Desktop/clean-commute-challenge

# Set your GitHub username
git config user.name "Your GitHub Username"

# Set your GitHub email (must match your GitHub account)
git config user.email "your.email@example.com"

# Verify it worked
git config user.name
git config user.email
```

### Step 2: Create GitHub Repository

**Option A: Via GitHub Website (Easiest)**

1. Go to https://github.com/new
2. Repository name: `clean-commute-challenge`
3. Description: "Web app for tracking sustainable commute data during Clean Commute Challenge"
4. **Keep it Public** (or Private if preferred)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

**Option B: Via GitHub CLI (if installed)**

```bash
gh repo create clean-commute-challenge --public --source=. --remote=origin --push
```

### Step 3: Connect Local Repo to GitHub

After creating the repo on GitHub, you'll see instructions. Use these commands:

```bash
cd /Users/kodsatti/Desktop/clean-commute-challenge

# Add GitHub as remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/clean-commute-challenge.git

# Verify remote was added
git remote -v

# Push your code
git push -u origin main
```

**If your default branch is 'master' instead of 'main':**

```bash
# Rename to main (GitHub's standard)
git branch -M main

# Then push
git push -u origin main
```

### Step 4: Authentication

When you run `git push`, you'll be prompted for credentials:

**Option A: Personal Access Token (Recommended)**

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: "Clean Commute Challenge"
4. Expiration: Choose duration
5. Scopes: Check `repo` (full control)
6. Click "Generate token"
7. **COPY THE TOKEN** (you won't see it again!)
8. When prompted for password, paste the token

**Option B: SSH Key (More Secure)**

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Copy the public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub:
# 1. Go to https://github.com/settings/keys
# 2. Click "New SSH key"
# 3. Paste the key
# 4. Save

# Update remote to use SSH
git remote set-url origin git@github.com:USERNAME/clean-commute-challenge.git

# Push
git push -u origin main
```

---

## Option 2: If You Already Have a GitHub Account

### Quick Check

Do you know your GitHub username? Try:

```bash
# Check if GitHub CLI is configured
gh auth status

# Or check for existing SSH keys
ls -la ~/.ssh/
```

### If You Have SSH Keys

```bash
cd /Users/kodsatti/Desktop/clean-commute-challenge

# Create repo on GitHub, then:
git remote add origin git@github.com:YOUR-USERNAME/clean-commute-challenge.git
git push -u origin main
```

### If You Use HTTPS

```bash
cd /Users/kodsatti/Desktop/clean-commute-challenge

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/clean-commute-challenge.git
git push -u origin main
```

---

## Troubleshooting

### "fatal: could not read Username"

You need to authenticate first. Use a Personal Access Token (see Step 4 above).

### "Permission denied (publickey)"

Your SSH key isn't set up. Either:
- Use HTTPS method with token
- OR set up SSH key (see Option B in Step 4)

### "remote origin already exists"

```bash
# Remove existing remote
git remote remove origin

# Add correct one
git remote add origin https://github.com/YOUR-USERNAME/clean-commute-challenge.git
```

### "Updates were rejected"

```bash
# Force push (only if you're sure)
git push -u origin main --force

# Or pull first
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## What Gets Pushed

Your repository includes:
- ✅ All application code (18 TypeScript files)
- ✅ All components and API routes
- ✅ Documentation (5 guides)
- ✅ Configuration files
- ✅ Package.json with all dependencies
- ✅ 12 clean commits with good messages

**NOT included** (in .gitignore):
- ❌ node_modules/ (468 packages - too large)
- ❌ .next/ (build artifacts)
- ❌ .env.local (secrets)

---

## After Pushing to GitHub

### Verify Upload

1. Visit https://github.com/YOUR-USERNAME/clean-commute-challenge
2. You should see all your files
3. Check the commit history (should show 12 commits)
4. README.md should display on the main page

### Next: Deploy to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Import Project"
4. Select `clean-commute-challenge`
5. Click "Deploy"
6. Follow DEPLOYMENT.md for remaining steps

---

## Quick Command Reference

```bash
# Check current status
git status
git log --oneline

# View remotes
git remote -v

# Make new changes
git add .
git commit -m "your message"
git push

# Create new branch
git checkout -b feature-name
git push -u origin feature-name
```

---

## Need Help?

**Can't remember GitHub username?**
- Go to https://github.com/settings/profile
- Or check previous repos at https://github.com/USERNAME?tab=repositories

**Don't have a GitHub account?**
1. Sign up at https://github.com/join
2. Verify your email
3. Come back to this guide

**Want me to help?**
Just tell me:
1. Your GitHub username
2. Whether you prefer HTTPS or SSH
3. Any error messages you see

---

**Once pushed, share the repo URL with Ecologique volunteers!**

Format: `https://github.com/YOUR-USERNAME/clean-commute-challenge`
