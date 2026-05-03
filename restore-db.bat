@echo off
setlocal
cd /d "%~dp0"

echo This will restore a backup into student-fees-management.
echo Existing records with the same IDs may be overwritten.
echo.
set /p BACKUP_PATH=Enter backup folder path or .archive file path: 

if "%BACKUP_PATH%"=="" (
  echo No backup path entered.
  pause
  exit /b 1
)

where mongorestore >nul 2>nul
if %errorlevel%==0 (
  mongorestore --uri="mongodb://127.0.0.1:27017" --nsInclude="student-fees-management.*" "%BACKUP_PATH%"
  echo Restore complete.
  pause
  exit /b
)

where docker >nul 2>nul
if %errorlevel%==0 (
  docker cp "%BACKUP_PATH%" feespro-mongo:/tmp/feespro-restore.archive
  docker exec feespro-mongo mongorestore --archive=/tmp/feespro-restore.archive --nsInclude="student-fees-management.*"
  echo Restore complete.
  pause
  exit /b
)

echo MongoDB restore tool not found. Install MongoDB Database Tools or use Docker.
pause
