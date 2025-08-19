@echo off
title Fotografi App - Starter
cd /d %~dp0
echo Installing dependencies (one-time)...
call npm install
if %errorlevel% neq 0 (
  echo ERROR during npm install. Press any key to close.
  pause >nul
  exit /b 1
)
echo.
echo Starting development server...
call npm run dev
