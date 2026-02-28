@echo off
cls
echo ========================================
echo GENERATE CODING QUESTIONS WITH AI
echo ========================================
echo.
echo This will use Gemini AI to generate 10 questions
echo for each of the 15 DSA topics (150 questions total).
echo.
echo Topics:
echo - Arrays, Strings, Linked Lists
echo - Stacks, Queues, Trees, Graphs
echo - Sorting, Searching, Dynamic Programming
echo - Recursion, Backtracking, Greedy
echo - Hash Tables, Heaps
echo.
echo This will take approximately 5-10 minutes.
echo.
pause

echo.
echo [1/2] Generating questions with AI...
echo.
cd server
node scripts/generate-coding-questions.js
if %errorlevel% neq 0 (
    echo.
    echo ❌ Question generation failed!
    echo Check your Gemini API key in server/.env
    pause
    exit /b 1
)

echo.
echo ========================================
echo GENERATION COMPLETE!
echo ========================================
echo.
echo Questions saved to: server/data/coding-questions.json
echo.
echo Next step: Run seed-questions.bat to upload to MongoDB
echo Or: Questions will be used from file if MongoDB is disabled
echo.
pause
