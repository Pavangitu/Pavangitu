@echo off
title Push Profile README to GitHub
echo ===================================================
echo   Push Profile README to GitHub
echo ===================================================
echo.

:: Check if git is installed
git --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not installed or not in your PATH.
    echo Please install Git and try again.
    pause
    exit /b 1
)

:: Check if .git directory exists, if not init
if not exist .git (
    echo Initializing Git repository...
    git init
    git branch -M main
)

:: Add files
echo Staging profile README, banner and tools...
git add README.md github_banner.png copy_banner.py run.bat preview.html push_to_github.bat

:: Check if remote exists
git remote get-url origin >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Remote 'origin' is not set. Adding remote for Pavangitu...
    git remote add origin https://github.com/Pavangitu/Pavangitu.git
)

echo.
set /p commit_msg="Enter commit message (default: 'Update GitHub Profile README'): "
if "%commit_msg%"=="" set commit_msg=Update GitHub Profile README

echo.
echo Committing changes...
git commit -m "%commit_msg%"

echo.
echo Pushing to GitHub (main branch)...
echo Note: If this is the first push or if authentication is required, Git will prompt you.
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [WARNING] Push failed. If the remote repository has changes you don't have locally,
    echo you may need to pull first or force push.
    echo.
    set /p force_push="Would you like to force push? (y/n): "
    if /I "%force_push%"=="y" (
        echo Force pushing to origin main...
        git push -f origin main
    )
)

echo.
echo Operation complete.
pause
