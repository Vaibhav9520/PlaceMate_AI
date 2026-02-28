@echo off
echo ========================================
echo Fixing AI Interview System
echo ========================================
echo.

echo [1/4] Stopping existing processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak > nul

echo.
echo [2/4] Installing dependencies...
cd server
call npm install
cd ..\client
call npm install
cd ..

echo.
echo [3/4] Starting server...
start cmd /k "cd server && echo Starting server... && npm run dev"
timeout /t 5 /nobreak > nul

echo.
echo [4/4] Testing server endpoint...
node test-server-endpoint.js

echo.
echo ========================================
echo Starting client...
echo ========================================
start cmd /k "cd client && echo Starting client... && npm run dev"

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Server: http://localhost:5000
echo Client: http://localhost:5173
echo.
echo The AI interview now has:
echo ✓ Fixed API endpoint (port 5000)
echo ✓ Better error handling
echo ✓ Fallback responses if Gemini fails
echo ✓ No auto-listening while AI speaks
echo ✓ Improved conversation flow
echo.
echo Test the interview:
echo 1. Go to http://localhost:5173
echo 2. Start interview
echo 3. Choose "Voice Interview"
echo 4. Click microphone to answer questions
echo.
pause