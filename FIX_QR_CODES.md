# Fix QR Codes - Point to Production URL

The QR codes are currently pointing to `localhost:3000`. Let's fix them to point to your live app!

---

## Quick Fix (2 minutes)

### Step 1: Add Environment Variable in Vercel

1. **Go to**: https://vercel.com/kodandareddy/clean-commute

2. **Click**: "Settings" tab (top navigation)

3. **Click**: "Environment Variables" (left sidebar)

4. **Click**: "Add New" button

5. **Fill in**:
   - **Key**: `NEXT_PUBLIC_BASE_URL`
   - **Value**: `https://clean-commute.vercel.app`
   - **Environment**: Check all three boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development

6. **Click**: "Save"

### Step 2: Redeploy

1. **Click**: "Deployments" tab

2. **Find**: Latest deployment (top of list)

3. **Click**: "..." (three dots)

4. **Select**: "Redeploy"

5. **Confirm**: Click "Redeploy" again

6. **Wait**: ~1-2 minutes

### Step 3: Regenerate QR Codes

After redeployment completes:

1. **Visit**: https://clean-commute.vercel.app/admin/qr

2. **Check**: The URLs under each QR code should now show:
   - `https://clean-commute.vercel.app/log?location=bangalore-office`
   - NOT `http://localhost:3000/...`

3. **Download**: All 5 QR codes again (they're now correct!)

---

## Visual Guide

### What You're Adding:

```
Environment Variable:
┌────────────────────────────────────────┐
│ Key:   NEXT_PUBLIC_BASE_URL            │
│ Value: https://clean-commute.vercel.app│
│ Env:   [x] Production                  │
│        [x] Preview                     │
│        [x] Development                 │
└────────────────────────────────────────┘
```

### Before Fix:
```
QR Code URL: http://localhost:3000/log?location=bangalore-office
```

### After Fix:
```
QR Code URL: https://clean-commute.vercel.app/log?location=bangalore-office
```

---

## Why This Happens

The app uses `process.env.NEXT_PUBLIC_BASE_URL` to build QR code URLs.

- **Locally**: Defaults to `http://localhost:3000`
- **Production**: Needs to be set to your Vercel URL

We set this environment variable, and Next.js will use it to generate the correct URLs!

---

## Alternative: Manual Check

If you want to verify the environment variable was added:

1. Go to **Settings** → **Environment Variables**
2. You should see:
   - `NEXT_PUBLIC_BASE_URL` = `https://clean-commute.vercel.app`
   - Plus all the database variables (POSTGRES_URL, etc.)

---

## After the Fix

### Test the QR Code:

1. Download one QR code (e.g., Bangalore Office)
2. Scan it with your phone
3. It should open: `https://clean-commute.vercel.app/log?location=bangalore-office`
4. Form should have "Bangalore Office" pre-selected
5. ✅ Perfect!

---

## Summary

**Problem**: QR codes point to localhost  
**Solution**: Add `NEXT_PUBLIC_BASE_URL` environment variable  
**Time**: 2 minutes  
**Then**: Regenerate QR codes  

---

**Do this now**:
1. Settings → Environment Variables
2. Add `NEXT_PUBLIC_BASE_URL` = `https://clean-commute.vercel.app`
3. Redeploy
4. Download fresh QR codes
5. Done! ✅
