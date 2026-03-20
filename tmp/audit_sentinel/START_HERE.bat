@echo off
setlocal
echo ==========================================================
echo           DIGITAL SWARM: SENTINEL RESEARCH UPLINK
echo ==========================================================
echo [STATUS] INITIALIZING AI AGENT ARCHITECTURE...

:: Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Please install Python from: https://www.python.org/
    pause
    exit /b
)

:: Activate and run
echo [STATUS] UPLINK ESTABLISHED. LAUNCHING DASHBOARD...
python -m pip install -r requirements.txt --quiet
python sentinel_researcher.py
pause
