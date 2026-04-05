-- Wave 4: Email Drip Sequence Table
-- Run this in the Supabase SQL Editor for digitalswarm project

create table if not exists public.email_sequences (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  step integer not null default 0,
  next_send_at timestamptz not null default now(),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for efficient cron processing
create index if not exists idx_email_sequences_due
  on public.email_sequences (next_send_at)
  where completed = false;

-- Row Level Security
alter table public.email_sequences enable row level security;

-- No public reads — only service role can access
create policy "Service role only" on public.email_sequences
  using (false)
  with check (false);

-- Trigger to auto-update updated_at
create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_email_sequences_updated_at
  before update on public.email_sequences
  for each row execute function update_updated_at_column();
