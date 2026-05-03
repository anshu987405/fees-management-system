@echo off
title FULL BACKEND AUTO FIX + DEPLOY

echo =====================================
echo 🚀 FULL BACKEND AUTO SETUP START
echo =====================================

cd /d %~dp0

:: ==============================
:: CREATE USER MODEL
:: ==============================
echo Creating user model...

mkdir server\src\models 2>nul

(
echo import mongoose from "mongoose";
echo.
echo const schema = new mongoose.Schema({
echo   name: String,
echo   email: String,
echo   password: String,
echo   role: String
echo });
echo.
echo export default mongoose.model("User", schema);
) > server\src\models\user.model.js


:: ==============================
:: CREATE AUTH ROUTES
:: ==============================
echo Creating auth routes...

mkdir server\src\routes 2>nul

(
echo import express from "express";
echo import bcrypt from "bcryptjs";
echo import User from "../models/user.model.js";
echo.
echo const router = express.Router();
echo.
echo // REGISTER
echo router.post("/register", async (req, res) =^> {
echo   try {
echo     const { name, email, password } = req.body;
echo.
echo     const exist = await User.findOne({ email });
echo     if (exist) {
echo       return res.json({ success: false, message: "User already exists" });
echo     }
echo.
echo     const hashed = await bcrypt.hash(password, 10);
echo.
echo     const user = await User.create({
echo       name,
echo       email,
echo       password: hashed,
echo       role: "admin"
echo     });
echo.
echo     res.json({ success: true, message: "User created" });
echo   } catch (err) {
echo     res.json({ success: false, message: err.message });
echo   }
echo });
echo.
echo export default router;
) > server\src\routes\auth.routes.js


:: ==============================
:: CREATE INDEX ROUTES
:: ==============================
echo Creating index routes...

(
echo import express from "express";
echo import authRoutes from "./auth.routes.js";
echo.
echo const router = express.Router();
echo.
echo router.use("/auth", authRoutes);
echo.
echo router.get("/", (req, res) =^> {
echo   res.send("API is working 🚀");
echo });
echo.
echo export default router;
) > server\src\routes\index.js


:: ==============================
:: INSTALL DEPENDENCIES
:: ==============================
echo Installing bcrypt...

cd server
call npm install bcryptjs
cd ..


:: ==============================
:: GIT PUSH
:: ==============================
echo.
echo 🚀 Pushing to GitHub...

git add .
git commit -m "full backend auto setup"
git push

echo.
echo =====================================
echo ✅ SETUP DONE
echo =====================================

echo.
echo 👉 NEXT:
echo 1. Render open karo
echo 2. Manual Deploy -> Clear cache & deploy
echo.

echo 👉 Deploy ke baad run karo:
echo create-admin.bat
echo.

pause