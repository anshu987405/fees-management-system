@echo off
title AUTO SETUP + DEPLOY

echo ===============================
echo  CREATING app.js FILE
echo ===============================

cd /d %~dp0

:: Create folders if not exist
if not exist server\src mkdir server\src

:: Write app.js
(
echo import express from "express";
echo import cors from "cors";
echo import dotenv from "dotenv";
echo import connectDB from "./config/db.js";
echo.
echo import authRoutes from "./routes/auth.routes.js";
echo import studentRoutes from "./routes/student.routes.js";
echo import paymentRoutes from "./routes/payment.routes.js";
echo.
echo dotenv.config();
echo.
echo const app = express();
echo.
echo app.use(cors());
echo app.use(express.json());
echo.
echo connectDB();
echo.
echo // =======================
echo // ROUTES
echo // =======================
echo.
echo app.get("/api", (req, res) =^> {
echo   res.send("API is working 🚀");
echo });
echo.
echo app.use("/api/auth", authRoutes);
echo app.use("/api/students", studentRoutes);
echo app.use("/api/payments", paymentRoutes);
echo.
echo // =======================
echo // 404 HANDLER
echo // =======================
echo app.use("*", (req, res) =^> {
echo   res.status(404).json({
echo     success: false,
echo     message: `Route not found: ${req.originalUrl}`,
echo   });
echo });
echo.
echo const PORT = process.env.PORT ^|^| 5000;
echo.
echo app.listen(PORT, () =^> {
echo   console.log(`Server running on port ${PORT}`);
echo });
) > server\src\app.js

echo.
echo ===============================
echo  FILE CREATED SUCCESSFULLY
echo ===============================

echo.
echo PUSHING TO GITHUB...

git add .
git commit -m "auto app.js setup"
git push

echo.
echo ===============================
echo  DONE ✅
echo ===============================

echo.
echo 👉 Render me jao:
echo 👉 Manual Deploy -> Deploy latest commit
echo.

pause