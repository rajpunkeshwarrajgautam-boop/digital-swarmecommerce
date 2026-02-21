# Implementation Plan: Digital Swarm Commerce

**Status**: Hyper-Growth Expansion (Phase 6)
**Goal**: Transform Digital Swarm into the premier boutique for professional digital assets with elite conversion features and next-gen tech.

---

## 1. Design System (Digital Swarm)

- **Brand Archetype**: The Alchemist / The Visionary.
- **Color Palette**:
  - **Primary**: `#F5F5DC` (Cream/Gold)
  - **Accent**: `#FFD700` (Gold), `#000000` (Black).
  - **Background**: Deep Space (`#000000`).
- **Signature Effects**:
  - **The Quantum Unboxing**: SVG turbulence filters for product materialization.
  - **Holographic Gradients**: CSS-driven iridescent overlays.
  - **3D Swarm UI**: Interactive Z-plane depth animations.

## 2. Component Architecture

### Expansion Features (In Progress)

- `BundleBuilder`: Interactive UI for picking 3 assets with dynamic discounting.
- `ProductPreview`: Live Demo integration with iframe/modal.
- `ReviewSystem`: Verified purchase reviews with media attachments.
- `AIHiveMind`: Gemini-powered support agent for technical troubleshooting.
- `ScarcityEngine`: Real-time stock counters and countdown timers.
- `ThreeDBox`: Interactive 3D holographic product visuals.

## 3. Data Structure (Supabase / Postgres)

### Existing Tables

- **`public.products`**: Extended with `demo_url`, `install_guide`, `stock_limit`.
- **`public.orders`**: Standard order tracking.
- **`public.order_items`**: Order line items.

### New Tables

- **`public.reviews`**: `id`, `product_id`, `user_id`, `rating`, `comment`, `images` (text[]), `verified` (bool).
- **`public.bundle_promotions`**: `id`, `name`, `discount_percentage`, `active` (bool).

---

## 4. Execution Roadmap

### Phase 1-5: Base Infrastructure (Completed)

- [x] Foundation setup & User Auth.
- [x] Product Display & Secure Checkout.
- [x] Security Hardening (API Auth, RLS, Rate Limiting).
- [x] Rebranding to **Digital Swarm**.

### Phase 6: Hyper-Growth Expansion (Active)

#### Task 6.1: Build Your Own Bundle

- [ ] Create `/bundle-builder` page.
- [ ] Implement selection logic & dynamic pricing calculator.
- [ ] Add "Bundle Checkout" flow.

#### Task 6.2: Enhanced Product Experience

- [ ] Add `Live Preview` & `Documentation Snippet` to Product Details.
- [ ] Implement `ScarcityEngine` (visual timers/counters).
- [ ] Design & Implement `ThreeDBox` holographic visuals.

#### Task 6.3: Trust & Support Ecosystem

- [ ] Build User Review system with Supabase Storage for media.
- [ ] Integrate Gemini AI Chatbot (`AI Hive-Mind`).

---

## 5. Final Review & Polish

- [ ] Performance audit for 3D assets.
- [ ] Final security audit of new API endpoints.
- [ ] SEO optimization for bundle pages.
