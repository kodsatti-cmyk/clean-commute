# Dashboard Not Showing Data - Debug Guide

## Current Status

**Deployed Version:** 5e83db4 (with debug logging)  
**Production URL:** https://clean-commute.vercel.app/dashboard

## What We Know

###  API is Working ✅
```bash
curl https://clean-commute.vercel.app/api/stats
```
Returns correct data:
```json
{
  "totals": { "entries": 4, "kilometers": 162 },
  "byMode": [...],
  "byLocation": [...],
  "daily": [...]
}
```

### Dashboard Code is Correct ✅
- Uses client-side rendering (`"use client"`)
- Has proper useEffect to fetch data
- Has error handling
- Has loading state

### Issue: Dashboard Stuck on "Loading statistics..."

The dashboard shows the loading spinner but never displays the data, even though the API returns data correctly.

## Diagnosis Steps

### Step 1: Check Browser Console
1. Open https://clean-commute.vercel.app/dashboard
2. Press F12 (or right-click → Inspect)
3. Click the "Console" tab
4. Look for messages starting with `[Dashboard]`

**Expected Console Output (if working):**
```
[Dashboard] Starting to fetch stats...
[Dashboard] Response status: 200
[Dashboard] Data received: {totals: {...}, byMode: [...], ...}
[Dashboard] Stats state updated
[Dashboard] Loading complete
```

**If there's an error, you'll see:**
```
[Dashboard] Error fetching stats: [error message]
```

### Step 2: Check Network Tab
1. Stay in DevTools
2. Click the "Network" tab
3. Refresh the page
4. Look for a request to `/api/stats`
5. Click on it to see:
   - Status code (should be 200)
   - Response body (should have data)
   - Any error messages

## Likely Causes & Fixes

### Cause 1: React Strict Mode Double-Rendering
**Symptom:** In development, useEffect runs twice  
**Fix:** This is normal in development, should work fine in production

### Cause 2: CORS or Network Error
**Symptom:** Fetch fails silently  
**Fix:** Check console for CORS errors

### Cause 3: JSON Parsing Error
**Symptom:** API returns HTML instead of JSON  
**Fix:** Check if /api/stats is actually returning JSON

### Cause 4: State Not Updating
**Symptom:** Data fetched but component doesn't re-render  
**Fix:** Check React DevTools to see component state

## Quick Test

Try accessing the API directly in your browser:
https://clean-commute.vercel.app/api/stats

You should see JSON data. If you see HTML or an error page, that's the problem.

## Next Steps After Diagnosis

Once we know the error from the console, we can:

1. **If it's a fetch error:** Add better error handling or try a different fetch approach
2. **If it's a parsing error:** Fix the API response format
3. **If it's a state update issue:** Force re-render or use a different state management approach
4. **If there's no error but data doesn't show:** Check React component logic

## Debug Commit

I've added extensive console logging to the dashboard:
- Logs when fetch starts
- Logs response status
- Logs the received data
- Logs when state is updated
- Logs any errors

**Commit:** 5e83db4  
**Message:** "debug: add console logging to dashboard to diagnose data loading issue"

## What to Tell Me

Please check the browser console at https://clean-commute.vercel.app/dashboard and tell me:

1. **What console messages do you see?** (especially ones starting with `[Dashboard]`)
2. **Are there any red error messages?**
3. **Does the Network tab show a successful request to /api/stats?**
4. **What is the response from /api/stats?** (click on it in Network tab → Preview)

With this information, I can fix the exact issue.
