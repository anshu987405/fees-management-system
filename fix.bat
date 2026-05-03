@echo off
title SAFE FULL DEPLOY

echo =========================================
echo 🚀 FEES MANAGEMENT SAFE DEPLOY START
echo =========================================

cd /d %~dp0

echo.
echo 📦 Step 1: Build frontend...
cd client
call npm install
call npm run build

cd ..

echo.
echo 📂 Step 2: Add files to Git...
git add .

echo.
echo 📝 Step 3: Commit...
git commit -m "safe deploy update"

echo.
echo 🚀 Step 4: Push to GitHub...
git push

echo.
echo =========================================
echo ✅ CODE PUSH DONE
echo =========================================

echo.
echo ⚠️ NEXT STEP (IMPORTANT):
echo 👉 Render open karo
echo 👉 Manual Deploy -> Clear build cache ^& deploy
echo.

echo 🌐 TEST LINKS:
echo https://fees-management-system-i8sj.onrender.com
echo https://fees-management-system-i8sj.onrender.com/api
echo.

pause