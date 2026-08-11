import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { products as staticProducts } from "@/lib/data";
import { isSellableProductId } from "@/lib/catalog-integrity";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({ interval: 60 * 60 * 1000, uniqueTokenPerInterval: 500 });

function isProductUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

async function resolveReviewsProductId(rawId: string): Promise<{ id: string; slug?: string } | null> {
  if (!supabaseAdmin) return null;
  if (isProductUuid(rawId)) {
    const { data } = await supabaseAdmin.from("products").select("id,name").eq("id", rawId).maybeSingle();
    if (!data) return null;
    const staticProduct = staticProducts.find((product) => product.name === data.name);
    if (!staticProduct || !isSellableProductId(staticProduct.id)) return null;
    return { id: data.id, slug: staticProduct.id };
  }

  const staticProduct = staticProducts.find((product) => product.id === rawId && product.inStock && isSellableProductId(product.id));
  if (!staticProduct) return null;
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("id")
    .eq("name", staticProduct.name)
    .maybeSingle();
  if (error || !data?.id) return null;
  return { id: data.id, slug: staticProduct.id };
}

export async function GET(request: Request) {
  const productId = new URL(request.url).searchParams.get("productId")?.trim() || "";
  if (!productId) return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  if (!supabaseAdmin) return NextResponse.json([], { status: 200 });

  const resolved = await resolveReviewsProductId(productId);
  if (!resolved) return NextResponse.json([]);

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("id,user_name,rating,comment,verified_purchase,images,created_at")
    .eq("product_id", resolved.id)
    .eq("verified_purchase", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[reviews] read failed:", error.message);
    return NextResponse.json({ error: "Reviews unavailable" }, { status: 503 });
  }

  return NextResponse.json((data || []).map((review) => ({
    id: review.id,
    user_name: review.user_name || "Verified customer",
    rating: review.rating,
    comment: review.comment || "",
    verified: true,
    images: review.images || [],
    created_at: review.created_at,
  })));
}

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Sign in to review a purchase." }, { status: 401 });
    if (!supabaseAdmin) return NextResponse.json({ error: "Review service unavailable" }, { status: 503 });

    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    try {
      await limiter.check(10, `${user.id}:${ip}`);
    } catch {
      return NextResponse.json({ error: "Too many review attempts. Try again later." }, { status: 429 });
    }

    const body = await request.json();
    const productId = typeof body?.product_id === "string" ? body.product_id.trim() : "";
    const rating = Number(body?.rating);
    const comment = typeof body?.comment === "string" ? body.comment.trim().slice(0, 5000) : "";
    const images = Array.isArray(body?.images)
      ? body.images.filter((value: unknown): value is string => typeof value === "string" && value.length <= 1000).slice(0, 4)
      : [];

    if (!productId || !Number.isInteger(rating) || rating < 1 || rating > 5 || comment.length < 2) {
      return NextResponse.json({ error: "Rating and review text are required." }, { status: 400 });
    }

    const resolved = await resolveReviewsProductId(productId);
    if (!resolved) return NextResponse.json({ error: "Unknown or unavailable product" }, { status: 400 });

    const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress;
    if (!email) return NextResponse.json({ error: "Your account needs an email address." }, { status: 400 });

    const { data: license, error: licenseError } = await supabaseAdmin
      .from("customer_licenses")
      .select("id")
      .eq("user_email", email.toLowerCase())
      .eq("product_id", resolved.id)
      .limit(1)
      .maybeSingle();

    if (licenseError) {
      console.error("[reviews] purchase verification failed:", licenseError.message);
      return NextResponse.json({ error: "Could not verify purchase" }, { status: 503 });
    }
    if (!license) return NextResponse.json({ error: "Only verified purchasers can review this product." }, { status: 403 });

    const userName = user.fullName || user.username || user.firstName || "Verified customer";
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .upsert({
        user_id: user.id,
        user_name: userName.slice(0, 120),
        product_id: resolved.id,
        rating,
        comment,
        images,
        verified_purchase: true,
      }, { onConflict: "user_id,product_id" })
      .select("id,user_name,rating,comment,verified_purchase,images,created_at")
      .single();

    if (error || !data) {
      console.error("[reviews] write failed:", error?.message);
      return NextResponse.json({ error: "Could not save review" }, { status: 503 });
    }

    return NextResponse.json({
      id: data.id,
      user_name: data.user_name || "Verified customer",
      rating: data.rating,
      comment: data.comment || "",
      verified: true,
      images: data.images || [],
      created_at: data.created_at,
    });
  } catch (error) {
    console.error("[reviews] invalid request:", error);
    return NextResponse.json({ error: "Invalid review request" }, { status: 400 });
  }
}
