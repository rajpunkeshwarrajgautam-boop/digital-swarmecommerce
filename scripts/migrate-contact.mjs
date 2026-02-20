// Direct Supabase migration using @supabase/supabase-js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://uhswcljouelyprsinchj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoc3djbGpvdWVseXByc2luY2hqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTMzNDY3OCwiZXhwIjoyMDg2OTEwNjc4fQ.XyhD3yOO6wJY6_9ola6HQodgPipvDqoVxWbnCmmtQG0'
);

async function run() {
  console.log('🔍 Checking if contact_messages table exists...');

  // Try inserting a test record — if table doesn't exist, we'll get a specific error
  const { error: checkError } = await supabase
    .from('contact_messages')
    .select('id')
    .limit(1);

  if (!checkError) {
    console.log('✅ contact_messages table already exists! Nothing to do.');
    return;
  }

  if (checkError.code === '42P01') {
    console.log('⚠️  Table does not exist. Cannot auto-create via client SDK (requires SQL Editor).');
    console.log('');
    console.log('📋 Please run this SQL in your Supabase dashboard:');
    console.log('   👉 https://supabase.com/dashboard/project/uhswcljouelyprsinchj/sql/new');
    console.log('');
    console.log(`create table if not exists public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  first_name text not null,
  last_name text,
  email text not null,
  message text not null,
  created_at timestamptz default now(),
  read boolean default false
);

alter table public.contact_messages enable row level security;

create policy "Anyone can submit a contact message"
  on public.contact_messages for insert
  with check (true);`);
  } else {
    console.error('❌ Unexpected error:', checkError);
  }
}

run();
