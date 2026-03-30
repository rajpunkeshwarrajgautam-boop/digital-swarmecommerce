# Architecture: Digital Swarm

## Logic Flow

- **Client**: Zustand (`store.ts`) handles cart, wishlist, and currency state.
- **Server**: Next.js Server Actions (`actions/`) handle writes to Supabase.
- **Webhook**: External gateways (Cashfree) ping `/api/webhook` to confirm payment events.

# Integrations: Digital Swarm

- **Supabase**: Primary DB (Postgres).
- **Cashfree**: Primary Indian Payment Gateway.
- **Stripe**: Secondary Global Payment Gateway.
- **Clerk**: Authentication and User Management.
- **Resend**: Email automation for order confirmation.

# Conventions: Digital Swarm

- **Naming**: PascalCase for components, camelCase for variables.
- **Styling**: Vanilla CSS (CSS Modules) + Tailwind utility for industrial aesthetics.
- **Colors**: Brutalist (Planet ONO (primary), Black/White gradients).

# Testing: Digital Swarm

- **Status**: Manual verification for each phase. No Jest/Vitest suite yet.
- **Performance**: LCP target (sub-1s).
- **Quality**: Strict linting rules (planned for this audit).
