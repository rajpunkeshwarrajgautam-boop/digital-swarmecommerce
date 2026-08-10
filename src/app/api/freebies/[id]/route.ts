import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

const FREE_ASSETS: Record<string, string> = {
  'saas-checklist': 'saas-launch-checklist.txt',
  'ai-prompt-library': 'ai-prompt-library.txt',
  'mini-ui-kit': 'cyberpunk-mini-ui-kit.tsx',
  'tech-stack-audit': 'saas-tech-stack-audit.txt',
  'design-system-tokens': 'design-system-tokens.css',
};

const limiter = rateLimit({ interval: 60 * 60 * 1000, uniqueTokenPerInterval: 1000 });

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> | { id: string> },
) {
  try {
    const { id } = await props.params;
    const filename = FREE_ASSETS[id];
    if (!filename) return NextResponse.json({ error: 'Free asset not found' }, { status: 404 });

    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    try {
      await limiter.check(40, ip);
    } catch {
      return NextResponse.json({ error: 'Too many download requests. Try again later.' }, { status: 429 });
    }

    if (!supabaseAdmin) return NextResponse.json({ error: 'Download service unavailable' }, { status: 503 });

    const { data, error } = await supabaseAdmin.storage
      .from('digital_assets')
      .createSignedUrl(filename, 60 * 10, { download: filename });

    if (error || !data?.signedUrl) {
      console.error('[freebies] signed URL failed', { filename, message: error?.message });
      return NextResponse.json({ error: 'Free asset temporarily unavailable' }, { status: 503 });
    }

    return NextResponse.redirect(data.signedUrl, 302);
  } catch (error) {
    console.error('[freebies] unexpected error', error);
    return NextResponse.json({ error: 'Download service failure' }, { status: 500 });
  }
}
