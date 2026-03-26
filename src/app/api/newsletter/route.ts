import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/newsletter
 * Subscribes an email address to the Digital Swarm newsletter via Resend.
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      // Graceful degradation: log and accept in environments without Resend configured
      console.warn("RESEND_API_KEY not set. Skipping newsletter subscription.");
      return NextResponse.json({ success: true, message: "Subscribed (dev mode)." });
    }

    // Add contact to Resend audience
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (audienceId) {
      const audienceRes = await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({ email, unsubscribed: false }),
        }
      );
      if (!audienceRes.ok) {
        const err = await audienceRes.json();
        console.error("Resend audience error:", err);
      }
    }

    // Send welcome email
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Digital Swarm <no-reply@digitalswarm.in>",
        to: [email],
        subject: "SIGNAL_ACQUIRED // Welcome to the Swarm",
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8" /></head>
          <body style="background:#0a0a0f;color:#fff;font-family:monospace;padding:40px 20px;margin:0;">
            <div style="max-width:600px;margin:0 auto;">
              <div style="border-left:4px solid #CCFF00;padding-left:24px;margin-bottom:32px;">
                <h1 style="font-size:32px;font-weight:900;text-transform:uppercase;letter-spacing:-2px;font-style:italic;margin:0 0 8px;">
                  SIGNAL ACQUIRED
                </h1>
                <p style="color:#CCFF00;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:4px;margin:0;">
                  Digital Swarm // Operational Broadcast
                </p>
              </div>
              <p style="color:rgba(255,255,255,0.7);font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;line-height:1.8;">
                Welcome to the swarm, agent. You'll now receive our weekly broadcast of:
              </p>
              <ul style="color:rgba(255,255,255,0.5);font-size:12px;text-transform:uppercase;letter-spacing:1px;line-height:2.5;">
                <li>🔬 Hardened engineering protocols</li>
                <li>🚀 New premium template releases</li>
                <li>⚡ Exclusive early-access drops</li>
                <li>🛡️ Zero-day vulnerability reports</li>
              </ul>
              <a href="https://digitalswarm.in/products" 
                 style="display:inline-block;background:#CCFF00;color:#000;padding:16px 32px;font-weight:900;font-size:12px;text-transform:uppercase;letter-spacing:3px;text-decoration:none;font-style:italic;margin-top:24px;">
                BROWSE CATALOG →
              </a>
              <p style="color:rgba(255,255,255,0.2);font-size:10px;margin-top:40px;">
                © ${new Date().getFullYear()} Digital Swarm. You subscribed at digitalswarm.in.
                <a href="#" style="color:rgba(255,255,255,0.2);">Unsubscribe</a>
              </p>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.json();
      console.error("Resend welcome email error:", err);
      // Don't fail the subscription even if welcome email fails
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to the Digital Swarm.",
    });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
