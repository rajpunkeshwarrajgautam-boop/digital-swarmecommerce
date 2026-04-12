-- Merchant partner applications (matches src/app/api/merchant/apply/route.ts)
-- Run in Supabase SQL Editor, or: npm run db:apply-merchant-applications

create table if not exists public.merchant_applications (
  id              uuid default gen_random_uuid() primary key,
  node_name       text not null,
  specialization  text not null,
  portfolio_url   text not null,
  description     text not null,
  contact_email   text not null,
  status          text not null default 'pending',
  created_at      timestamptz not null default now()
);

create index if not exists merchant_applications_status_idx
  on public.merchant_applications (status);

create index if not exists merchant_applications_created_at_idx
  on public.merchant_applications (created_at desc);

alter table public.merchant_applications enable row level security;

-- Inserts go only through your Next.js API (service role). No anon/authenticated policies.
