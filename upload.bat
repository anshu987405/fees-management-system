@echo off
echo ===============================
echo   PUSHING CODE TO GITHUB
echo ===============================

git add .
git commit -m "auto update"
git push

echo ===============================
echo   DONE ✅
echo ===============================
echo.
echo 👉 Now go to Render and click:
echo Manual Deploy -> Deploy latest commit
pause