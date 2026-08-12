@echo off
echo ============================================================
echo HRES Simulator - Hybrid Renewable Energy System
echo ============================================================
echo.
echo Checking for Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found: 
node --version
echo.

echo Checking for dependencies...
if not exist "node_modules" (
    echo Installing dependencies... This may take a few minutes.
    echo.
    call npm run install:all
    echo.
    echo Dependencies installed successfully!
) else (
    echo Dependencies already installed.
)

echo.
echo ============================================================
echo Starting HRES Simulator...
echo ============================================================
echo.
echo Backend will start on: http://localhost:3001
echo Frontend will start on: http://localhost:5173
echo.
echo Press Ctrl+C to stop the servers.
echo ============================================================
echo.

call npm run dev
