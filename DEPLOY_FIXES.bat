@echo off
echo =======================================================
echo [ DIGITAL SWARM FORGE ] INITIATING GLOBAL SYNCHRONIZATION
echo =======================================================
echo.
echo Step 1: Running Pre-Flight TypeScript Compiler Check...
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo =======================================================
    echo [ ERROR ] TypeScript Compiler detected vulnerabilities!
    echo Please review the errors above. Deployment halted.
    echo =======================================================
    pause
    exit /b %errorlevel%
)
echo.
echo Step 2: Staging modernized architectural components...
git add .
echo.
echo Step 2: Committing the Gold Standard Protocol...
git commit -m "feat: GOLD STANDARD GLOBAL SYNC - ForgeToast, Branding & TS Hardening (v2.0)"
echo.
echo Step 3: Pushing to the Swarm Network (GitHub -^> Vercel)...
git push origin main --force
echo.
echo =======================================================
echo [ SUCCESS ] SYNCHRONIZATION COMPLETE.
echo [ DEPLOY ] Vercel production build has been triggered.
echo =======================================================
pause
