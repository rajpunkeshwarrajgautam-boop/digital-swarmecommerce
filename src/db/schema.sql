-- Create products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  category text not null,
  image text not null,
  in_stock boolean default true,
  rating numeric(3, 1) default 0,
  features text[],
  specs jsonb,
  created_at timestamptz default now()
);

-- Create orders table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id text not null, -- Clerk User ID
  total numeric(10, 2) default 0,
  status text default 'pending', -- pending, paid, shipped, delivered
  created_at timestamptz default now()
);

-- Create order items table
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity integer not null default 1,
  price numeric(10, 2) not null
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Create policies
-- Everyone can read products
create policy "Public products are viewable by everyone" 
on public.products for select using (true);

-- Orders: No public insert/select. Only Service Role (Backend) can manage.
-- This prevents database pollution and unauthorized data access.
-- We do NOT add a policy for service_role as it bypasses RLS by default.

-- Users can view their own orders (If using Supabase Auth, otherwise handle via API)
-- create policy "Users can view own orders" 
-- on public.orders for select using (auth.uid() = user_id);
