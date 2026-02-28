@echo off
echo ========================================
echo   DELETE FUNCTIONALITY - COMPLETE FIX
echo ========================================
echo.

echo Step 1: Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 3 /nobreak >nul
echo Done!
echo.

echo Step 2: Checking files...
echo.

echo Checking server/routes/interviewRoutes.js...
findstr /C:"router.delete" server\routes\interviewRoutes.js >nul
if %errorlevel%==0 (
    echo   [OK] Delete route exists
) else (
    echo   [ERROR] Delete route missing!
)

echo Checking server/controllers/interviewController.js...
findstr /C:"export const deleteInterview" server\controllers\interviewController.js >nul
if %errorlevel%==0 (
    echo   [OK] Delete controller exists
) else (
    echo   [ERROR] Delete controller missing!
)

echo Checking server/config/database.js...
findstr /C:"delete: async" server\config\database.js >nul
if %errorlevel%==0 (
    echo   [OK] Database delete method exists
) else (
    echo   [ERROR] Database delete method missing!
)

echo Checking server/config/simpleDB.js...
findstr /C:"delete:" server\config\simpleDB.js >nul
if %errorlevel%==0 (
    echo   [OK] SimpleDB delete method exists
) else (
    echo   [ERROR] SimpleDB delete method missing!
)

echo.
echo Step 3: Clearing Node cache...
if exist server\node_modules\.cache (
    rmdir /s /q server\node_modules\.cache
    echo   [OK] Cache cleared
) else (
    echo   [OK] No cache to clear
)
echo.

echo Step 4: Starting server...
cd server
start cmd /k "echo Starting server... && npm run dev"
cd ..
echo.

echo Step 5: Waiting for server to start...
timeout /t 5 /nobreak >nul
echo.

echo Step 6: Testing delete endpoint...
node test-delete-endpoint.js
echo.

echo ========================================
echo   NEXT STEPS
echo ========================================
echo.
echo 1. Check the server terminal for:
echo    - "Server running in development mode on port 5000"
echo    - "MongoDB Connected" (if using MongoDB)
echo    - "Simple File Database Connected" (if using files)
echo.
echo 2. Open your browser and test:
echo    - Go to http://localhost:5173/dashboard
echo    - Scroll to Recent Interviews
echo    - Hover over an interview card
echo    - Click the trash icon
echo    - Confirm deletion
echo.
echo 3. Check browser console (F12) for errors
echo.
echo If delete still doesn't work, check:
echo    - Browser console for errors
echo    - Server terminal for error messages
echo    - Network tab (F12) to see the DELETE request
echo.
pause
