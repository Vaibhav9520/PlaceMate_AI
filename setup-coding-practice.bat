@echo off
cls
echo ========================================
echo SETUP CODING PRACTICE FEATURE
echo ========================================
echo.

echo [1/5] Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo      ✓ Done

echo.
echo [2/5] Installing axios dependency...
cd server
call npm install axios
if %errorlevel% neq 0 (
    echo      ❌ Failed to install axios
    pause
    exit /b 1
)
echo      ✓ Axios installed
cd ..

echo.
echo [3/5] Verifying installation...
cd server
npm list axios
cd ..
echo      ✓ Verified

echo.
echo [4/5] Starting server...
cd server
start "PlaceMate Server" cmd /k "echo Starting PlaceMate Server... && npm run dev"
cd ..
echo      ✓ Server starting in new window

echo.
echo [5/5] Waiting for server to initialize...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo TESTING CODING ENDPOINTS
echo ========================================
echo.
node test-coding-endpoint.js

echo.
echo ========================================
echo SETUP COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Check the "PlaceMate Server" window for any errors
echo 2. If test shows "Coding endpoint exists (401)" - SUCCESS!
echo 3. Open http://localhost:5173 in your browser
echo 4. Login to your account
echo 5. Click "DSA Coding Practice" on Dashboard
echo 6. Select a topic and generate questions!
echo.
pause
