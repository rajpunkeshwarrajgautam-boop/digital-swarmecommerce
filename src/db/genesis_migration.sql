-- ============================================================
-- DIGITAL SWARM | Genesis Migration (Milestone 13.3)
-- Finalizes the schema for Mainnet Migration
-- ============================================================

-- ── 1. Digital Tokens Table (Bridging Support) ──────────────────────────────
create table if not exists public.digital_tokens (
  id           uuid default gen_random_uuid() primary key,
  metadata     jsonb default '{}'::jsonb,
  owner_id     text not null, -- Clerk User ID or 'SYSTEM_BRIDGE'
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Enable RLS
alter table public.digital_tokens enable row level security;

-- Only authenticated users can see tokens (handled via API/Service Role usually)
-- For Genesis, we allow public read if the token is public-facing
create policy "Tokens are viewable by everyone" on public.digital_tokens for select using (true);

-- ── 2. Update Roadmap State ──────────────────────────────────────────────────
-- We could potentially have a `swarm_state` table for this, but for now we rely on ROADMAP.md

-- ── 3. Final Indices ─────────────────────────────────────────────────────────
create index if not exists digital_tokens_owner_id_idx on public.digital_tokens (owner_id);
create index if not exists digital_tokens_updated_at_idx on public.digital_tokens (updated_at desc);
