@echo off
title FULL PROJECT AUTO DEPLOY

echo =========================================
echo 🚀 FEES MANAGEMENT FULL DEPLOY START
echo =========================================

cd /d %~dp0

echo.
echo 📦 Step 1: Installing client dependencies...
cd client
call npm install

echo.
echo 🔨 Step 2: Building frontend...
call npm run build

cd ..

echo.
echo 📂 Step 3: Adding files to Git...
git add .

echo.
echo 📝 Step 4: Commit...
git commit -m "full deploy update"

echo.
echo 🚀 Step 5: Push to GitHub...
git push

echo.
echo =========================================
echo ✅ ALL DONE
echo =========================================

echo.
echo ⚠️ FINAL STEP:
echo 👉 Render Dashboard open karo
echo 👉 Manual Deploy -> Clear build cache ^& deploy
echo.

echo 🌐 TEST YOUR APP:
echo https://fees-management-system-i8sj.onrender.com
echo.

pause