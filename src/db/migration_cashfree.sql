-- Add Cashfree specific columns to orders table
alter table public.orders 
add column if not exists cashfree_order_id text unique,
add column if not exists payment_id text,
add column if not exists customer_email text;

-- Add fulfillment columns to products table if missing
alter table public.products
add column if not exists download_url text,
add column if not exists install_guide text;
