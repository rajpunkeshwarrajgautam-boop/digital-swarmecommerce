# Concerns: Digital Swarm

## Technical Identifiers

1. **Type Safety Leakage (Critical)**: Found 13+ instances of `: any` in critical business logic (`stripe.ts`, `MemoryStore.ts`, `AffiliateDashboardClient.tsx`). This leads to "silent" runtime crashes during production loads.
2. **Environment Resiliency (Major)**: Missing robust validation for `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Some components only use a basic `console.warn`.
3. **Transaction Reliability (Major)**: Webhook logic in `/api/webhook/cashfree` (from Milestone 4) needs verification for idempotency in edge case failure scenarios.
4. **Logic Fragility (Minor)**: API routes handle errors with a generic `err.message` which might leak private configuration details in development mode.

## Architectural Debt

- **Hardcoded Elements**: Occasional hardcoded currency symbols outside the central formatting utility.
- **Error Boundaries**: Lack of React Error Boundaries in the main `<Layout>`, causing full-page crashes if a component fails to hydrate.

## Tech Debt

- Outdated dependencies if not updated from Next.js 15 template.
- Direct usage of `window as any` in `CheckoutPage` for Cashfree SDK.
