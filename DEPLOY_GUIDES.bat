@echo off
echo [DIGITAL SWARM] Deploying post-purchase installation guides...
cd /d "d:\AI AGENT\antigravity-ecommerce"
git add public/downloads/swarm-legal-optimized.html ^
        public/downloads/swarm-property-optimized.html ^
        public/downloads/swarm-capital-optimized.html ^
        public/downloads/swarm-voice.html ^
        public/downloads/sentinel-seo-optimized.html ^
        public/downloads/swarm-content-architect.html ^
        public/downloads/swarm-uiux-auditor.html ^
        public/downloads/ai-services-agency.html ^
        public/downloads/swarm-sales-optimized.html ^
        public/downloads/swarm-finance-optimized.html ^
        public/downloads/swarm-cinema.html ^
        public/downloads/sentinel-research-optimized.html ^
        public/downloads/swarm-talent-optimized.html ^
        public/downloads/sentinel-voyager.html ^
        src/lib/data.ts
git commit -m "feat: add comprehensive post-purchase installation guides for all 18 products"
git push
echo Done! Vercel will auto-deploy in ~60 seconds.
pause
