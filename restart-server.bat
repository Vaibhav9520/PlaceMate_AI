@echo off
echo Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo Starting server...
cd server
start cmd /k "npm run dev"
echo Server restarted!
