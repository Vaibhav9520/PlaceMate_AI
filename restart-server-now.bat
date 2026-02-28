@echo off
cls
echo ========================================
echo RESTARTING SERVER
echo ========================================
echo.
echo MongoDB has been DISABLED
echo Using FILE-BASED storage
echo.

echo [1/2] Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo      ✓ Done

echo.
echo [2/2] Starting server...
echo.
echo ========================================
echo SERVER OUTPUT
echo ========================================
echo.
cd server
npm run dev
