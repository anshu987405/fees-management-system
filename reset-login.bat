@echo off
cd /d "%~dp0"
echo Resetting default admin login without deleting students or payments...
node server/src/resetAdmin.js
pause
