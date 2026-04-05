import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * GET /api/drip/unsubscribe?email=xxx
 * One-click unsubscribe — marks sequence as completed so no further emails are sent.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email || !supabaseAdmin) {
    return new Response('<h1 style="font-family:sans-serif">Invalid unsubscribe link.</h1>', {
      headers: { 'Content-Type': 'text/html' },
      status: 400,
    });
  }

  await supabaseAdmin
    .from('email_sequences')
    .update({ completed: true })
    .eq('email', email);

  return new Response(`
    <!DOCTYPE html>
    <html>
    <head><title>Unsubscribed | Digital Swarm</title></head>
    <body style="margin:0;background:#0a0a0b;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
      <div style="text-align:center;color:#fff;max-width:400px;padding:40px;">
        <div style="font-size:48px;margin-bottom:16px;">⚡</div>
        <h1 style="font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:16px;">
          Unsubscribed
        </h1>
        <p style="color:#888;line-height:1.7;">
          You've been removed from our email sequence. You won't receive any further automated emails from Digital Swarm.
        </p>
        <a href="https://digitalswarm.in" style="display:inline-block;margin-top:24px;background:#ccff00;color:#000;font-weight:900;text-decoration:none;padding:12px 24px;text-transform:uppercase;letter-spacing:0.1em;border-radius:8px;font-size:13px;">
          Back to Digital Swarm
        </a>
      </div>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' },
    status: 200,
  });
}
