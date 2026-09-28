# Deployment Guide

Quick reference for deploying the Clean Commute Challenge app to Vercel.

## Prerequisites

- [ ] GitHub repository with your code
- [ ] Vercel account (free tier works)
- [ ] 10 minutes of time

## Step-by-Step Deployment

### 1. Deploy to Vercel (5 minutes)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Select your `clean-commute-challenge` repository
4. Vercel auto-detects Next.js settings - **don't change anything**
5. Click "Deploy"
6. Wait 2-3 minutes for deployment to complete
7. Note your deployment URL (e.g., `https://clean-commute-challenge.vercel.app`)

### 2. Add Database (2 minutes)

1. In your Vercel project, click "Storage" tab
2. Click "Create Database"
3. Select "Postgres"
4. Name it `clean-commute-db`
5. Click "Create" 
6. Vercel automatically connects it to your project ✅

### 3. Initialize Database (1 minute)

Run this command from your terminal:

```bash
curl -X POST https://YOUR-APP.vercel.app/api/setup
```

Replace `YOUR-APP` with your actual Vercel URL.

You should see: `{"message":"Database initialized successfully"}`

### 4. Set Production URL (2 minutes)

1. In Vercel project → Settings → Environment Variables
2. Add new variable:
   - **Name**: `NEXT_PUBLIC_BASE_URL`
   - **Value**: `https://YOUR-APP.vercel.app` (your full Vercel URL)
3. Click "Save"
4. Go to Deployments tab → Click "..." on latest deployment → "Redeploy"

### 5. Generate QR Codes (5 minutes)

1. Visit `https://YOUR-APP.vercel.app/admin/qr`
2. Click "Download PNG" for each office location
3. Print them (A4 or Letter size works best)
4. Post QR codes at each office location
5. Done! 🎉

## Testing Your Deployment

### Quick Smoke Test

1. **Home page**: Visit your Vercel URL - should see welcome screen ✅
2. **Log form**: Click "Log Your Commute" - form should load ✅
3. **Submit entry**: Fill out form and submit - should see success message ✅
4. **Dashboard**: Click "View Dashboard" - should see your entry ✅
5. **QR code**: Scan a generated QR code with your phone - should open log form ✅

### Database Connection Test

```bash
# Should return statistics (even if zeros)
curl https://YOUR-APP.vercel.app/api/stats
```

Expected response:
```json
{
  "totals": {"entries": 0, "kilometers": 0},
  "byMode": [],
  "byLocation": [],
  "daily": []
}
```

## Common Issues

### ❌ "Database connection failed"

**Solution**: Make sure you:
1. Created Vercel Postgres database
2. Ran the `/api/setup` endpoint
3. Waited a few minutes for database to be ready

### ❌ QR codes don't scan to the right URL

**Solution**: 
1. Check that `NEXT_PUBLIC_BASE_URL` is set correctly
2. Regenerate QR codes after updating the environment variable
3. Clear browser cache and reload `/admin/qr` page

### ❌ "Build failed"

**Solution**: 
1. Check Build Logs in Vercel dashboard
2. Most common: missing dependencies in `package.json`
3. Try `npm run build` locally first to catch errors

## Environment Variables Reference

| Variable | Value | Required? |
|----------|-------|-----------|
| `POSTGRES_URL` | Auto-set by Vercel | ✅ Yes |
| `POSTGRES_URL_NON_POOLING` | Auto-set by Vercel | ✅ Yes |
| `NEXT_PUBLIC_BASE_URL` | Your Vercel URL | ✅ Yes |

## Custom Domain (Optional)

To use your own domain:

1. In Vercel project → Settings → Domains
2. Add your domain (e.g., `commute.ecologique.in`)
3. Follow Vercel's DNS instructions
4. Update `NEXT_PUBLIC_BASE_URL` to your custom domain
5. Regenerate QR codes with new URL

## Updating the App

To deploy changes:

```bash
# Make changes locally
git add .
git commit -m "description of changes"
git push

# Vercel auto-deploys from your main branch
# Wait 2-3 minutes, changes are live
```

## Rollback

If something breaks:

1. Go to Vercel → Deployments tab
2. Find a previous working deployment
3. Click "..." → "Promote to Production"
4. Previous version restored instantly

## Production Checklist

Before announcing to employees:

- [ ] Deployment successful (green check in Vercel)
- [ ] Database initialized (`/api/setup` returns success)
- [ ] `NEXT_PUBLIC_BASE_URL` set correctly
- [ ] QR codes generated and tested on mobile
- [ ] Test submission works end-to-end
- [ ] Dashboard shows test data correctly
- [ ] CSV export downloads successfully
- [ ] QR codes posted at all office locations

## Support

If stuck:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Open an issue on GitHub
4. Contact the volunteer team

---

**Total deployment time: ~15 minutes**

Good luck with your October Clean Commute Challenge! 🚲🌱
