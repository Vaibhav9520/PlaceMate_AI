@echo off
echo ========================================
echo Testing Delete Functionality
echo ========================================
echo.

echo Step 1: Killing all Node processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo ✓ Node processes killed
) else (
    echo ℹ No Node processes were running
)
timeout /t 3 /nobreak >nul

echo.
echo Step 2: Starting server...
cd server
start cmd /k "npm run dev"
echo ✓ Server starting in new window...
echo.
echo ⏳ Waiting 10 seconds for server to start...
timeout /t 10 /nobreak >nul

echo.
echo Step 3: Testing delete endpoint...
node ../test-delete-endpoint.js

echo.
echo ========================================
echo NEXT STEPS:
echo ========================================
echo 1. Check the server window for startup messages
echo 2. Look for "Server running in development mode on port 5000"
echo 3. Check if MongoDB connection succeeded or fell back to file-based
echo 4. Try deleting an interview from the browser
echo 5. Check browser Network tab - DELETE request should return 200 (not 404)
echo.
pause
