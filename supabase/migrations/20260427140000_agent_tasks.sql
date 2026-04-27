-- Agent Autonomy: Task Command System
-- Purpose: Stores dynamic goals and execution states for Digital Swarm agents.

CREATE TYPE task_status AS ENUM ('queued', 'processing', 'completed', 'failed');

CREATE TABLE IF NOT EXISTS public.agent_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id TEXT NOT NULL, -- Product ID
    owner_id TEXT NOT NULL, -- Clerk User ID
    goal TEXT NOT NULL, -- Natural language command
    status task_status DEFAULT 'queued',
    steps JSONB DEFAULT '[]'::jsonb, -- AI-decomposed steps
    result TEXT, -- Final output
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Indexing for real-time tracking
CREATE INDEX IF NOT EXISTS idx_agent_tasks_owner_id ON public.agent_tasks (owner_id);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_status ON public.agent_tasks (status);

-- Security: Owners can manage their tasks.
ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their agent tasks" ON public.agent_tasks
    FOR SELECT
    USING (auth.uid()::text = owner_id);

CREATE POLICY "Owners can create tasks for their agents" ON public.agent_tasks
    FOR INSERT
    WITH CHECK (auth.uid()::text = owner_id);

CREATE POLICY "Owners can delete their own tasks" ON public.agent_tasks
    FOR DELETE
    USING (auth.uid()::text = owner_id);
