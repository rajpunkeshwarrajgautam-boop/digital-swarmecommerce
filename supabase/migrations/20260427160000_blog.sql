-- Create blog_posts table for the Organic SEO Hub
create table if not exists public.blog_posts (
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
do $$ 
begin
  if not exists (
    select 1 from pg_policies 
    where tablename = 'blog_posts' and policyname = 'Public blog posts are viewable by everyone'
  ) then
    create policy "Public blog posts are viewable by everyone" 
    on public.blog_posts for select using (true);
  end if;
end $$;

-- Insert initial content
insert into public.blog_posts (title, slug, excerpt, content, image_url, tags)
select 
  'How Autonomous AI Agents Are Revolutionizing E-Commerce in 2026', 
  'how-autonomous-ai-agents-revolutionize-ecommerce-2026', 
  'Discover the exact systems scaling massive 7-figure product pipelines dynamically without human intervention.',
  '# The Future is Autonomous... (truncated content)',
  'https://images.unsplash.com/photo-1620825937374-87fc1d6aaffa?w=800&auto=format&fit=crop&q=60',
  ARRAY['AI', 'E-Commerce', 'Future']
where not exists (select 1 from public.blog_posts where slug = 'how-autonomous-ai-agents-revolutionize-ecommerce-2026');
