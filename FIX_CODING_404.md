# Fix Coding Practice 404 Error

## The Problem

You're getting this error:
```
POST http://localhost:5000/api/coding/generate-questions 404 (Not Found)
```

## Root Causes

1. **Missing axios dependency** - The server needs axios to make API calls
2. **Server not restarted** - New routes need server restart to load

## Quick Fix (Run This)

```bash
setup-coding-practice.bat
```

This will:
1. Stop the server
2. Install axios dependency
3. Restart the server
4. Test the endpoints
5. Show you if it's working

## Manual Fix

### Step 1: Install Axios
```bash
cd server
npm install axios
```

### Step 2: Restart Server
```bash
# Kill all Node processes
taskkill /F /IM node.exe

# Wait 5 seconds

# Start server
cd server
npm run dev
```

### Step 3: Verify
```bash
node test-coding-endpoint.js
```

Expected output:
```
✅ Server is running
✅ Coding endpoint exists (returns 401 Unauthorized)
```

## What Was Missing

The `codingService.js` file uses axios to call the Judge0 API:
```javascript
import axios from 'axios';
```

But axios wasn't installed in the server's `package.json`.

## After Fix

Once axios is installed and server is restarted:

1. **Open browser:** http://localhost:5173
2. **Login** to your account
3. **Go to Dashboard**
4. **Click "DSA Coding Practice"**
5. **Select a topic** (e.g., "Arrays")
6. **Choose question count** (e.g., 3)
7. **Click "Generate Questions"**
8. **Questions will be generated!** 🎉

## Verification Steps

### 1. Check axios is installed
```bash
cd server
npm list axios
```

Should show:
```
└── axios@1.6.0
```

### 2. Check server logs
Look for:
```
Server running in development mode on port 5000
```

### 3. Test endpoint
```bash
node test-coding-endpoint.js
```

Should show:
```
✅ Coding endpoint exists (returns 401 Unauthorized)
```

### 4. Test in browser
- Login
- Click "DSA Coding Practice"
- Select topic
- Generate questions
- Should work! ✓

## Troubleshooting

### Still Getting 404?

1. **Check server is actually running:**
   - Look at server window
   - Should show "Server running on port 5000"

2. **Check axios is installed:**
   ```bash
   cd server
   npm list axios
   ```

3. **Check routes are loaded:**
   - Look at server logs on startup
   - Should not show any import errors

4. **Restart again:**
   ```bash
   setup-coding-practice.bat
   ```

### Axios Install Fails?

If `npm install axios` fails:

1. **Check internet connection**
2. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```
3. **Try again:**
   ```bash
   npm install axios
   ```

### Server Won't Start?

1. **Check for syntax errors:**
   - Look at server logs
   - Check for red error messages

2. **Check all files exist:**
   - `server/routes/codingRoutes.js`
   - `server/controllers/codingController.js`
   - `server/services/codingService.js`

3. **Check imports:**
   - All files should have `.js` extension in imports
   - Check for typos

## Files Updated

- `server/package.json` - Added axios dependency
- `server/routes/codingRoutes.js` - Coding routes
- `server/controllers/codingController.js` - Controllers
- `server/services/codingService.js` - AI & execution logic
- `server/server.js` - Registered coding routes

## Summary

**Problem:** 404 error when generating questions
**Cause:** Missing axios dependency + server not restarted
**Solution:** Install axios and restart server
**Command:** `setup-coding-practice.bat`
**Result:** Coding practice works perfectly! 🎉

---

## Ready to Fix?

Run this now:
```bash
setup-coding-practice.bat
```

Then test in your browser!
