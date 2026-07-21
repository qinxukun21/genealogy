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
git status --porcelain | findstr "." >nul
if errorlevel 1 (
    call :retry git pull --rebase
) else (
    echo   Local has uncommitted changes, skip pull.
    echo   Please commit first: git add -A  then  git commit -m "..."
)

echo.
echo [2/2] Pull Claude chat history...
cd /d "%CLAUDE_DIR%"
if exist ".git" (
    git status --porcelain | findstr "." >nul
    if errorlevel 1 (
        call :retry git pull
    ) else (
        echo   Chat history has uncommitted changes, skip pull.
    )
) else (
    echo   ~/.claude is not a git repo, skip
)

echo.
echo === Done. Ready to work. ===
pause
goto :eof

:retry
set tries=0
:retry_loop
set /a tries+=1
%*
if not errorlevel 1 goto :eof
if %tries% LSS 5 (
    echo   [network unstable, retry %tries%/5 in 5s...]
    ping -n 6 127.0.0.1 >nul
    goto retry_loop
)
goto :eof
