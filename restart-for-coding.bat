@echo off
cls
echo ========================================
echo RESTARTING SERVER FOR CODING PRACTICE
echo ========================================
echo.

echo [1/4] Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo      ✓ Processes stopped
) else (
    echo      ℹ No processes were running
)

echo.
echo [2/4] Waiting for cleanup...
timeout /t 3 /nobreak >nul
echo      ✓ Ready

echo.
echo [3/4] Starting server...
cd server
start "PlaceMate Server" cmd /k "echo Starting PlaceMate Server... && npm run dev"
cd ..
echo      ✓ Server starting in new window

echo.
echo [4/4] Waiting for server to initialize...
timeout /t 8 /nobreak >nul

echo.
echo ========================================
echo TESTING CODING ENDPOINTS
echo ========================================
echo.
node test-coding-endpoint.js

echo.
echo ========================================
echo NEXT STEPS
echo ========================================
echo.
echo 1. Check the "PlaceMate Server" window
echo 2. Look for "Server running in development mode on port 5000"
echo 3. If test shows "Coding endpoint exists (401)" - SUCCESS!
echo 4. If test shows "Coding endpoint NOT FOUND (404)" - Try restarting again
echo.
echo 5. Test in browser:
echo    - Go to http://localhost:5173
echo    - Login to your account
echo    - Click "DSA Coding Practice" on Dashboard
echo    - Select a topic and generate questions
echo.
pause
