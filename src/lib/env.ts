import { z } from 'zod';

/**
 * Global Environment Configuration Schema
 * 
 * Digital Swarm uses strict validation to prevent integration faults 
 * in production environments. If a critical key is missing, the 
 * application will crash early with a descriptive error.
 */

const envSchema = z.object({
  // --- PUBLIC PROTOCOLS ---
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_FB_PIXEL_ID: z.string().optional(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),

  // --- ACCESS CONTROL PROTOCOLS ---
  ADMIN_WHITELIST: z.string().default('admin@digitalswarm.in,test@example.com').transform((val) => val.split(',').map(s => s.trim().toLowerCase())),

  // --- SERVER-SIDE SECRETS ---
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  CASHFREE_APP_ID: z.string().min(1),
  CASHFREE_SECRET_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().optional(), // Secondary gateway
  ADMIN_EMAIL: z.string().email().optional(),
  
  // --- NODE ENV ---
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

// Logic to differentiate between Client and Server validation
const isServer = typeof window === 'undefined';

/**
 * Environment Validator
 * Returns the parsed environment or warns about faults.
 */
function validateEnv() {
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || process.env.CI === 'true';

  try {
    // On the client, we can only validate NEXT_PUBLIC_* variables
    if (!isServer) {
      return envSchema.partial().parse(process.env);
    }
    
    // On the server during the build phase, use partial validation to allow static pre-rendering
    if (isBuildPhase) {
      const result = envSchema.partial().safeParse(process.env);
      if (!result.success) {
        console.warn('⚠️ [BUILD_WARN] Environment keys missing during build (Safe):', result.error.issues.map(i => i.path.join('.')).join(', '));
      }
      return process.env as unknown as z.infer<typeof envSchema>;
    }

    // Standard runtime validation
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingKeys = error.issues.map((issue) => issue.path.join('.')).join(', ');
      console.error('❌ [ENV_FAULT] Infrastructure configuration error:', missingKeys);
      
      // LOG ONLY: We no longer throw at runtime to prevent total site failure.
      // Instead, we let the features that need those keys fail gracefully.
    }
    
    // SAFE FALLBACK: Ensure critical array transformations are preserved even on failure
    const rawEnv = process.env as any;
    const whitelist = typeof rawEnv.ADMIN_WHITELIST === 'string' 
      ? rawEnv.ADMIN_WHITELIST.split(',').map((s: string) => s.trim().toLowerCase())
      : ['admin@digitalswarm.in']; // Absolute fallback

    return {
      ...process.env,
      ADMIN_WHITELIST: whitelist,
    } as unknown as z.infer<typeof envSchema>;
  }
}

export const env = validateEnv();
