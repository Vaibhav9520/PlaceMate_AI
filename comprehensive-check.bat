@echo off
cls
echo ========================================
echo COMPREHENSIVE SYSTEM CHECK
echo ========================================
echo.
echo This will verify all features and configurations
echo.
pause

echo.
echo [1/10] Checking Environment Files...
echo.

if exist "server\.env" (
    echo ✓ server/.env exists
) else (
    echo ✗ server/.env missing!
    pause
    exit /b 1
)

if exist "client\.env" (
    echo ✓ client/.env exists
) else (
    echo ✗ client/.env missing!
    pause
    exit /b 1
)

echo.
echo [2/10] Checking Server Dependencies...
cd server
call npm list axios 2>nul | findstr "axios" >nul
if %errorlevel% equ 0 (
    echo ✓ axios installed
) else (
    echo ✗ axios missing - run: npm install axios
)

call npm list @google/generative-ai 2>nul | findstr "generative-ai" >nul
if %errorlevel% equ 0 (
    echo ✓ @google/generative-ai installed
) else (
    echo ✗ @google/generative-ai missing
)

call npm list mongoose 2>nul | findstr "mongoose" >nul
if %errorlevel% equ 0 (
    echo ✓ mongoose installed
) else (
    echo ✗ mongoose missing
)

cd ..

echo.
echo [3/10] Checking Client Dependencies...
cd client
call npm list @vapi-ai/web 2>nul | findstr "vapi" >nul
if %errorlevel% equ 0 (
    echo ✓ @vapi-ai/web installed
) else (
    echo ✗ @vapi-ai/web missing
)

call npm list axios 2>nul | findstr "axios" >nul
if %errorlevel% equ 0 (
    echo ✓ axios installed
) else (
    echo ✗ axios missing
)

cd ..

echo.
echo [4/10] Checking Critical Files...
echo.

set "files_ok=1"

if exist "server\services\aiService.js" (echo ✓ aiService.js) else (echo ✗ aiService.js missing & set "files_ok=0")
if exist "server\services\codingService.js" (echo ✓ codingService.js) else (echo ✗ codingService.js missing & set "files_ok=0")
if exist "server\controllers\codingController.js" (echo ✓ codingController.js) else (echo ✗ codingController.js missing & set "files_ok=0")
if exist "server\routes\codingRoutes.js" (echo ✓ codingRoutes.js) else (echo ✗ codingRoutes.js missing & set "files_ok=0")
if exist "server\models_backup\CodingQuestion.js" (echo ✓ CodingQuestion.js) else (echo ✗ CodingQuestion.js missing & set "files_ok=0")
if exist "client\src\pages\CodingPractice.jsx" (echo ✓ CodingPractice.jsx) else (echo ✗ CodingPractice.jsx missing & set "files_ok=0")
if exist "client\src\components\VoiceInterview.jsx" (echo ✓ VoiceInterview.jsx) else (echo ✗ VoiceInterview.jsx missing & set "files_ok=0")

echo.
echo [5/10] Checking Scripts...
echo.

if exist "server\scripts\generate-coding-questions.js" (echo ✓ generate-coding-questions.js) else (echo ✗ generate-coding-questions.js missing & set "files_ok=0")
if exist "server\scripts\seed-coding-questions.js" (echo ✓ seed-coding-questions.js) else (echo ✗ seed-coding-questions.js missing & set "files_ok=0")
if exist "generate-questions.bat" (echo ✓ generate-questions.bat) else (echo ✗ generate-questions.bat missing & set "files_ok=0")
if exist "seed-questions.bat" (echo ✓ seed-questions.bat) else (echo ✗ seed-questions.bat missing & set "files_ok=0")

echo.
echo [6/10] Checking Data Directory...
echo.

if exist "server\data" (
    echo ✓ server/data directory exists
    if exist "server\data\users.json" (echo ✓ users.json exists) else (echo ℹ users.json will be created on first use)
    if exist "server\data\interviews.json" (echo ✓ interviews.json exists) else (echo ℹ interviews.json will be created on first use)
    if exist "server\data\feedback.json" (echo ✓ feedback.json exists) else (echo ℹ feedback.json will be created on first use)
    if exist "server\data\coding-questions.json" (echo ✓ coding-questions.json exists) else (echo ℹ coding-questions.json - run generate-questions.bat)
) else (
    echo ℹ server/data will be created automatically
)

echo.
echo [7/10] Testing API Keys...
echo.
node test-apis.js
if %errorlevel% equ 0 (
    echo ✓ API test passed
) else (
    echo ⚠ API test had issues - check output above
)

echo.
echo [8/10] Checking Server Routes...
echo.
findstr /C:"codingRoutes" server\server.js >nul
if %errorlevel% equ 0 (
    echo ✓ Coding routes registered in server.js
) else (
    echo ✗ Coding routes NOT registered in server.js
    set "files_ok=0"
)

findstr /C:"interviewRoutes" server\server.js >nul
if %errorlevel% equ 0 (
    echo ✓ Interview routes registered
) else (
    echo ✗ Interview routes NOT registered
    set "files_ok=0"
)

echo.
echo [9/10] Checking Client Routes...
echo.
findstr /C:"CodingPractice" client\src\App.jsx >nul
if %errorlevel% equ 0 (
    echo ✓ CodingPractice route in App.jsx
) else (
    echo ✗ CodingPractice route NOT in App.jsx
    set "files_ok=0"
)

findstr /C:"coding-practice" client\src\pages\Dashboard.jsx >nul
if %errorlevel% equ 0 (
    echo ✓ Coding practice link in Dashboard
) else (
    echo ✗ Coding practice link NOT in Dashboard
    set "files_ok=0"
)

echo.
echo [10/10] Checking Documentation...
echo.
if exist "FIX_ALL_APIS.md" (echo ✓ FIX_ALL_APIS.md) else (echo ℹ FIX_ALL_APIS.md missing)
if exist "SETUP_QUESTION_DATABASE.md" (echo ✓ SETUP_QUESTION_DATABASE.md) else (echo ℹ SETUP_QUESTION_DATABASE.md missing)
if exist "CODING_PRACTICE_FEATURE.md" (echo ✓ CODING_PRACTICE_FEATURE.md) else (echo ℹ CODING_PRACTICE_FEATURE.md missing)

echo.
echo ========================================
echo CHECK COMPLETE
echo ========================================
echo.

if "%files_ok%"=="1" (
    echo ✅ All critical files present
) else (
    echo ⚠ Some files are missing - check output above
)

echo.
echo ========================================
echo NEXT STEPS
echo ========================================
echo.
echo 1. If APIs failed: Check server/.env and client/.env
echo 2. If files missing: Re-run setup scripts
echo 3. Generate questions: generate-questions.bat
echo 4. Start server: restart-server-now.bat
echo 5. Test in browser: http://localhost:5173
echo.
pause
