-- Update products table for Hyper-Growth Expansion
alter table public.products 
add column if not exists demo_url text,
add column if not exists install_guide text,
add column if not exists scarcity_stock integer default null,
add column if not exists is_featured boolean default false;

-- Create reviews table
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade,
  user_id text not null, -- Clerk User ID
  user_name text not null,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  images text[],
  verified boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS for reviews
alter table public.reviews enable row level security;

-- Everyone can read reviews
create policy "Public reviews are viewable by everyone" 
on public.reviews for select using (true);

-- Authenticated users (handled via API/Service Role) can post reviews
-- We'll handle review creation via `/api/reviews` with Clerk Auth check.
