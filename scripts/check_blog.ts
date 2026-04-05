import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load env vars
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('blog_posts').select('*').limit(1);
  if (error) {
    if (error.code === '42P01') {
      console.log('TABLE_MISSING');
    } else {
      console.log('ERROR:', error.message);
    }
  } else {
    console.log('TABLE_EXISTS_AND_SEEDED');
  }
}

check();
