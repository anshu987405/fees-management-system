@echo off
title PUSH CODE TO GITHUB

echo ======================================
echo 🚀 PUSHING CODE TO GITHUB
echo ======================================

:: Go to project root (auto detect)
cd /d %~dp0

:: Check git
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git installed nahi hai
    pause
    exit
)

echo.
echo 📂 Adding files...
git add .

echo.
echo 📝 Commit message enter karo:
set /p msg=Message: 

if "%msg%"=="" (
    set msg=auto update
)

echo.
echo 📦 Committing...
git commit -m "%msg%"

echo.
echo 🚀 Pushing...
git push

echo.
echo ======================================
echo ✅ DONE - CODE PUSHED
echo ======================================

echo.
echo 👉 Render auto deploy start ho jayega
echo 👉 20-30 sec wait karo

pause