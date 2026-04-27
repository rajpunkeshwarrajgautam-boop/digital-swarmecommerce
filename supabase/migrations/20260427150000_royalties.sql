-- Commission Protocol Update: Secondary Royalties
-- Purpose: Adds the creator_royalty column to track passive revenue for original merchants.

ALTER TABLE public.commissions
ADD COLUMN IF NOT EXISTS creator_royalty NUMERIC DEFAULT 0;

-- Indexing for royalty analytics
CREATE INDEX IF NOT EXISTS idx_commissions_royalty ON public.commissions (creator_royalty) WHERE creator_royalty > 0;
