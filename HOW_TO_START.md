# 🚀 How to Start PlaceMate AI

## Quick Start (Easiest Way)

### Windows Users:
1. Double-click `start.bat` file in the project root
2. Two terminal windows will open automatically
3. Wait 10-15 seconds for both servers to start
4. Open your browser and go to: **http://localhost:5173**

### Mac/Linux Users:
1. Open terminal in project root
2. Run: `chmod +x start.sh` (first time only)
3. Run: `./start.sh`
4. Open your browser and go to: **http://localhost:5173**

---

## Manual Start (Step by Step)

### Step 1: Start Backend Server

1. Open a terminal/command prompt
2. Navigate to the server folder:
   ```bash
   cd server
   ```
3. Start the backend:
   ```bash
   npm run dev
   ```
4. You should see:
   ```
   Simple File Database Connected
   Data stored in: [path]/server/data
   Server running in development mode on port 5000
   ```

### Step 2: Start Frontend Client

1. Open a NEW terminal/command prompt (keep the first one running)
2. Navigate to the client folder:
   ```bash
   cd client
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```
4. You should see:
   ```
   VITE v6.4.1  ready in 290 ms
   ➜  Local:   http://localhost:5173/
   ```

### Step 3: Open the Application

1. Open your web browser
2. Go to: **http://localhost:5173**
3. You should see the PlaceMate AI landing page

---

## What You'll See

### Backend Server (Port 5000)
- Running at: http://localhost:5000
- API Health Check: http://localhost:5000/api/health
- Console shows: "Server running in development mode on port 5000"

### Frontend Client (Port 5173)
- Running at: http://localhost:5173
- Console shows: "Local: http://localhost:5173/"
- Opens the React application

---

## Troubleshooting

### Problem: "Port already in use"

**Solution:**
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux - Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Problem: "Cannot find module"

**Solution:**
```bash
# Reinstall dependencies
cd server
npm install

cd ../client
npm install
```

### Problem: Backend not connecting

**Solution:**
1. Make sure you're in the `server` folder
2. Check if `.env` file exists in server folder
3. Restart the backend server

### Problem: Frontend shows blank page

**Solution:**
1. Check browser console (F12) for errors
2. Make sure backend is running first
3. Clear browser cache (Ctrl+Shift+Delete)
4. Refresh the page (Ctrl+R)

---

## Stopping the Servers

### If using start.bat or start.sh:
- Press `Ctrl+C` in both terminal windows
- Or simply close the terminal windows

### If started manually:
- Go to each terminal
- Press `Ctrl+C`
- Wait for the server to stop

---

## Checking if Servers are Running

### Check Backend:
```bash
# Open in browser or use curl
http://localhost:5000/api/health

# Should return:
{"success":true,"message":"PlaceMate AI Server is running","timestamp":"..."}
```

### Check Frontend:
```bash
# Open in browser
http://localhost:5173

# Should show the PlaceMate AI landing page
```

---

## First Time Setup

If this is your first time running the project:

1. **Install Dependencies** (one time only):
   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd ../client
   npm install
   ```

2. **Start Servers** (follow steps above)

3. **Create Account**:
   - Go to http://localhost:5173
   - Click "Sign Up"
   - Fill in your details
   - Start using the app!

---

## Development Workflow

### Daily Usage:
1. Start both servers (backend + frontend)
2. Open http://localhost:5173 in browser
3. Make changes to code (auto-reloads)
4. Stop servers when done (Ctrl+C)

### Making Changes:
- **Backend changes**: Server auto-restarts (nodemon)
- **Frontend changes**: Page auto-reloads (Vite HMR)
- No need to manually restart!

---

## Ports Used

| Service | Port | URL |
|---------|------|-----|
| Backend API | 5000 | http://localhost:5000 |
| Frontend App | 5173 | http://localhost:5173 |

---

## Quick Commands Reference

```bash
# Start backend
cd server && npm run dev

# Start frontend (in new terminal)
cd client && npm run dev

# Stop servers
Ctrl+C (in each terminal)

# Reinstall dependencies
npm install

# Check if running
# Backend: http://localhost:5000/api/health
# Frontend: http://localhost:5173
```

---

## Visual Guide

```
Terminal 1 (Backend):
┌─────────────────────────────────────┐
│ cd server                           │
│ npm run dev                         │
│                                     │
│ > nodemon server.js                 │
│ Simple File Database Connected      │
│ Server running on port 5000         │
│ ✓ Ready!                            │
└─────────────────────────────────────┘

Terminal 2 (Frontend):
┌─────────────────────────────────────┐
│ cd client                           │
│ npm run dev                         │
│                                     │
│ VITE v6.4.1  ready in 290 ms       │
│ ➜  Local: http://localhost:5173/   │
│ ✓ Ready!                            │
└─────────────────────────────────────┘

Browser:
┌─────────────────────────────────────┐
│ http://localhost:5173               │
│                                     │
│ PlaceMate AI Landing Page           │
│ [Sign Up] [Sign In]                 │
└─────────────────────────────────────┘
```

---

## Success Checklist

- [ ] Backend server started (port 5000)
- [ ] Frontend client started (port 5173)
- [ ] No error messages in terminals
- [ ] Browser opens http://localhost:5173
- [ ] Landing page loads correctly
- [ ] Can click "Sign Up" button

---

## Need Help?

If you're still having issues:

1. Make sure both terminals are open and running
2. Check for error messages in the terminals
3. Try restarting both servers
4. Check if ports 5000 and 5173 are available
5. Verify Node.js is installed: `node --version`

---

## Summary

**Easiest way:**
- Windows: Double-click `start.bat`
- Mac/Linux: Run `./start.sh`

**Manual way:**
1. Terminal 1: `cd server && npm run dev`
2. Terminal 2: `cd client && npm run dev`
3. Browser: http://localhost:5173

**That's it! You're ready to use PlaceMate AI! 🎉**
