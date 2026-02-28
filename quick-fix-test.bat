@echo off
echo ========================================
echo Quick Fix Test - VAPI and Gemini
echo ========================================
echo.

echo [Step 1] Testing API Configuration...
node test-all-apis.js

echo.
echo ========================================
echo Test Complete!
echo ========================================
echo.

echo Next Steps:
echo 1. Start server: cd server ^&^& npm run dev
echo 2. Start client: cd client ^&^& npm run dev
echo 3. Test VAPI: Go to interview and click Connect
echo 4. Expected: AI should speak within 2-3 seconds
echo.

echo Troubleshooting:
echo - If no audio: Check microphone permissions
echo - If call ends: Check VAPI token in client/.env
echo - If questions fail: Gemini fallback will work
echo.

pause
