@echo off
setlocal

:: 🛸 DIGITAL SWARM | VANILLA ASCI-ONLY DEPLOYMENT
:: -----------------------------------------------

cd /d "%~dp0"

echo [1/2] Initiating Swarm Packaging...
echo -----------------------------------
powershell -ExecutionPolicy Bypass -File .\package-assets.ps1
if errorlevel 1 (
    echo.
    echo [ERROR] Packaging failed.
    pause
    exit /b 1
)

echo.
echo [2/2] Synchronizing Database...
echo -----------------------------------
call npx ts-node update-download-urls.ts
if errorlevel 1 (
    echo.
    echo [ERROR] Database sync failed.
    pause
    exit /b 1
)

echo.
echo ===================================
echo DONE. All assets ready.
echo ===================================
pause
