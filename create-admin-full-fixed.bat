@echo off
title SMART PUSH (IGNORE USELESS FILES)

cd /d %~dp0

echo ======================================
echo 🚀 SMART GITHUB PUSH START
echo ======================================

:: ensure git installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git installed nahi hai
    pause
    exit
)

:: create/update .gitignore (safe)
echo Creating .gitignore...

(
echo node_modules/
echo .env
echo .env.*
echo dist/
echo build/
echo uploads/
echo *.log
echo npm-debug.log*
echo .DS_Store
echo .vscode/
echo .idea/
) > .gitignore

echo.
echo 📂 Adding files (excluding ignored)...
git add .

echo.
echo 📝 Enter commit message:
set /p msg=Message: 

if "%msg%"=="" (
    set msg=smart auto push
)

echo.
echo 📦 Committing...
git commit -m "%msg%"

echo.
echo 🚀 Pushing to GitHub...
git push

echo.
echo ======================================
echo ✅ DONE - PROJECT PUSHED CLEANLY
echo ======================================

echo.
echo 👉 Render auto deploy start ho jayega
echo 👉 20-30 sec wait karo

pause