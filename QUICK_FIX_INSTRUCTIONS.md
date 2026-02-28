# Quick Fix - Clear Browser Data

## Problem
The browser has an old authentication token that's incompatible with the current database.

## Solution (Choose ONE method)

### Method 1: Use the Clear Data Page (EASIEST)
1. Open `CLEAR_BROWSER_DATA.html` in your browser
2. Click "Clear Browser Data" button
3. Click "Go to PlaceMate AI" or manually go to http://localhost:5174

### Method 2: Manual Browser Clear
1. Open http://localhost:5174 in your browser
2. Press `F12` to open Developer Tools
3. Go to the **Application** tab (or **Storage** in Firefox)
4. Click **Local Storage** in the left sidebar
5. Click on `http://localhost:5174`
6. Right-click in the right panel and select **Clear** or **Delete All**
7. Close Developer Tools
8. Refresh the page (`Ctrl+R` or `F5`)

### Method 3: Incognito/Private Mode
1. Open a new Incognito/Private window
2. Go to http://localhost:5174
3. Sign in with your existing account:
   - Email: `vaibhavsingh01080@gmail.com`
   - Password: (your password)

## Your Existing Account
You already have an account created:
- **Email**: vaibhavsingh01080@gmail.com
- **Name**: Vaibhav Singh
- **College**: LPU
- **Degree**: B.tech
- **Branch**: CSE
- **Year**: 2026

Just log in with your email and password!

## After Clearing Data

1. Go to http://localhost:5174
2. You should see the Landing Page
3. Click "Sign In"
4. Enter your credentials
5. Start using the application!

## If You Want to Create a New Account

1. Go to http://localhost:5174
2. Click "Get Started"
3. Fill in the registration form
4. Click "Create Account"
5. You'll be redirected to the Dashboard

## Verification

After clearing data and logging in, you should see:
- ✅ No console errors
- ✅ Dashboard loads with your name
- ✅ All features accessible
- ✅ Can create interviews
- ✅ Can upload CV

## Still Having Issues?

If you still see errors after clearing browser data:

1. **Stop both servers** (Ctrl+C in both terminals)
2. **Delete the data files**:
   ```
   del server\data\*.json
   ```
3. **Restart the server**:
   ```
   cd server
   npm run dev
   ```
4. **Restart the client** (in another terminal):
   ```
   cd client
   npm run dev
   ```
5. **Clear browser data again** using Method 1 or 2 above
6. **Create a new account**

---

**The server is running correctly!** The only issue is the old token in your browser. Once you clear it, everything will work perfectly! 🎉
