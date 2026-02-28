@echo off
cls
echo ========================================
echo FIXING DELETE FUNCTIONALITY
echo ========================================
echo.
echo This will:
echo 1. Stop all Node processes
echo 2. Wait for cleanup
echo 3. Start the server fresh
echo 4. Run diagnostics
echo.
pause

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
timeout /t 5 /nobreak >nul
echo      ✓ Ready to start

echo.
echo [3/4] Starting server...
cd server
start "PlaceMate Server" cmd /k "echo Starting PlaceMate Server... && npm run dev"
cd ..

echo      ✓ Server starting in new window
echo.
echo [4/4] Waiting for server to initialize...
echo      (This takes about 10 seconds)
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo RUNNING DIAGNOSTICS
echo ========================================
echo.
node diagnose-delete-issue.js

echo.
echo ========================================
echo NEXT STEPS
echo ========================================
echo.
echo 1. Check the "PlaceMate Server" window
echo 2. Look for "Server running in development mode on port 5000"
echo 3. If diagnostics show "DELETE endpoint exists (401)" - SUCCESS!
echo 4. If diagnostics show "DELETE endpoint NOT FOUND (404)" - Try again
echo.
echo 5. Test in browser:
echo    - Go to http://localhost:5173
echo    - Login to your account
echo    - Go to Dashboard
echo    - Click trash icon on any interview
echo    - Confirm deletion
echo    - Interview should be deleted!
echo.
pause
