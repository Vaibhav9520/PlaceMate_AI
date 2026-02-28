@echo off
REM PlaceMate AI - Quick Start Script for Windows
REM This script helps you start both server and client

echo.
echo ========================================
echo   PlaceMate AI - Quick Start
echo ========================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo WARNING: MongoDB is not running!
    echo Please start MongoDB first.
    echo.
    pause
    exit /b 1
)
echo MongoDB is running
echo.

REM Start server
echo Starting backend server...
cd server
if not exist "node_modules\" (
    echo Installing server dependencies...
    call npm install
)
start "PlaceMate Server" cmd /k npm run dev
echo Server started
echo.

REM Wait a bit
timeout /t 3 /nobreak >nul

REM Start client
echo Starting frontend client...
cd ..\client
if not exist "node_modules\" (
    echo Installing client dependencies...
    call npm install
)
start "PlaceMate Client" cmd /k npm run dev
echo Client started
echo.

echo ========================================
echo   PlaceMate AI is running!
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo Close the terminal windows to stop the servers
echo.
pause
