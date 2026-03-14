@echo off
echo [ANTIGRAVITY] Shipping the UI/UX Overhaul...
cd /d "d:\AI AGENT\antigravity-ecommerce"
git add .
git commit -m "style: major UI/UX overhaul to fix typography, navigation, and spacing issues"
git push origin main
echo [ANTIGRAVITY] DEPLOY COMPLETE! Refresh digitalswarm.in in 2 minutes.
pause
