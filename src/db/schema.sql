-- ============================================================
-- Digital Swarm — Schema & Seed Migration
-- Run this in Supabase SQL Editor to set up the full schema
-- Last updated: March 2026
-- ============================================================

-- ── 1. Products Table ────────────────────────────────────────────────────────

create table if not exists public.products (
  id             uuid default gen_random_uuid() primary key,
  name           text not null unique,           -- Unique constraint enables name-based upserts
  description    text,
  price          numeric(10, 2) not null,
  category       text not null,
  image          text not null,
  in_stock       boolean default true,
  rating         numeric(3, 1) default 5.0,
  features       text[],
  specs          jsonb,
  download_url   text,                           -- Fulfillment link (zip / pdf)
  install_guide  text,                           -- Documentation URL
  is_featured    boolean default false,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- Add missing columns safely (if running on existing schema)
alter table public.products add column if not exists download_url   text;
alter table public.products add column if not exists install_guide  text;
alter table public.products add column if not exists is_featured    boolean default false;
alter table public.products add column if not exists updated_at     timestamptz default now();

-- ── 2. Orders Table ──────────────────────────────────────────────────────────

create table if not exists public.orders (
  id                 uuid default gen_random_uuid() primary key,
  user_id            text not null,            -- Clerk user ID or email (guest)
  customer_email     text,
  total              numeric(10, 2) default 0,
  status             text default 'pending',   -- pending | paid | failed | refunded
  cashfree_order_id  text,                     -- Also used for Plural/Pine Labs order IDs
  payment_id         text,                     -- Gateway transaction ID
  customer_name      text,
  customer_phone     text,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

-- Add missing columns safely
alter table public.orders add column if not exists customer_email    text;
alter table public.orders add column if not exists cashfree_order_id text;
alter table public.orders add column if not exists payment_id         text;
alter table public.orders add column if not exists customer_name      text;
alter table public.orders add column if not exists customer_phone     text;
alter table public.orders add column if not exists updated_at        timestamptz default now();

-- ── 3. Order Items Table ─────────────────────────────────────────────────────

create table if not exists public.order_items (
  id          uuid default gen_random_uuid() primary key,
  order_id    uuid references public.orders(id) on delete cascade,
  product_id  text not null,   -- text to support both UUID and slug-based IDs
  quantity    integer not null default 1,
  price       numeric(10, 2) not null,
  created_at  timestamptz default now()
);

-- ── 4. Contact Messages Table ────────────────────────────────────────────────

create table if not exists public.contact_messages (
  id         uuid default gen_random_uuid() primary key,
  first_name text not null,
  last_name  text,
  email      text not null,
  message    text not null,
  status     text default 'new',  -- new | read | replied
  created_at timestamptz default now()
);

-- ── 5. Merchant Applications (partner onboarding) ───────────────────────────

create table if not exists public.merchant_applications (
  id              uuid default gen_random_uuid() primary key,
  node_name       text not null,
  specialization  text not null,
  portfolio_url   text not null,
  description     text not null,
  contact_email   text not null,
  status          text not null default 'pending',
  created_at      timestamptz not null default now()
);

create index if not exists merchant_applications_status_idx
  on public.merchant_applications (status);

create index if not exists merchant_applications_created_at_idx
  on public.merchant_applications (created_at desc);

-- ── 6. Product Reviews Table ────────────────────────────────────────────────
create table if not exists public.reviews (
  id         uuid default gen_random_uuid() primary key,
  product_id text not null,
  user_name  text not null,
  rating     integer not null check (rating >= 1 and rating <= 5),
  comment    text not null,
  verified   boolean default false,
  created_at timestamptz default now()
);

-- ── 7. Row Level Security ────────────────────────────────────────────────────

alter table public.products         enable row level security;
alter table public.orders           enable row level security;
alter table public.order_items      enable row level security;
alter table public.contact_messages  enable row level security;
alter table public.merchant_applications enable row level security;
alter table public.reviews          enable row level security;

-- Products & Reviews: public read
drop policy if exists "Public products are viewable by everyone" on public.products;
create policy "Public products are viewable by everyone" on public.products for select using (true);

drop policy if exists "Public reviews are viewable by everyone" on public.reviews;
create policy "Public reviews are viewable by everyone" on public.reviews for select using (true);

-- Orders and contact messages: service role only (bypasses RLS)
-- No public read/write policies. Backend uses supabaseAdmin (service role).

-- ── 8. Updated_at auto-trigger ───────────────────────────────────────────────

create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
  before update on public.products
  for each row execute procedure public.handle_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
  before update on public.orders
  for each row execute procedure public.handle_updated_at();

-- ── 9. Full Product Catalog Seed ─────────────────────────────────────────────
-- Uses INSERT ... ON CONFLICT (name) DO UPDATE for idempotent re-runs.

insert into public.products (name, description, price, category, image, in_stock, rating, features, specs, download_url)
values
  (
    'Sentinel Research Infiltrator (AI Agent)',
    'An autonomous deep-research AI agent. Give it a topic and it infiltrates the surface and deep web to synthesize a professional intelligence report — automatically.

🚀 SETUP GUIDE:
1. Requires Python 3.10+
2. Install: pip install -r requirements.txt
3. Add OPENAI_API_KEY + FIRECRAWL_API_KEY to .env
4. Run: python sentinel_researcher.py',
    1000.00,
    'AI Agents',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
    true,
    5.0,
    ARRAY['Autonomous Deep Web Scrape', 'Dual-Agent Synthesis Architecture', 'Cyberpunk Streamlit UI', 'OpenAI Agents SDK', 'Full Source Code Included'],
    '{"API": "OpenAI, Firecrawl", "Format": "Python / Source", "License": "Master Resell Rights (MRR)", "Support": "Documentation Provided", "Components": "2 Agents + UI"}'::jsonb,
    '/downloads/sentinel-research.zip'
  ),
  (
    'Swarm Corporate Growth Team (Multi-Agent)',
    'An elite multi-agent sales intelligence team. Coordinates Lead Infiltrators, Outreach Strategists, and Closing Architects for enterprise-grade sales pipelines.

🚀 SETUP GUIDE:
1. Requires Python 3.10+, CrewAI / LangChain
2. Install: pip install -r requirements.txt
3. Add GEMINI_API_KEY to .env
4. Run: python agent.py',
    1999.00,
    'AI Agents',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60',
    true,
    5.0,
    ARRAY['Lead Scoring Engine', 'Multi-Agent Coordination', 'CRM Integration Ready', 'Automated Outreach Workflows', 'Full Source Code Included'],
    '{"API": "OpenAI / Claude", "Format": "Python / CrewAI", "License": "Master Resell Rights", "Support": "Priority Support", "Components": "3+ Agents"}'::jsonb,
    '/downloads/swarm-sales.zip'
  ),
  (
    'Swarm Finance Infiltrator (xAI Oracle)',
    'A high-speed financial market oracle powered by xAI Grok. Synthesizes real-time stock, crypto, and market data into actionable trading intelligence.

🚀 SETUP GUIDE:
1. Requires Python 3.11, Agno Framework
2. Install: pip install -r requirements.txt
3. Add XAI_API_KEY to .env
4. Run: python src/agents/finance_agent.py',
    2499.00,
    'AI Agents',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60',
    true,
    5.0,
    ARRAY['xAI Grok Intelligence', 'Real-time Stock/Crypto Uplink', 'Technical Analysis Engine', 'Market Sentiment Scraping', 'Full Source Code Included'],
    '{"API": "xAI, YFinance", "Format": "Python / Agno", "License": "Master Resell Rights", "Support": "Priority Support", "Components": "Finance Oracle"}'::jsonb,
    '/downloads/swarm-finance.zip'
  ),
  (
    'Swarm Cinema Infiltrator (AI Movie Producer)',
    'A multi-agent film production engine. Coordinates Script Architects and Talent Oracles to produce movie blueprints and casting strategies using live search data.

🚀 SETUP GUIDE:
1. Requires Python 3.10, Streamlit, Agno
2. Install: pip install -r requirements.txt
3. Add GOOGLE_API_KEY + SERP_API_KEY to .env
4. Run: streamlit run agent.py',
    2999.00,
    'AI Agents',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=60',
    true,
    5.0,
    ARRAY['Multi-Agent Film Orchestration', 'Live Talent Scouting (SerpApi)', 'Cyberpunk Narrative Engine', '3-Act Structure Synthesis', 'Full Source Code Included'],
    '{"API": "Gemini, SerpApi", "Format": "Python / Agno", "License": "Master Resell Rights", "Support": "Priority Support", "Components": "Script + Casting + Producer"}'::jsonb,
    '/downloads/swarm-cinema.zip'
  ),
  (
    'Swarm Browser MCP (Openwork Automation)',
    'An infinite-canvas browser automation agent built on Model Context Protocol. Operates any web interface autonomously from natural language objectives.

🚀 SETUP GUIDE:
1. Requires Node.js v20+
2. Install: npm install
3. Add ANTHROPIC_API_KEY to .env
4. Run: npm start',
    3499.00,
    'AI Agents',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
    true,
    5.0,
    ARRAY['Infinite Canvas Automation', 'Model Context Protocol (MCP)', 'Vision-based DOM Parsing', 'Headless Chrome Support', 'Full Source Code Included'],
    '{"API": "Claude / MCP", "Format": "TypeScript / Node.js", "License": "Master Resell Rights", "Support": "Priority Support", "Components": "MCP Server + Agent"}'::jsonb,
    '/downloads/swarm-browser.zip'
  ),
  (
    'Swarm Deep Research Agent (Llama3 Local)',
    'A secure, air-gapped deep research agent. Uses local Llama3 / DeepSeek models via Ollama to crawl and synthesize multi-source data with zero data leakage.

🚀 SETUP GUIDE:
1. Requires Python 3.11 + Ollama
2. Install: pip install -r requirements.txt
3. Start Ollama with Llama 3.1 or DeepSeek
4. Run: python local_rag_agent.py',
    1499.00,
    'AI Agents',
    'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&auto=format&fit=crop&q=60',
    true,
    4.9,
    ARRAY['100% Local Inference', 'Air-Gapped Privacy', 'Multi-Source Document Synthesis', 'Agentic RAG Pipeline', 'Full Source Code Included'],
    '{"API": "Ollama (Local)", "Format": "Python", "License": "Master Resell Rights", "Support": "Priority Support", "Components": "RAG Pipeline"}'::jsonb,
    '/downloads/swarm-deepres.zip'
  ),
  (
    'Swarm Multimodal UI/UX Engine (Nano Banana)',
    'An elite design feedback agent. Takes screenshots or Figma exports and outputs structured CSS code and UX improvement plans instantly.

🚀 SETUP GUIDE:
1. Requires Python 3.10, Streamlit + Nano Banana
2. Install: pip install -r requirements.txt
3. Add GEMINI_API_KEY to .env
4. Run: streamlit run app.py',
    2799.00,
    'AI Agents',
    'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=60',
    true,
    4.8,
    ARRAY['Multimodal Vision Analysis', 'Nano Banana Pro Integration', 'Automated Code Generation', 'Figma to Code Pipeline', 'Full Source Code Included'],
    '{"API": "Gemini Vision", "Format": "Python / Streamlit", "License": "Master Resell Rights", "Support": "Priority Support", "Components": "UI/UX Vision Agent"}'::jsonb,
    '/downloads/swarm-uiux.zip'
  ),
  (
    '1000 Manually Tested Web Applications',
    'A comprehensive collection of 1,000 manually tested web applications, including 20 free premium bonuses. Perfect for developers seeking real-world inspiration and production-ready codebases.',
    200.00,
    'Web Development',
    'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=60',
    true,
    4.8,
    ARRAY['1,000+ Tested Applications', '20 Premium Bonuses Included', 'Diverse Use Cases', 'Clean Codebase', 'Instant Download'],
    '{"Format": "PDF / Source Code", "Size": "1.2 GB", "License": "Personal & Commercial Use", "Compatibility": "Universal", "Updates": "Lifetime Access"}'::jsonb,
    '/downloads/1000-web-apps.pdf'
  ),
  (
    'Ultimate Web Development Bundle',
    'The ultimate toolkit for web developers — curated templates, scripts, UI kits, and essential resources to ship projects faster.',
    200.00,
    'Bundles',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
    true,
    4.9,
    ARRAY['Premium HTML/CSS Templates', 'High-Quality UI Kits', 'Scripts & Plugins', 'Developer Tools', 'Regular Updates'],
    '{"Format": "ZIP / PDF", "Components": "500+", "Technologies": "HTML, CSS, JS, React", "License": "Royalty Free", "Support": "Priority Email Support"}'::jsonb,
    '/downloads/ultimate-web-bundle.pdf'
  ),
  (
    'Ultimate Mega Bundle',
    'A massive all-in-one collection of digital assets, templates, graphics, and code. Your one-stop shop for premium creative content that ships projects fast.',
    200.00,
    'Bundles',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
    true,
    5.0,
    ARRAY['5,000+ Assets', 'Diverse Categories', 'High-Resolution Graphics', 'Ready-to-Use Code', 'Exclusive Content'],
    '{"Total Files": "5,000+", "Categories": "Design, Code, Marketing", "File Types": "PSD, AI, HTML, PDF", "Download": "Instant Access", "Validity": "Lifetime"}'::jsonb,
    '/downloads/mega-bundle.pdf'
  ),
  (
    'Web Applications Collection',
    'A curated selection of 50+ high-quality, functional web apps. Each app is well-documented and easy to customize for your own projects.',
    200.00,
    'Web Development',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
    true,
    4.7,
    ARRAY['50+ Functional Apps', 'Modern Tech Stack', 'Responsive & Accessible', 'Well-Documented', 'Easy to Customise'],
    '{"Apps Included": "50+", "Frameworks": "React, Vue, Angular", "Backend": "Node.js, Python", "Database": "SQL / NoSQL", "Deployment": "Docker Ready"}'::jsonb,
    '/downloads/web-apps-collection.pdf'
  )
on conflict (name) do update set
  description  = excluded.description,
  price        = excluded.price,
  category     = excluded.category,
  image        = excluded.image,
  in_stock     = excluded.in_stock,
  rating       = excluded.rating,
  features     = excluded.features,
  specs        = excluded.specs,
  download_url = excluded.download_url,
  updated_at   = now();
-- ── 10. Phase 3 Scaling Tables (Affiliates & Licenses) ────────────────────────

-- customer_licenses table for the Secure JWT Portal
create table if not exists public.customer_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    order_id TEXT NOT NULL,
    license_key TEXT NOT NULL UNIQUE,
    license_tier TEXT NOT NULL DEFAULT 'standard',
    product_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

alter table public.customer_licenses enable row level security;

-- NOTE: No public 'select' policy. The backend API uses the Service Role (supabaseAdmin) 
-- to fetch licenses based on Clerk identity, which bypasses RLS.
-- This prevents any unauthorized user from scraping licenses using the Anon key.
do $$
begin
    -- Cleanup any loose policies if they exist from previous runs
    drop policy if exists "Users can view their own licenses" on public.customer_licenses;
end $$;

-- affiliates table for the Affiliate & Influencer Portal
create table if not exists public.affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    audience_link TEXT,
    status TEXT DEFAULT 'pending', -- pending | approved | rejected
    clicks INT DEFAULT 0,
    earned DECIMAL(10,2) DEFAULT 0.00,
    referral_code TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

alter table public.affiliates enable row level security;

do $$
begin
    -- Public can only insert (apply). 
    -- Stats viewing is handled by the backend API via Service Role.
    drop policy if exists "Anyone can insert application" on public.affiliates;
    create policy "Anyone can insert application" on public.affiliates for insert with check (true);
    
    drop policy if exists "Affiliates can view their stats" on public.affiliates;
end $$;
