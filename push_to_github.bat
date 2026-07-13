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
echo Staging all project source files...
git add .

:: Check if remote exists
git remote get-url origin >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Remote 'origin' is not set. Adding remote for Pavangitu...
    git remote add origin https://github.com/Pavangitu/Pavangitu.git
) else (
    echo Updating remote URL to point to Pavangitu repository...
    git remote set-url origin https://github.com/Pavangitu/Pavangitu.git
)

echo.
set /p commit_msg="Enter commit message (default: 'Update GitHub Profile README'): "
if "%commit_msg%"=="" set commit_msg=Update GitHub Profile README

echo.
echo Committing changes...
git commit -m "%commit_msg%"

echo.
echo Pushing React project and README to Pavangitu (special profile repository)...
echo Note: Ensure you have created a PUBLIC repository named 'Pavangitu' on GitHub!
git push -f origin main

echo.
echo Operation complete.
pause
