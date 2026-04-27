---
id: 07-02
wave: 2
autonomous: true
gap_closure: true
requirements: [M7.2, M7.3]
---

# Plan: Merchant Experience & Add Product Flow

Build the high-fidelity UI for product submissions and connect the dashboard to live telemetry.

## Objective
Implement a "Planet ONO" brutalist submission form and bridge the dashboard metrics to the live stats API.

## Tasks

<task>
<read_first>
- src/app/merchant/page.tsx
- src/components/ui/Button.tsx
</read_first>
<action>
Update `src/app/merchant/page.tsx`:
- Use `useSwarmSWR` to fetch from `/api/merchant/stats`.
- Map the response to the `StatsCard` components.
- Replace the placeholder "Add_New_Product" button with a Next.js `Link` to `/merchant/add`.
- Update the product table to display a "Status" badge (Live/Pending) based on `isVerified`.
</action>
<acceptance_criteria>
- Dashboard shows live revenue/sales numbers.
- Products have a visible status badge (Gold for Live, Gray for Pending).
</acceptance_criteria>
</task>

<task>
<read_first>
- src/app/merchant/page.tsx
- src/app/affiliate/page.tsx (for form reference)
</read_first>
<action>
Create `src/app/merchant/add/page.tsx`:
- Build a brutalist form with `border-4 border-white` and `rounded-none`.
- Use `Industrial Gold` (`hsl(45, 100%, 50%)`) for labels and buttons.
- Connect to `createMerchantProduct` server action.
- Add success/error toast notifications.
</action>
<acceptance_criteria>
- `/merchant/add` is accessible and follows the Planet ONO aesthetic.
- Form submission redirects back to `/merchant` on success.
</acceptance_criteria>
</task>

## Verification
- Manual visual check of the "Add Product" form.
- Verify status badges update after a mock product is added.
