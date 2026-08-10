import { z } from 'zod';

const optionalString = z.preprocess(
  (value) => typeof value === 'string' && value.trim() === '' ? undefined : value,
  z.string().optional(),
);

const optionalEmail = z.preprocess(
  (value) => typeof value === 'string' && value.trim() === '' ? undefined : value,
  z.string().email().optional(),
);

const optionalStrongSecret = z.preprocess(
  (value) => typeof value === 'string' && value.trim().length < 32 ? undefined : value,
  z.string().min(32).optional(),
);

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_FB_PIXEL_ID: optionalString,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: optionalString,

  ADMIN_WHITELIST: z
    .string()
    .default('')
    .transform((val) => val.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)),

  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_URL: z.preprocess(
    (value) => typeof value === 'string' && value.trim() === '' ? undefined : value,
    z.string().url().optional(),
  ),
  RESEND_API_KEY: z.string().min(1),
  CASHFREE_APP_ID: z.string().min(1),
  CASHFREE_SECRET_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: optionalString,
  ADMIN_EMAIL: optionalEmail,
  SWARM_BRIDGE_SECRET: optionalStrongSecret,
  INTERNAL_FULFILLMENT_SECRET: optionalStrongSecret,
  LICENSE_SIGNING_SECRET: optionalStrongSecret,

  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  GOOGLE_GENERATIVE_AI_API_KEY: optionalString,
});

const isServer = typeof window === 'undefined';

function validateEnv() {
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || process.env.CI === 'true';

  if (!isServer) {
    return envSchema.partial().parse(process.env);
  }

  if (isBuildPhase) {
    return process.env as unknown as z.infer<typeof envSchema>;
  }

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const missingKeys = parsed.error.issues.map((issue) => issue.path.join('.')).join(', ');
    console.error('[ENV_FAULT] Infrastructure configuration error:', missingKeys);

    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Invalid production environment: ${missingKeys}`);
    }

    const rawEnv = process.env as NodeJS.ProcessEnv;
    return {
      ...process.env,
      ADMIN_WHITELIST: typeof rawEnv.ADMIN_WHITELIST === 'string'
        ? rawEnv.ADMIN_WHITELIST.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
        : [],
    } as unknown as z.infer<typeof envSchema>;
  }

  return parsed.data;
}

const validatedEnv = validateEnv();

export const env = {
  ...validatedEnv,
  ADMIN_WHITELIST: validatedEnv.ADMIN_WHITELIST || [],
} as typeof validatedEnv;
