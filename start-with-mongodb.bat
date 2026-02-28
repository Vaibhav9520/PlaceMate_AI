@echo off
echo ========================================
echo   PlaceMate AI - MongoDB Atlas Setup
echo ========================================
echo.

echo Step 1: Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo Done!
echo.

echo Step 2: Do you want to migrate existing data? (Y/N)
set /p migrate="Enter choice: "

if /i "%migrate%"=="Y" (
    echo.
    echo Migrating data to MongoDB Atlas...
    cd server
    node migrate-to-mongodb.js
    cd ..
    echo.
    echo Migration complete!
    timeout /t 3 /nobreak >nul
)

echo.
echo Step 3: Starting server with MongoDB Atlas...
cd server
start cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo   Server started with MongoDB Atlas!
echo ========================================
echo.
echo Check the server terminal for:
echo   - "MongoDB Connected" message
echo   - No connection errors
echo.
echo Your data is now stored in MongoDB Atlas cloud database!
echo.
pause
