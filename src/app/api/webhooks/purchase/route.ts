import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { products } from "@/lib/data";
import { recordCommission } from "@/lib/commissions";
import { sealTransaction } from "@/lib/ledger";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const resendApiKey = process.env.RESEND_API_KEY?.trim() || "";
const resend = resendApiKey ? new Resend(resendApiKey) : null;

function safeSecretEqual(candidate: string, expected: string): boolean {
  if (!candidate || candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(expected));
}

function authorizeInternalFulfillment(request: Request): boolean {
  const expected = process.env.INTERNAL_FULFILLMENT_SECRET?.trim();
  if (!expected || expected.length < 32) return false;
  const candidate = request.headers.get("x-internal-fulfillment-secret")?.trim() || "";
  return safeSecretEqual(candidate, expected);
}

function createLicenseKey(orderId: string, email: string, productId: string): string {
  const secret = process.env.LICENSE_SIGNING_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error("LICENSE_SIGNING_SECRET is not configured");
  }

  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    orderId,
    email,
    productId,
    iat: Math.floor(Date.now() / 1000),
  })).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(`${header}.${payload}`).digest("base64url");
  return `${header}.${payload}.${signature}`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[char] || char);
}

export async function POST(request: Request) {
  if (!authorizeInternalFulfillment(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const orderId = typeof payload?.orderId === "string" ? payload.orderId.trim() : "";
    const customerEmail = typeof payload?.customerEmail === "string" ? payload.customerEmail.trim().toLowerCase() : "";
    const productId = typeof payload?.productId === "string" ? payload.productId.trim() : "";

    if (!orderId || !customerEmail || !productId || orderId.length > 180 || productId.length > 180) {
      return NextResponse.json({ error: "Invalid fulfillment payload" }, { status: 400 });
    }

    const product = products.find((item) => item.id === productId);
    const downloadUrl = product?.downloadUrl || "/dashboard";
    const installGuide = product?.installGuide || "Open your Digital Swarm dashboard for setup instructions.";
    const merchantId = product?.merchantId || "SYSTEM";
    const price = product?.price || 0;

    const { data: existingLicense } = await supabase
      .from("customer_licenses")
      .select("id")
      .eq("order_id", orderId)
      .maybeSingle();

    if (existingLicense) {
      return NextResponse.json({ success: true, message: "Already fulfilled" });
    }

    const licenseKey = createLicenseKey(orderId, customerEmail, productId);
    let secureDownloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://digitalswarm.in"}/dashboard`;

    if (product?.downloadUrl) {
      const filename = product.downloadUrl.split("/").pop();
      if (filename?.includes(".")) {
        const { data: signedData, error: signError } = await supabase.storage
          .from("digital_assets")
          .createSignedUrl(filename, 60 * 60 * 24 * 3);
        if (signedData?.signedUrl) secureDownloadUrl = signedData.signedUrl;
        else console.error("[STORAGE_SIGN_ERROR]", signError);
      } else {
        secureDownloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://digitalswarm.in"}${downloadUrl}`;
      }
    }

    const { error: dbError } = await supabase.from("customer_licenses").insert({
      user_email: customerEmail,
      order_id: orderId,
      license_key: licenseKey,
      license_tier: payload.isWhitelabel ? "whitelabel" : "standard",
      product_id: productId,
    });

    if (dbError) {
      console.error("[SUPABASE_ERROR] Failed to save license:", dbError);
      return NextResponse.json({ error: "Fulfillment persistence failed" }, { status: 500 });
    }

    const { data: existingCommission } = await supabase
      .from("commissions")
      .select("id")
      .eq("order_id", orderId)
      .maybeSingle();

    if (!existingCommission) {
      try {
        const { splits } = await recordCommission(orderId, {
          totalAmount: price,
          merchantId,
          affiliateId: payload.affiliateId || null,
        });
        await sealTransaction({
          transactionId: orderId,
          payload: { orderId, productId, splits, timestamp: new Date().toISOString() },
        });
      } catch (commissionError) {
        console.error("[FINANCIAL_SYNC_ERROR]", commissionError);
      }
    }

    if (resend) {
      try {
        const safeProduct = escapeHtml(product?.name || productId);
        const safeGuide = escapeHtml(installGuide);
        await resend.emails.send({
          from: "Digital Swarm <onboarding@resend.dev>",
          to: customerEmail,
          subject: `Your Digital Swarm access: ${safeProduct}`,
          html: `
            <div style="font-family:Arial,sans-serif;background:#07070b;color:#f6f1e8;padding:40px">
              <div style="max-width:640px;margin:auto;border:1px solid #302b22;border-radius:20px;padding:32px;background:#0c0c12">
                <p style="letter-spacing:3px;font-size:11px;color:#d9bd7c">DIGITAL SWARM / ACCESS GRANTED</p>
                <h1 style="font-size:30px;margin:18px 0">${safeProduct}</h1>
                <p style="color:#b7b3aa;line-height:1.7">Your payment is verified and your digital asset is ready.</p>
                <div style="margin:24px 0;padding:16px;border-radius:12px;background:#050509;color:#d9bd7c;font-family:monospace;font-size:11px;word-break:break-all">${licenseKey}</div>
                <pre style="white-space:pre-wrap;color:#aaa6a0;font-size:12px;line-height:1.6">${safeGuide}</pre>
                <a href="${secureDownloadUrl}" style="display:block;margin-top:24px;padding:16px;border-radius:12px;background:#d9bd7c;color:#09090d;text-decoration:none;text-align:center;font-weight:800">OPEN SECURE DOWNLOAD</a>
              </div>
            </div>`,
        });
      } catch (resendError) {
        console.error("[RESEND_ERROR]", resendError);
      }
    }

    return NextResponse.json({ success: true, message: "Fulfillment completed" });
  } catch (err) {
    console.error("[FULFILLMENT_ERROR]", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
