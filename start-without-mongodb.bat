@echo off
cls
echo ========================================
echo Starting Server WITHOUT MongoDB
echo ========================================
echo.
echo This will start the server using file-based storage only.
echo MongoDB connection will be disabled.
echo.

echo [1/3] Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo      ✓ Processes stopped
) else (
    echo      ℹ No processes were running
)

echo.
echo [2/3] Temporarily disabling MongoDB...
cd server
powershell -Command "(Get-Content .env) -replace 'USE_MONGODB=true', 'USE_MONGODB=false' | Set-Content .env"
echo      ✓ MongoDB disabled

echo.
echo [3/3] Starting server with file-based storage...
echo.
echo ========================================
echo SERVER STARTING
echo ========================================
echo.
npm run dev
