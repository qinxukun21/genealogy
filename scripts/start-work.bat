@echo off
chcp 65001 >nul
setlocal
set "PROJECT_DIR=%~dp0.."
set "CLAUDE_DIR=%USERPROFILE%\.claude"

echo.
echo === Start Work: pull code and chat history ===
echo.
echo [1/2] Pull code...
cd /d "%PROJECT_DIR%"
git pull --rebase
echo.
echo [2/2] Pull Claude chat history...
cd /d "%CLAUDE_DIR%"
if exist ".git" (
    git pull
) else (
    echo   ~/.claude is not a git repo, skip
)
echo.
echo === Done. Ready to work. ===
pause
