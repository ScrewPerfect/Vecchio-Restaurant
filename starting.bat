from pathlib import Path

bat = r"""@echo off
title Vecchio Restaurant Hi-Fi Prototype
color 0A

echo ==========================================
echo   Vecchio Restaurant Hi-Fi Prototype
echo ==========================================
echo.

REM Always run from the folder where this BAT file is located
cd /d "%~dp0"

REM Check package.json
if not exist "package.json" (
    echo [ERROR] package.json was not found.
    echo.
    echo Please place this BAT file inside the vecchio-hifi project folder.
    echo.
    pause
    exit /b 1
)

REM Check Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not added to PATH.
    echo.
    echo Please install Node.js LTS first:
    echo https://nodejs.org/
    echo.
    echo After installing Node.js, restart VS Code or Windows,
    echo then double-click this file again.
    echo.
    pause
    exit /b 1
)

REM Check npm
where npm.cmd >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm was not found.
    echo npm normally comes together with Node.js.
    echo.
    pause
    exit /b 1
)

echo Node version:
node -v
echo.
echo npm version:
call npm.cmd -v
echo.

REM Install dependencies only when node_modules is missing
if not exist "node_modules" (
    echo [INFO] First-time setup detected.
    echo [INFO] Installing project dependencies...
    echo.
    call npm.cmd install

    if errorlevel 1 (
        echo.
        echo [ERROR] npm install failed.
        echo Please check the error messages above.
        echo.
        pause
        exit /b 1
    )

    echo.
    echo [SUCCESS] Dependencies installed.
    echo.
) else (
    echo [INFO] Dependencies already installed.
    echo.
)

echo ==========================================
echo Starting Vecchio Restaurant Hi-Fi...
echo ==========================================
echo.
echo The local website address will appear below.
echo Usually: http://localhost:5173/
echo.
echo Keep this window OPEN while using the prototype.
echo Press Ctrl+C to stop the server.
echo.

call npm.cmd run dev

echo.
echo The development server has stopped.
pause
"""

path = Path("/mnt/data/Start_Vecchio_HiFi.bat")
path.write_text(bat, encoding="utf-8", newline="\r\n")
print(f"Created: {path}")
