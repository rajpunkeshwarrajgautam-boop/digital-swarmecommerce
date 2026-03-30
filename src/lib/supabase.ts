
import { createClient } from '@supabase/supabase-js';

import { env } from '@/lib/env';

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[SUPABASE] Faulty environment configuration. Database features will be non-functional.');
}

/**
 * Public Supabase Client
 * Authenticated with Anon Key for RLS-protected operations.
 */
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Admin client for privileged operations requiring bypass of RLS
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Admin Supabase Client
 * Authenticated with Service Role Key for bypass of RLS.
 */
export const supabaseAdmin = serviceRoleKey && supabaseUrl
  ? createClient(supabaseUrl, serviceRoleKey)
  : null;
