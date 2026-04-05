-- Create blog_posts table for the Organic SEO Hub
create table public.blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null, -- Markdown content
  author text not null default 'Swarm Intelligence',
  published_at timestamptz default now(),
  reading_time_minutes integer not null default 5,
  tags text[],
  image_url text not null
);

-- Enable Row Level Security (RLS)
alter table public.blog_posts enable row level security;

-- Create policy for public read access
create policy "Public blog posts are viewable by everyone" 
on public.blog_posts for select using (true);

-- Insert a test article
insert into public.blog_posts (title, slug, excerpt, content, image_url, tags)
values (
  'How Autonomous AI Agents Are Revolutionizing E-Commerce in 2026', 
  'how-autonomous-ai-agents-revolutionize-ecommerce-2026', 
  'Discover the exact systems scaling massive 7-figure product pipelines dynamically without human intervention.',
  '# The Future is Autonomous

Traditional drop-shipping and e-commerce models are dying. In 2026, the real leverage comes from deploying autonomous neural networks that act as sales teams, customer service representatives, and inventory managers all at once.

## 1. The Death of the Interface
Customers no longer want to click through 15 pages of poorly formatted categories. They demand conversational commerce.

## 2. Dynamic Pricing via Neural Matching
Why charge a static $50 when an algorithm can determine exactly what a user is willing to pay based on their micro-interactions and scroll speed? 

Welcome to the Digital Swarm.',
  'https://images.unsplash.com/photo-1620825937374-87fc1d6aaffa?w=800&auto=format&fit=crop&q=60',
  ARRAY['AI', 'E-Commerce', 'Future']
);
