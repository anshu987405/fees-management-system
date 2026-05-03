@echo off
echo ===============================
echo   FEES MANAGEMENT AUTO DEPLOY
echo ===============================

echo.
echo 🔁 Step 1: Adding changes...
git add .

echo.
echo 📝 Step 2: Commiting...
git commit -m "auto update deploy"

echo.
echo 🚀 Step 3: Pushing to GitHub...
git push

echo.
echo ===============================
echo   DONE ✅
echo ===============================
echo.

echo ⚠️ IMPORTANT:
echo 👉 Ab Render me jao:
echo 👉 Manual Deploy -> Deploy latest commit
echo.

echo 🌐 Test URL:
echo https://fees-management-system-i8sj.onrender.com/api
echo.

pause
