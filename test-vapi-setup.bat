@echo off
echo ========================================
echo VAPI Setup Verification
echo ========================================
echo.

echo [1/4] Checking VAPI Token...
findstr "VAPI_WEB_TOKEN" client\.env > nul
if %errorlevel% equ 0 (
    echo ✓ VAPI token found in client\.env
) else (
    echo ✗ VAPI token missing in client\.env
)

findstr "VAPI_WEB_TOKEN" server\.env > nul
if %errorlevel% equ 0 (
    echo ✓ VAPI token found in server\.env
) else (
    echo ✗ VAPI token missing in server\.env
)

echo.
echo [2/4] Checking OpenAI API Key...
findstr "OPENAI_API_KEY" client\.env > nul
if %errorlevel% equ 0 (
    findstr "your_openai_api_key_here" client\.env > nul
    if %errorlevel% equ 0 (
        echo ✗ OpenAI key in client\.env needs to be replaced
        echo   Get your key from: https://platform.openai.com/api-keys
    ) else (
        echo ✓ OpenAI key configured in client\.env
    )
) else (
    echo ✗ OpenAI key missing in client\.env
    echo   Add: VITE_OPENAI_API_KEY=sk-your-key-here
)

findstr "OPENAI_API_KEY" server\.env > nul
if %errorlevel% equ 0 (
    findstr "your_openai_api_key_here" server\.env > nul
    if %errorlevel% equ 0 (
        echo ✗ OpenAI key in server\.env needs to be replaced
        echo   Get your key from: https://platform.openai.com/api-keys
    ) else (
        echo ✓ OpenAI key configured in server\.env
    )
) else (
    echo ✗ OpenAI key missing in server\.env
    echo   Add: OPENAI_API_KEY=sk-your-key-here
)

echo.
echo [3/4] Checking Gemini API Key...
findstr "GOOGLE_GENERATIVE_AI_API_KEY" server\.env > nul
if %errorlevel% equ 0 (
    echo ✓ Gemini API key found in server\.env
) else (
    echo ✗ Gemini API key missing in server\.env
)

echo.
echo [4/4] Summary
echo ========================================
echo.
echo CRITICAL: OpenAI API Key Required for VAPI Audio
echo.
echo Without OpenAI API key, VAPI will:
echo   ✗ Connect but not speak
echo   ✗ Not listen to user responses
echo   ✗ End call immediately
echo.
echo To fix:
echo   1. Get key: https://platform.openai.com/api-keys
echo   2. Add to client\.env: VITE_OPENAI_API_KEY=sk-...
echo   3. Add to server\.env: OPENAI_API_KEY=sk-...
echo   4. Restart both servers
echo   5. Clear browser cache
echo   6. Test interview
echo.
echo Cost: ~$0.10 per 10-minute interview
echo Recommended: Add $10 credit (50-100 interviews)
echo.
echo ========================================

pause
