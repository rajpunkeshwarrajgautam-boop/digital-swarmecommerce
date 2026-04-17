-- Align production orders with create-order + webhook (commission attribution).
alter table public.orders
  add column if not exists total_amount numeric(10, 2),
  add column if not exists affiliate_ref text;

-- Backfill total_amount from total where missing (one-time safe for existing rows).
update public.orders
set total_amount = coalesce(total_amount, total)
where total_amount is null and total is not null;
