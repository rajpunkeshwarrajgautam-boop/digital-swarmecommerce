
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[SUPABASE] Missing environment variables. Database features will be disabled.');
}

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Admin client for privileged operations requiring bypass of RLS
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Gold Standard: supabaseAdmin is only available if SUPABASE_SERVICE_ROLE_KEY is set.
 * Prevents accidental insecure fallback to anon-client for privileged ops.
 */
export const supabaseAdmin = serviceRoleKey && supabaseUrl
  ? createClient(supabaseUrl, serviceRoleKey)
  : null;
