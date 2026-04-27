---
id: 07-01
wave: 1
autonomous: true
gap_closure: true
requirements: [M7.1, M7.2]
---

# Plan: Merchant Backend & Telemetry

Implement the server-side infrastructure for real-time merchant performance tracking and product management.

## Objective
Connect the Merchant Dashboard to live Supabase data and provide a secure "Add Product" action for verified vendors.

## Tasks

<task>
<read_first>
- src/app/actions/admin.ts
- src/app/merchant/page.tsx
- src/lib/supabase.ts
</read_first>
<action>
Create `src/app/actions/merchant.ts` with:
- `createMerchantProduct(data: ProductInput)`: Inserts into `products` table with `merchant_id` from Clerk `currentUser().id` and `is_verified: false`.
- `getMerchantProducts()`: Fetches all products (verified and unverified) for the current merchant.
</action>
<acceptance_criteria>
- `src/app/actions/merchant.ts` exists and exports the required functions.
- `createMerchantProduct` uses `is_verified: false` for all new submissions.
</acceptance_criteria>
</task>

<task>
<read_first>
- src/app/api/products/route.ts
- src/app/actions/admin.ts
</read_first>
<action>
Create `src/app/api/merchant/stats/route.ts` with:
- GET handler that aggregates sales from `order_items` for the current merchant's products.
- Returns `revenue`, `sales_count`, `sync_velocity` (week-over-week calculation), and `trust_score`.
</action>
<acceptance_criteria>
- `/api/merchant/stats` returns a 200 JSON response with non-zero fields if data exists.
- Auth check ensures users can only see their own stats.
</acceptance_criteria>
</task>

## Verification
- Test `createMerchantProduct` via a manual script in `scratch/`.
- Curl `/api/merchant/stats` after authenticating.
