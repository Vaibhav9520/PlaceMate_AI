# Troubleshooting Guide - CV-Based Interview & All Interviews

## Issues Fixed

### 1. ✅ Wrong Route for CV-Based Interview
**Problem:** Dashboard was linking to `/interview/personalized` but the route is `/personalized-interview`

**Fixed:** Updated Dashboard.jsx to use correct route `/personalized-interview`

### 2. ✅ View All Interviews Not Working
**Problem:** "View All Interviews" was linking to `/dashboard` (same page)

**Fixed:** Changed to anchor link `#recent-interviews` that scrolls to the Recent Interviews section on the same page

## How to Test

### Test CV-Based Interview:

1. **Make sure you're logged in**
2. **Go to Dashboard** (http://localhost:5173/dashboard)
3. **Click "CV-Based Interview"** (second card in Quick Actions)
4. **Expected behavior:**
   - If NO CV uploaded: Shows warning screen → Redirects to CV upload page
   - If CV uploaded: Shows interview configuration form with:
     - Interview Type dropdown (Mixed/Technical/HR)
     - Job Role selection
     - Difficulty Level
     - Number of Questions
     - Your skills from CV displayed

### Test View All Interviews:

1. **Go to Dashboard**
2. **Click "View All Interviews"** (third card in Quick Actions)
3. **Expected behavior:**
   - Page scrolls down to "Recent Interviews" section
   - Shows your interview history
   - If no interviews: Shows "No interviews yet" message

## Common Issues & Solutions

### Issue 1: CV-Based Interview Shows Blank Page
**Cause:** Browser cache or React not reloading

**Solution:**
```bash
# Clear browser cache
Ctrl + Shift + Delete (Chrome/Edge)
Cmd + Shift + Delete (Mac)

# Or hard refresh
Ctrl + F5 (Windows)
Cmd + Shift + R (Mac)
```

### Issue 2: "CV Required" Message Even After Uploading CV
**Cause:** User object not updated in context

**Solution:**
1. Log out and log back in
2. Or refresh the page (F5)
3. Check if CV upload was successful (check server logs)

### Issue 3: Interview Configuration Form Not Submitting
**Cause:** Missing required fields or API error

**Solution:**
1. Check browser console for errors (F12 → Console tab)
2. Make sure you selected a Job Role
3. Check server is running on port 5000
4. Check server logs for errors

### Issue 4: Skills Not Showing from CV
**Cause:** CV analysis failed or no skills extracted

**Solution:**
1. Re-upload your CV
2. Check server logs for CV analysis messages:
   - Look for: `🔍 analyzeCV called - NEW VERSION`
   - Look for: `✅ Text extraction complete, skills found: X`
3. If skills still not showing, default skills will be used

## Verification Checklist

Run through this checklist to verify everything works:

- [ ] Dashboard loads without errors
- [ ] Quick Practice button works (goes to /interview)
- [ ] CV-Based Interview button works (goes to /personalized-interview)
- [ ] View All Interviews scrolls to Recent Interviews section
- [ ] CV-Based Interview checks for CV upload
- [ ] If no CV: Shows warning and redirects to upload page
- [ ] If CV uploaded: Shows configuration form
- [ ] Interview Type dropdown has 3 options
- [ ] Skills from CV are displayed
- [ ] Form submits and creates interview
- [ ] Redirects to interview session page

## API Endpoints Being Used

### Frontend Calls:
```javascript
// Get user profile (includes CV status and skills)
GET /api/users/profile

// Create personalized interview
POST /api/interviews/personalized
Body: {
  role: "Software Engineer",
  level: "intermediate",
  interviewType: "mixed",
  questionCount: 10
}

// Get user interviews
GET /api/interviews/user/:userId?limit=5
```

### Backend Routes:
```javascript
// All routes are in server/routes/interviewRoutes.js
POST /api/interviews/personalized → createPersonalizedInterview()
GET /api/interviews/:id → getInterview()
GET /api/interviews/user/:userId → getUserInterviews()
```

## Debug Mode

To see detailed logs, open browser console (F12) and check for:

### Frontend Logs:
- Navigation events
- API calls
- Toast notifications
- Form submissions

### Backend Logs:
Look for these in the server terminal:
```
🔍 analyzeCV called - NEW VERSION with null-safety
📄 CV text extracted, length: 1234
✅ Text extraction complete, skills found: 5
📥 CV analysis result: Valid object
```

## Still Not Working?

If issues persist after trying all solutions:

1. **Clear all browser data:**
   - Cookies
   - Local Storage
   - Session Storage
   - Cache

2. **Restart both servers:**
   ```bash
   # Stop both servers (Ctrl+C)
   
   # Kill all Node processes
   taskkill /F /IM node.exe
   
   # Start backend
   cd server
   npm run dev
   
   # Start frontend (new terminal)
   cd client
   npm run dev
   ```

3. **Check for console errors:**
   - Open browser DevTools (F12)
   - Check Console tab for red errors
   - Check Network tab for failed API calls

4. **Verify environment variables:**
   ```bash
   # client/.env
   VITE_API_URL=http://localhost:5000/api
   
   # server/.env
   PORT=5000
   ```

## Contact Information

If you're still experiencing issues, provide:
1. Screenshot of browser console errors
2. Server terminal logs
3. Steps to reproduce the issue
4. Browser and version you're using
