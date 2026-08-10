import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { products } from "@/lib/data";
import { isSellableProductId } from "@/lib/catalog-integrity";
import { rateLimit } from "@/lib/rate-limit";

const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const BUCKET = "review-media";
const limiter = rateLimit({ interval: 60 * 60 * 1000, uniqueTokenPerInterval: 500 });

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Sign in to upload review media." }, { status: 401 });
    if (!supabaseAdmin) return NextResponse.json({ error: "Upload service unavailable" }, { status: 503 });

    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    try {
      await limiter.check(20, `${user.id}:${ip}`);
    } catch {
      return NextResponse.json({ error: "Too many upload attempts." }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const productSlug = String(formData.get("product_id") || "").trim();
    if (!file || !productSlug) return NextResponse.json({ error: "File and product are required" }, { status: 400 });

    const product = products.find((entry) => entry.id === productSlug && entry.inStock && isSellableProductId(entry.id));
    if (!product) return NextResponse.json({ error: "Unknown product" }, { status: 400 });

    const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress;
    if (!email) return NextResponse.json({ error: "Your account needs an email address" }, { status: 400 });

    const { data: dbProduct } = await supabaseAdmin.from("products").select("id").eq("name", product.name).maybeSingle();
    if (!dbProduct?.id) return NextResponse.json({ error: "Product mapping unavailable" }, { status: 503 });

    const { data: license } = await supabaseAdmin
      .from("customer_licenses")
      .select("id")
      .eq("user_email", email.toLowerCase())
      .eq("product_id", dbProduct.id)
      .limit(1)
      .maybeSingle();
    if (!license) return NextResponse.json({ error: "Only verified purchasers can upload review media." }, { status: 403 });

    const extension = ALLOWED_TYPES.get(file.type);
    if (!extension) return NextResponse.json({ error: "Allowed image types: JPEG, PNG, WebP" }, { status: 400 });
    if (file.size <= 0 || file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Image must be 5 MB or smaller" }, { status: 400 });

    const path = `${dbProduct.id}/${user.id}/${randomUUID()}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { data, error } = await supabaseAdmin.storage.from(BUCKET).upload(path, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

    if (error || !data?.path) {
      console.error("[review upload] storage failure:", error?.message);
      return NextResponse.json({ error: "Upload failed" }, { status: 503 });
    }

    const { data: publicData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(data.path);
    return NextResponse.json({ url: publicData.publicUrl });
  } catch (error) {
    console.error("[review upload] unexpected error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
