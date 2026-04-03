@echo off
setlocal

echo [DIGITAL SWARM] Initiating Full Logic Deployment...

:: --- STAGE 1: CORE LOGIC & API ---
echo [1/4] Staging API Routes and Logic...
git add src/app/api/chat/route.ts
git add src/app/api/reviews/route.ts
git add src/app/api/reviews/upload/route.ts
git add src/lib/env.ts
git add src/lib/supabase.ts
git add src/lib/rate-limit.ts

:: --- STAGE 2: COMPONENTS ---
echo [2/4] Staging UI Components...
git add src/components/products/ReviewSystem.tsx
git add src/components/chat/HiveMindChat.tsx

:: --- STAGE 3: CONFIG ---
echo [3/4] Staging Configuration Files...
git add .env.example
git add DEPLOY_SYSTEMS.bat

:: --- STAGE 4: PUSH ---
echo [4/4] Finalizing Deployment Protocol...
git commit -m "feat: complete AI Chat (Gemini 2.0) and Review System (Storage Upload) integration"
git push origin main

echo.
echo [COMPLETE] Deployment sequence executed.
echo Vercel will auto-deploy in ~60 seconds.
echo.
pause
