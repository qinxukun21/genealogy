@echo off
chcp 65001 >nul
cd /d "%~dp0"
bash sync-all.sh start
pause
