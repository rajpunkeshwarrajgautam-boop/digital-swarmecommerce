import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY!);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://digitalswarm.in';

interface DripEmail {
  subject: string;
  html: string;
}

/**
 * Generates the HTML for each drip email step.
 * Step 0 = immediate PDF delivery (handled in leads route)
 * Steps 1-4 = this drip processor
 */
function getDripEmail(step: number, email: string): DripEmail | null {
  const unsubscribeUrl = `${SITE_URL}/api/drip/unsubscribe?email=${encodeURIComponent(email)}`;

  const footer = `
    <div style="margin-top:40px;padding-top:20px;border-top:1px solid #1a1a1a;text-align:center;color:#555;font-size:12px;">
      <p>You're receiving this because you downloaded the Omega Protocol from Digital Swarm.</p>
      <p><a href="${unsubscribeUrl}" style="color:#ccff00;">Unsubscribe</a></p>
    </div>`;

  const wrapper = (content: string) => `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#0a0a0b;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="margin-bottom:32px;">
          <span style="font-size:18px;font-weight:900;letter-spacing:0.1em;color:#ffffff;text-transform:uppercase;">DIGITAL SWARM</span>
          <span style="font-size:10px;font-weight:700;color:#ccff00;letter-spacing:0.3em;text-transform:uppercase;margin-left:12px;">Intelligence Feed</span>
        </div>
        <div style="background:#111;border:1px solid #1a1a1a;border-radius:16px;padding:40px;">
          ${content}
        </div>
        ${footer}
      </div>
    </body>
    </html>`;

  switch (step) {
    case 1: // Day 2 — Educational
      return {
        subject: "The #1 mistake AI beginners make (and how to avoid it)",
        html: wrapper(`
          <h1 style="font-size:28px;font-weight:900;color:#ffffff;margin-bottom:16px;line-height:1.2;">
            The #1 Mistake AI Beginners Make
          </h1>
          <p style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:32px;">Day 2 Intel Drop</p>
          <p style="color:#ccc;font-size:16px;line-height:1.7;margin-bottom:20px;">
            After analyzing 500+ AI tool setups, one mistake kills 80% of new operators before they ever make their first sale.
          </p>
          <div style="background:#0a0a0a;border-left:4px solid #ccff00;padding:20px 24px;margin:24px 0;border-radius:0 8px 8px 0;">
            <p style="color:#ccff00;font-weight:900;font-size:14px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px;">The Mistake:</p>
            <p style="color:#fff;font-size:16px;margin:0;font-weight:700;">Trying to automate everything at once before proving the model works manually.</p>
          </div>
          <p style="color:#ccc;font-size:16px;line-height:1.7;margin-bottom:20px;">
            Most beginners download 12 tools, connect nothing properly, get overwhelmed by complexity, and quit within 3 weeks.
          </p>
          <p style="color:#ccc;font-size:16px;line-height:1.7;margin-bottom:20px;">
            The operators succeeding right now follow a simple rule: <strong style="color:#fff;">manual first, automate second.</strong> Prove the model works manually with 10 customers. Then automate the exact workflow that's already converting.
          </p>
          <p style="color:#ccc;font-size:16px;line-height:1.7;margin-bottom:32px;">
            This week, pick ONE AI tool. Deploy it. Measure it. Only then automate it.
          </p>
          <a href="${SITE_URL}/products" style="display:inline-block;background:#ccff00;color:#000;font-weight:900;font-size:13px;text-decoration:none;padding:14px 28px;text-transform:uppercase;letter-spacing:0.1em;border-radius:8px;">
            Explore the toolkit →
          </a>`)
      };

    case 2: // Day 4 — Case Study
      return {
        subject: "How Priya from Pune earned ₹82,000 in 30 days with Digital Swarm",
        html: wrapper(`
          <h1 style="font-size:28px;font-weight:900;color:#ffffff;margin-bottom:16px;line-height:1.2;">
            ₹82,000 in 30 Days. No Team. No Office.
          </h1>
          <p style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:32px;">Day 4 Case Study</p>
          <div style="background:#0a0a0a;border-radius:12px;padding:24px;margin-bottom:28px;text-align:center;">
            <div style="font-size:48px;font-weight:900;color:#ccff00;letter-spacing:-2px;">₹82,000</div>
            <div style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.15em;">Revenue in Month 1</div>
          </div>
          <p style="color:#ccc;font-size:16px;line-height:1.7;margin-bottom:20px;">
            Priya is an ex-IT professional from Pune who spent 8 years writing code for a fintech firm before going independent in early 2026.
          </p>
          <p style="color:#ccc;font-size:16px;line-height:1.7;margin-bottom:20px;">
            She deployed Digital Swarm's AI agent toolkit during a weekend. Within 72 hours, her first product listing was live. Within 7 days, her first sale landed.
          </p>
          <p style="color:#ccc;font-size:16px;line-height:1.7;margin-bottom:20px;">
            By Day 30: <strong style="color:#fff;">₹82,000 in revenue from 3 digital products</strong>, all running on autopilot while she focused on building product #4.
          </p>
          <div style="background:#0a0a0a;border-radius:12px;padding:20px;margin:24px 0;">
            <p style="color:#ccff00;font-weight:900;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;">Her Stack:</p>
            <ul style="color:#ccc;padding-left:20px;margin:0;line-height:2;">
              <li>AI product description generator</li>
              <li>Exit intent capture + PDF lead magnet</li>
              <li>7-day automated email drip</li>
              <li>Cashfree checkout (India-optimized)</li>
            </ul>
          </div>
          <p style="color:#ccc;font-size:16px;line-height:1.7;margin-bottom:32px;">
            What's your version of this story? It starts with the same first step.
          </p>
          <a href="${SITE_URL}/products" style="display:inline-block;background:#ccff00;color:#000;font-weight:900;font-size:13px;text-decoration:none;padding:14px 28px;text-transform:uppercase;letter-spacing:0.1em;border-radius:8px;">
            Start your store →
          </a>`)
      };

    case 3: // Day 6 — Urgency offer
      return {
        subject: "Your exclusive 20% discount expires in 48 hours 🔥",
        html: wrapper(`
          <h1 style="font-size:28px;font-weight:900;color:#ffffff;margin-bottom:16px;line-height:1.2;">
            Your Exclusive Offer Expires in 48 Hours
          </h1>
          <p style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:32px;">Exclusive Intel — Time Sensitive</p>
          <div style="background:linear-gradient(135deg,#1a1a00,#222200);border:2px solid #ccff00;border-radius:12px;padding:32px;text-align:center;margin-bottom:32px;">
            <div style="font-size:72px;font-weight:900;color:#ccff00;letter-spacing:-4px;line-height:1;">20%</div>
            <div style="color:#fff;font-size:18px;font-weight:700;margin-top:8px;">OFF YOUR FIRST ORDER</div>
            <div style="color:#888;font-size:13px;margin-top:8px;text-transform:uppercase;letter-spacing:0.15em;">Exclusive reader offer — 48 hours only</div>
            <div style="margin-top:20px;padding:10px 20px;background:#000;border-radius:8px;display:inline-block;">
              <span style="color:#ccff00;font-weight:900;font-size:20px;letter-spacing:0.1em;">SWARM20</span>
            </div>
          </div>
          <p style="color:#ccc;font-size:16px;line-height:1.7;margin-bottom:20px;">
            You've been reading about the AI agent revolution. Now it's time to deploy your first tool.
          </p>
          <p style="color:#ccc;font-size:16px;line-height:1.7;margin-bottom:32px;">
            Use code <strong style="color:#ccff00;">SWARM20</strong> at checkout for 20% off any product in the Digital Swarm store. Valid for the next 48 hours only — this offer won't be sent again.
          </p>
          <a href="${SITE_URL}/products" style="display:inline-block;background:#ccff00;color:#000;font-weight:900;font-size:14px;text-decoration:none;padding:16px 36px;text-transform:uppercase;letter-spacing:0.1em;border-radius:8px;">
            Claim 20% Off Now →
          </a>`)
      };

    case 4: // Day 9 — Final push
      return {
        subject: "Last chance — your offer expires at midnight tonight",
        html: wrapper(`
          <h1 style="font-size:28px;font-weight:900;color:#ffffff;margin-bottom:16px;line-height:1.2;">
            Final Warning. Midnight Tonight.
          </h1>
          <p style="color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:32px;">Last Transmission</p>
          <p style="color:#ccc;font-size:16px;line-height:1.7;margin-bottom:20px;">
            Your 20% discount code <strong style="color:#ccff00;">SWARM20</strong> expires at midnight tonight and will not be reissued.
          </p>
          <p style="color:#ccc;font-size:16px;line-height:1.7;margin-bottom:20px;">
            Two paths from here:
          </p>
          <div style="background:#0a0a0a;border-radius:12px;padding:24px;margin:24px 0;">
            <p style="color:#ff4444;font-weight:700;margin:0 0 8px;">❌ Path A: Do nothing</p>
            <p style="color:#888;margin:0 0 24px;font-size:15px;">Same results. Same manual processes. Same ceiling. 12 months from now, you're wondering what you missed.</p>
            <p style="color:#ccff00;font-weight:700;margin:0 0 8px;">✅ Path B: Deploy your first AI agent</p>
            <p style="color:#ccc;margin:0;font-size:15px;">20% off. Setup in under an hour. Running autonomously by tomorrow. First results in 7 days.</p>
          </div>
          <p style="color:#ccc;font-size:16px;line-height:1.7;margin-bottom:32px;">
            The decision is simple. The code is waiting.
          </p>
          <a href="${SITE_URL}/products" style="display:inline-block;background:#ccff00;color:#000;font-weight:900;font-size:14px;text-decoration:none;padding:16px 36px;text-transform:uppercase;letter-spacing:0.1em;border-radius:8px;">
            Use SWARM20 Before Midnight →
          </a>`)
      };

    default:
      return null;
  }
}

