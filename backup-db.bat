@echo off
setlocal
cd /d "%~dp0"

if not exist backups mkdir backups
for /f "tokens=1-4 delims=/ " %%a in ("%date%") do set TODAY=%%d-%%b-%%c
for /f "tokens=1-2 delims=: " %%a in ("%time%") do set NOW=%%a%%b
set BACKUP_DIR=backups\feespro-%TODAY%-%NOW%

where mongodump >nul 2>nul
if %errorlevel%==0 (
  mongodump --uri="mongodb://127.0.0.1:27017/student-fees-management" --out="%BACKUP_DIR%"
  echo Backup saved to %BACKUP_DIR%
  pause
  exit /b
)

where docker >nul 2>nul
if %errorlevel%==0 (
  docker exec feespro-mongo mongodump --db student-fees-management --archive=/tmp/feespro.archive
  docker cp feespro-mongo:/tmp/feespro.archive "%BACKUP_DIR%.archive"
  echo Backup saved to %BACKUP_DIR%.archive
  pause
  exit /b
)

echo MongoDB backup tool not found. Install MongoDB Database Tools or use Docker.
pause
