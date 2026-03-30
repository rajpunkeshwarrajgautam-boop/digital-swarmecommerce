# Structure: Digital Swarm

## File Organization

- `/src/app`: Next.js App Router (Pages, API Routes).
- `/src/components`: UI Components (UI, Layout, Business Logic).
- `/src/lib`: Logic, Stores, Utility functions.
- `/src/db`: Database schemas, migrations (Supabase).
- `/src/types`: Global TypeScript interfaces.
- `/src/setup`: Initial environment-level configuration.

## Component Categories

1. **Atomics (`/src/components/ui`)**: Low-level UI primitives (Button, Input, Card).
2. **Business Modules (`/src/components/*`)**: Context-aware features (Cart, Products, Checkout).
3. **Layout Sections (`/src/app/layout.tsx`)**: Global structural components (Header, Footer).

## API Layer

- `/src/app/api`: Serverless functions (Webhooks, Orders, Cart Tracking).
- `/src/app/actions`: Next.js Server Actions (Admin CRUD, Payments).
