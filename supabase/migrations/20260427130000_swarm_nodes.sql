-- Swarm Registry: Public Node Profiles
-- Purpose: Stores public-facing metadata for Merchants and Affiliates.

CREATE TABLE IF NOT EXISTS public.swarm_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL, -- Clerk User ID
    node_name TEXT NOT NULL, -- Public Alias (e.g., "Cyber-Dynamics")
    node_type TEXT NOT NULL CHECK (node_type IN ('merchant', 'affiliate', 'hybrid')),
    bio TEXT,
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    trust_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Indexing for directory search
CREATE INDEX IF NOT EXISTS idx_swarm_nodes_user_id ON public.swarm_nodes (user_id);
CREATE INDEX IF NOT EXISTS idx_swarm_nodes_type ON public.swarm_nodes (node_type);
CREATE INDEX IF NOT EXISTS idx_swarm_nodes_verified ON public.swarm_nodes (is_verified);

-- Security: Public can READ, but only the owner can UPDATE.
ALTER TABLE public.swarm_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view swarm nodes" ON public.swarm_nodes
    FOR SELECT
    USING (true);

CREATE POLICY "Nodes can update their own profile" ON public.swarm_nodes
    FOR UPDATE
    USING (auth.uid()::text = user_id);

-- Note: Initial creation will happen via a server action when a merchant/affiliate first signs up.
