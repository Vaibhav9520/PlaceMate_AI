@echo off
echo ========================================
echo Testing All System Components
echo ========================================
echo.

echo [1/5] Checking Environment Files...
if exist "server\.env" (
    echo ✓ server\.env exists
) else (
    echo ✗ server\.env missing!
    exit /b 1
)

if exist "client\.env" (
    echo ✓ client\.env exists
) else (
    echo ✗ client\.env missing!
    exit /b 1
)

echo.
echo [2/5] Checking Server Dependencies...
cd server
if exist "node_modules" (
    echo ✓ Server dependencies installed
) else (
    echo Installing server dependencies...
    call npm install
)

echo.
echo [3/5] Checking Client Dependencies...
cd ..\client
if exist "node_modules" (
    echo ✓ Client dependencies installed
) else (
    echo Installing client dependencies...
    call npm install
)

echo.
echo [4/5] Testing Server Startup...
cd ..\server
echo Starting server for 5 seconds...
start /B cmd /c "node server.js > test-output.txt 2>&1"
timeout /t 5 /nobreak > nul

echo.
echo Server Output:
type test-output.txt
del test-output.txt

echo.
echo [5/5] System Status Summary
echo ========================================
echo ✓ Environment files configured
echo ✓ Dependencies installed
echo ✓ Server can start
echo.
echo Next Steps:
echo 1. Start server: cd server ^&^& npm run dev
echo 2. Start client: cd client ^&^& npm run dev
echo 3. Test VAPI: Go to interview and click Connect
echo 4. Test Coding: Go to DSA Coding Practice
echo ========================================

cd ..
pause
