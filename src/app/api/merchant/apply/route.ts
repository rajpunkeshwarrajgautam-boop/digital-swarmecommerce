import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({ interval: 60 * 60 * 1000, uniqueTokenPerInterval: 100 });

function validHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'Sign in before submitting an application.' }, { status: 401 });

    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    try {
      await limiter.check(3, `${user.id}:${ip}`);
    } catch {
      return NextResponse.json({ error: 'Too many application attempts. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const nodeName = String(body?.nodeName || '').trim().slice(0, 120);
    const specialization = String(body?.specialization || '').trim().slice(0, 160);
    const portfolioUrl = String(body?.portfolioUrl || '').trim().slice(0, 500);
    const description = String(body?.description || '').trim().slice(0, 5000);
    const contactEmail = String(body?.contactEmail || '').trim().toLowerCase().slice(0, 254);

    if (!nodeName || !specialization || !portfolioUrl || !contactEmail || !description) {
      return NextResponse.json({ error: 'All application fields are required.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return NextResponse.json({ error: 'Enter a valid contact email.' }, { status: 400 });
    }
    if (!validHttpsUrl(portfolioUrl)) {
      return NextResponse.json({ error: 'Portfolio URL must be a valid http(s) URL.' }, { status: 400 });
    }
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Application database is temporarily unavailable.' }, { status: 503 });
    }

    const { data, error } = await supabaseAdmin
      .from('merchant_applications')
      .upsert({
        user_id: user.id,
        node_name: nodeName,
        specialization,
        portfolio_url: portfolioUrl,
        description,
        contact_email: contactEmail,
        status: 'pending',
      }, { onConflict: 'user_id' })
      .select('id,status,created_at')
      .single();

    if (error || !data) {
      console.error('[merchant apply] persistence failed:', error?.message);
      return NextResponse.json({ error: 'We could not save your application. Please email support@digitalswarm.in.' }, { status: 503 });
    }

    return NextResponse.json({ success: true, application: data, message: 'Application saved for manual review.' });
  } catch (err) {
    console.error('[merchant apply] unexpected failure:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
