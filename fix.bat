@echo off
title FINAL FIX + DEPLOY

echo =====================================
echo 🔧 FIXING API ROUTE (routes/index.js)
echo =====================================

cd /d %~dp0

:: Create routes folder if not exist
if not exist server\src\routes mkdir server\src\routes

:: Create/overwrite index.js
(
echo import express from "express";
echo const router = express.Router();
echo.
echo // ✅ API ROOT FIX
echo router.get("/", (req, res) =^> {
echo   res.send("API is working 🚀");
echo });
echo.
echo export default router;
) > server\src\routes\index.js

echo.
echo =====================================
echo ✅ API ROUTE FIXED
echo =====================================

echo.
echo 🚀 PUSHING TO GITHUB...

git add .
git commit -m "final api fix"
git push

echo.
echo =====================================
echo ✅ DONE
echo =====================================

echo.
echo 👉 Render me jao:
echo 👉 Manual Deploy -^> Clear build cache ^& deploy
echo.

echo 🌐 TEST:
echo https://fees-management-system-i8sj.onrender.com/api
echo.

pause