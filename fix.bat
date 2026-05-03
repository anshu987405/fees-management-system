@echo off
title FINAL FULL DEPLOY (FRONTEND + BACKEND)

echo =========================================
echo 🚀 FINAL DEPLOY START
echo =========================================

cd /d %~dp0

echo.
echo 📦 Step 1: Install client dependencies...
cd client
call npm install

echo.
echo 🔨 Step 2: Build frontend...
call npm run build

cd ..

echo.
echo 📂 Step 3: Force add dist folder...
git add client/dist -f

echo.
echo 📂 Step 4: Add all files...
git add .

echo.
echo 📝 Step 5: Commit...
git commit -m "final deploy with dist"

echo.
echo 🚀 Step 6: Push to GitHub...
git push

echo.
echo =========================================
echo ✅ ALL DONE
echo =========================================

echo.
echo ⚠️ NEXT STEP:
echo 👉 Render Dashboard open karo
echo 👉 Manual Deploy -^> Clear build cache ^& deploy
echo.

echo 🌐 FINAL TEST:
echo https://fees-management-system-i8sj.onrender.com
echo.

pause