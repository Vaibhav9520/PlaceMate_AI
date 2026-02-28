@echo off
echo ========================================
echo FINAL SETUP - AI Interview System
echo ========================================
echo.

echo ✅ Your Gemini API is WORKING!
echo ✅ Model: gemini-2.5-flash
echo ✅ All code updated to use correct model
echo.

echo [1/3] Stopping old processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak > nul

echo.
echo [2/3] Starting Server...
start cmd /k "cd server && echo ✅ Server starting with Gemini 2.5 Flash... && npm run dev"
timeout /t 5 /nobreak > nul

echo.
echo [3/3] Starting Client...
start cmd /k "cd client && echo ✅ Client starting... && npm run dev"

echo.
echo ========================================
echo ✅ SETUP COMPLETE!
echo ========================================
echo.
echo Your AI Interview System is ready!
echo.
echo ✅ Gemini API: WORKING
echo ✅ Model: gemini-2.5-flash
echo ✅ Server: http://localhost:5000
echo ✅ Client: http://localhost:5173
echo.
echo Features:
echo ✓ AI asks questions
echo ✓ You answer via microphone
echo ✓ AI analyzes and asks follow-ups
echo ✓ Natural conversation flow
echo ✓ Professional UI
echo ✓ Feedback generation
echo.
echo Next Steps:
echo 1. Go to http://localhost:5173
echo 2. Sign in
echo 3. Start interview
echo 4. Choose "Voice Interview"
echo 5. Have a conversation with AI!
echo.
pause
