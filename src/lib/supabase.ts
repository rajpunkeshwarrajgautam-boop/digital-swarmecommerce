import { createClient } from '@supabase/supabase-js';

/**
 * Read Supabase credentials DIRECTLY from process.env — bypassing the Zod
 * validation layer in env.ts, which can suppress NEXT_PUBLIC_* values when
 * any non-optional field fails validation (e.g. ADMIN_EMAIL is missing).
 *
 * These are the only two values that MUST be available in every environment
 * (browser, edge, serverless). Having them inline here guarantees resilience.
 */
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://uhswcljouelyprsinchj.supabase.co'; // digital-swarm — public fallback

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoc3djbGpvdWVseXByc2luY2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMzQ2NzgsImV4cCI6MjA4NjkxMDY3OH0._69eZIlifDPNyLVYMOKJezQDujrKYMZKesn5jYWXdPg'; // public — safe fallback

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[SUPABASE] Critical: URL or Anon Key missing. Database features will be non-functional.');
}

/**
 * Public Supabase Client — authenticated with Anon Key (RLS applies).
 * Always available since we have hardcoded public fallbacks.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Admin Supabase Client — authenticated with Service Role Key (bypasses RLS).
 * Only available server-side where SUPABASE_SERVICE_ROLE_KEY is set.
 */
export const supabaseAdmin = serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;
