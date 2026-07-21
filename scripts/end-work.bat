@echo off
chcp 65001 >nul
setlocal
set "PROJECT_DIR=%~dp0.."
set "CLAUDE_DIR=%USERPROFILE%\.claude"

echo.
echo === End Work: push code and chat history ===
echo.
echo [1/2] Push Claude chat history...
cd /d "%CLAUDE_DIR%"
if exist ".git" (
    git add -A
    git commit -m "sync claude history" 2>nul
    git pull --rebase 2>nul
    git push
) else (
    echo   ~/.claude is not a git repo, skip
)
echo.
echo [2/2] Push code...
cd /d "%PROJECT_DIR%"
git status --porcelain | findstr "." >nul
if errorlevel 1 (
    echo   No uncommitted changes.
) else (
    echo   WARNING: uncommitted changes detected. Run: git add -A  then  git commit -m "..."
)
git push
echo.
echo === Synced to cloud. ===
pause
