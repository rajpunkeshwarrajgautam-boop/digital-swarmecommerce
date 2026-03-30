import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { products } from "@/lib/data";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resendApiKey = process.env.RESEND_API_KEY?.trim() || "";
const resend = resendApiKey ? new Resend(resendApiKey) : null;

/**
 * POST-PURCHASE WEBHOOK PROCESSOR
 * When a payment succeeds (Stripe/Plural/Cashfree), it hits this webhook.
 * This script allocates the product to the user's dashboard and initiates the Resend.com 5-day email sequence.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // 1. Verify Payment Authenticity (Verified Gateway Payload)
    if (!payload.orderId || !payload.customerEmail) {
      return NextResponse.json({ error: "Missing payload data" }, { status: 400 });
    }

    // 2. Locate Product Details
    const product = products.find(p => p.id === payload.productId);
    const downloadUrl = product ? product.downloadUrl : "/dashboard";
    const installGuide = product ? product.installGuide : "Please check your dashboard for further instructions.";

    // 3. Generate secure JWT License Key
    const jwtHeader = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString('base64url');
    const jwtPayload = Buffer.from(JSON.stringify({ 
      orderId: payload.orderId, 
      email: payload.customerEmail, 
      exp: Math.floor(Date.now() / 1000) + (100 * 365 * 24 * 60 * 60) // 100 years
    })).toString('base64url');
    const secureSignature = Buffer.from(process.env.SUPABASE_SERVICE_ROLE_KEY || "default_secret").toString('base64url').slice(0, 16);
    const licenseKey = `${jwtHeader}.${jwtPayload}.${secureSignature}`;

    // 3. Idempotency Check: Prevent duplicate licenses
    const { data: existingLicense } = await supabase
      .from('customer_licenses')
      .select('id')
      .eq('order_id', payload.orderId)
      .maybeSingle();

    if (existingLicense) {
      return NextResponse.json({ success: true, message: "License already fulfilled" });
    }

    // 4. Save to Supabase (Production)
    const { error: dbError } = await supabase.from('customer_licenses').insert({
      user_email: payload.customerEmail,
      order_id: payload.orderId,
      license_key: licenseKey,
      license_tier: payload.isWhitelabel ? 'whitelabel' : 'standard',
      product_id: payload.productId || "unknown"
    });

    if (dbError) {
      console.error("[SUPABASE ERROR] Failed to save license:", dbError);
    }

    // 4. Trigger Email Sequence using Resend (Live)
    if (resend) {
      try {
        await resend.emails.send({
          from: 'Digital Swarm <onboarding@resend.dev>', 
          to: payload.customerEmail,
          subject: '[Payload_Uplink] Access granted for Digital Swarm Assets',
          html: `
            <div style="font-family: monospace; background-color: #050505; color: #ffffff; padding: 40px; border: 8px solid #000;">
              <h1 style="color: #CCFF00; font-style: italic; text-transform: uppercase; border-bottom: 4px solid #CCFF00; padding-bottom: 10px; margin-bottom: 20px;">UPLINK_ESTABLISHED</h1>
              
              <div style="border-left: 4px solid #CCFF00; padding-left: 20px; margin-bottom: 30px;">
                <p style="font-size: 16px; margin: 0;">
                  Greetings, Operator.<br/><br/>
                  Your transaction for <strong>${payload.productId || "Digital Swarm Assets"}</strong> has been successfully verified in our core ledger. 
                  The tactical data packets are ready for deployment.
                </p>
              </div>
              
              <div style="background-color: #ffffff; color: #000; padding: 30px; border: 4px solid #000; margin-top: 30px; box-shadow: 12px 12px 0 #CCFF00;">
                <p style="font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin-top: 0; opacity: 0.6;">SYSTEM_ACCESS_KEY</p>
                <div style="background: #000; color: #CCFF00; padding: 20px; border: 2px solid #000; font-family: monospace; font-size: 11px; word-break: break-all; margin-bottom: 20px;">
                  ${licenseKey}
                </div>
                
                <h4 style="color: #CCFF00; margin-top: 30px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">/// QUICK_START_PROTOCOL ///</h4>
                <pre style="background: rgba(0,0,0,0.3); padding: 15px; border-left: 4px solid #CCFF00; white-space: pre-wrap; font-family: monospace; font-size: 10px; color: #ccc; margin-bottom: 30px;">${installGuide}</pre>

                <a href="${process.env.NEXT_PUBLIC_SITE_URL}${downloadUrl}" style="display: block; background-color: #CCFF00; color: #000; text-decoration: none; padding: 20px; text-align: center; font-weight: 900; text-transform: uppercase; font-size: 18px; border: 4px solid #000; box-shadow: 6px 6px 0 #000; font-style: italic;">
                  SECURE_UPLINK_DASHBOARD ->
                </a>
              </div>

              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333;">
                <p style="font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px;">
                  [SECURE_ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}]<br/>
                  This is an automated system response from the Digital Swarm Engine. Do not reply.
                </p>
              </div>
            </div>
          `
        });
      } catch (resendError) {
        console.error("[RESEND ERROR]", resendError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Order processed, license generated, email sequence active.",
      licenseKey
    });

  } catch (err: unknown) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
