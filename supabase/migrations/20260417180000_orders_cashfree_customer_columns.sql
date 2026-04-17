-- One-shot alignment for stores that created `orders` before Cashfree / customer columns.
-- Safe to re-run (IF NOT EXISTS).
alter table public.orders add column if not exists cashfree_order_id text;
alter table public.orders add column if not exists payment_id text;
alter table public.orders add column if not exists customer_email text;
alter table public.orders add column if not exists customer_name text;
alter table public.orders add column if not exists customer_phone text;
alter table public.orders add column if not exists total_amount numeric(10, 2);
alter table public.orders add column if not exists affiliate_ref text;

create unique index if not exists orders_cashfree_order_id_key on public.orders (cashfree_order_id)
  where cashfree_order_id is not null;

NOTIFY pgrst, 'reload schema';
