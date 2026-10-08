@echo off
title Launching Nano ADB Desktop Application...
cd /d "%~dp0"
echo Starting Nano ADB Anti-Detect Browser...
if exist "node_modules\electron\dist\electron.exe" (
  ".\node_modules\electron\dist\electron.exe" main.js
) else (
  npx --yes electron main.js
)
pause
