-- Fulfillment links (ZIP / external). Safe to re-run.
alter table public.products add column if not exists download_url text;
