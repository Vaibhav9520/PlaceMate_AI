@echo off
cls
echo ========================================
echo SEED CODING QUESTIONS TO MONGODB
echo ========================================
echo.
echo This will upload all generated questions to MongoDB Atlas.
echo.
echo Prerequisites:
echo 1. Questions generated (run generate-questions.bat first)
echo 2. MongoDB enabled (USE_MONGODB=true in server/.env)
echo 3. MongoDB connection string configured
echo.
pause

echo.
echo [1/2] Checking if questions file exists...
if not exist "server\data\coding-questions.json" (
    echo.
    echo ❌ Questions file not found!
    echo Please run generate-questions.bat first
    pause
    exit /b 1
)
echo ✓ Questions file found

echo.
echo [2/2] Seeding database...
echo.
cd server
node scripts/seed-coding-questions.js
if %errorlevel% neq 0 (
    echo.
    echo ❌ Database seeding failed!
    echo Check your MongoDB connection in server/.env
    pause
    exit /b 1
)

echo.
echo ========================================
echo SEEDING COMPLETE!
echo ========================================
echo.
echo All questions are now in MongoDB Atlas!
echo.
echo Next step: Restart server to use the new questions
echo Run: restart-server-now.bat
echo.
pause
