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

-- Only admin (service role) can read/manage messages
-- No public policies (insert or select)
-- This ensures all contact submissions MUST go through our API with Rate Limiting.
