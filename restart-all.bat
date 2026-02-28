@echo off
echo ========================================
echo Restarting PlaceMate AI Servers
echo ========================================
echo.

echo Stopping any running processes...
taskkill /F /IM node.exe 2>nul

echo.
echo Starting Server...
start cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak > nul

echo.
echo Starting Client...
start cmd /k "cd client && npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Server: http://localhost:5000
echo Client: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul
