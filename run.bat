@echo off
title GitHub Profile & Portfolio Dev Server
echo ===================================================
echo   Setting up GitHub Profile & Portfolio (React + Vite)
echo ===================================================
echo.

:: 1. Copy Assets
echo Running copy_banner.py to copy your profile assets to public folder...
python copy_banner.py
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Python failed to execute. Trying system copy fallback for banner...
    if not exist public mkdir public
    copy "C:\Users\pavan\.gemini\antigravity-ide\brain\e74391a2-d404-40b7-8e1a-8b6b002c7dc6\github_banner_1783868542636.png" "%~dp0public\github_banner.png" > nul
    copy "%~dp0README.md" "%~dp0public\README.md" > nul
    copy "%~dp0Pavan-Datta-Gedila1.pdf" "%~dp0public\Pavan-Datta-Gedila1.pdf" > nul
    copy "%~dp0pavan Profile.pdf" "%~dp0public\pavan Profile.pdf" > nul
    copy "%~dp0pavan datta.pdf" "%~dp0public\pavan datta.pdf" > nul
)
echo Assets synced successfully.
echo.

:: 2. Check Node Modules
if not exist node_modules (
    echo Node modules not found. Running "npm install"...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] npm install failed. Please ensure Node.js is installed.
        pause
        exit /b 1
    )
)

:: 3. Run Dev Server
echo.
echo Starting development server...
echo Project will open at http://localhost:3000
echo.
call npm run dev
pause
