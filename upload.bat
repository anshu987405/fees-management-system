@echo off
echo ==============================
echo   FeesPro Auto Git Upload
echo ==============================

:: Check git installed
git --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Git install nahi hai. Pehle Git install karo.
    pause
    exit
)

echo.
echo Step 1: Git init...
git init

echo.
echo Step 2: Adding files...
git add .

echo.
echo Step 3: Commit...
git commit -m "Auto upload"

echo.
echo Step 4: Set branch...
git branch -M main

echo.
echo Step 5: Connect repo...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/anshu987405/fees-management-system.git

echo.
echo Step 6: Push to GitHub...
git push -u origin main

echo.
echo ==============================
echo   Upload Complete ✅
echo ==============================

pause