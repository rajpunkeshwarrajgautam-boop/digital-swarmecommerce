-- Create contact_messages table
-- Run this in your Supabase SQL Editor

create table if not exists public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  first_name text not null,
  last_name text,
  email text not null,
  message text not null,
  created_at timestamptz default now(),
  read boolean default false
);

-- Enable RLS
alter table public.contact_messages enable row level security;

-- Only admin (service role) can read messages
create policy "Service role can read all messages"
  on public.contact_messages for select
  using (auth.role() = 'service_role');

-- Anyone can insert a contact message
create policy "Anyone can submit a contact message"
  on public.contact_messages for insert
  with check (true);