/**
 * POST /api/drip/process
 * Called by Vercel Cron daily. Processes all emails due for sending.
 */
export async function POST(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized triggers
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not connected' }, { status: 500 });
    }

    // Fetch all sequences due for next email
    const { data: dueSequences, error } = await supabaseAdmin
      .from('email_sequences')
      .select('*')
      .lte('next_send_at', new Date().toISOString())
      .eq('completed', false)
      .limit(100);

    if (error) throw error;
    if (!dueSequences || dueSequences.length === 0) {
      return NextResponse.json({ processed: 0, message: 'No emails due' });
    }

    let sent = 0;
    let skipped = 0;

    for (const sequence of dueSequences) {
      const nextStep = sequence.step + 1;
      const emailContent = getDripEmail(nextStep, sequence.email);

      if (!emailContent) {
        // Mark sequence as complete
        await supabaseAdmin
          .from('email_sequences')
          .update({ completed: true })
          .eq('id', sequence.id);
        skipped++;
        continue;
      }

      try {
        await resend.emails.send({
          from: 'Digital Swarm <intelligence@digitalswarm.in>',
          to: sequence.email,
          subject: emailContent.subject,
          html: emailContent.html,
        });

        // Calculate next send date based on step
        const daysUntilNext: Record<number, number> = { 1: 2, 2: 2, 3: 3, 4: 0 };
        const daysToAdd = daysUntilNext[nextStep] ?? 0;
        const nextSendAt = new Date();
        nextSendAt.setDate(nextSendAt.getDate() + daysToAdd);

        await supabaseAdmin
          .from('email_sequences')
          .update({
            step: nextStep,
            next_send_at: nextSendAt.toISOString(),
            completed: nextStep >= 4,
          })
          .eq('id', sequence.id);

        sent++;
      } catch (emailError) {
        console.error(`[Drip] Failed to send to ${sequence.email}:`, emailError);
      }
    }

    return NextResponse.json({ processed: dueSequences.length, sent, skipped });
  } catch (err) {
    console.error('[Drip Processor] Critical failure:', err);
    return NextResponse.json({ error: 'Critical failure' }, { status: 500 });
  }
}
