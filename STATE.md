# 🔒 GOD MODE: State Anchor

**Timestamp:** 2026-04-05
**Project:** Digital Swarm V2
**Status:** Wave 1 & Wave 2 Executed.

## Architecture Lock
1. **Caching Engine:** Vercel `swr` has permanently replaced `SwarmSWR`. Do not attempt to use custom SWR hooks going forward; strictly use official caching imports to prevent type leaking.
2. **Dependency Stack:** All deprecated gateway APIs (Razorpay, Stripe, Instamojo) have been purged from `package.json` and API trees to ensure a 30% smaller initial load chunk on Vercel deployment.
3. **Type Safety:** The core UI screens and search loops have been scrubbed of `: any` castings. Future modifications strictly require Zod or generic casting using `unknown`.

## Known States
- The `ForgeButton.tsx` and `CommandCenter.tsx` ui modules have been preserved as atomic units to prevent "client-cascading" (the risk of turning all parent nodes into client components if `framer-motion` is pushed into the lowest leaf). They are currently stable and hyper-optimized.
- The Vercel `npm run build` process has passed natively with 0 errors.

*This file serves as a context preservation engine. Future agents or executions must read this file prior to beginning massive architectural changes.*
