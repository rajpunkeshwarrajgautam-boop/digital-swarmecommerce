-- --------------------------------------------------------------------------
-- 🌌 SUPABASE DIGITAL SWARM | MILESTONE EVOLUTION
-- --------------------------------------------------------------------------
-- Adds columns for Milestone 11 (Tiered Scarcity), Milestone 12 (Neural Analytics), 
-- and Milestone 13 (Optimized Tracking) to the production 'products' table.
-- --------------------------------------------------------------------------

DO $$ 
BEGIN
    -- 1. Milestone 11: Scarcity & Tiered Logic
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='scarcity_stock') THEN
        ALTER TABLE public.products ADD COLUMN scarcity_stock INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_featured') THEN
        ALTER TABLE public.products ADD COLUMN is_featured BOOLEAN DEFAULT false;
    END IF;

    -- 2. Milestone 12: Neural Swarm Analytics
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='swarm_score') THEN
        ALTER TABLE public.products ADD COLUMN swarm_score INTEGER DEFAULT 85;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='match_density') THEN
        ALTER TABLE public.products ADD COLUMN match_density INTEGER DEFAULT 75;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='aura') THEN
        ALTER TABLE public.products ADD COLUMN aura TEXT DEFAULT 'NEURAL_LINK_ACTIVE';
    END IF;

    -- 3. Milestone 13: Optimized Tracking
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='original_price') THEN
        ALTER TABLE public.products ADD COLUMN original_price INTEGER;
    END IF;

END $$;

-- --------------------------------------------------------------------------
-- INDEXING FOR NEURAL PERFORMANCE
-- --------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_swarm_score ON public.products(swarm_score);
CREATE INDEX IF NOT EXISTS idx_products_aura ON public.products(aura);
