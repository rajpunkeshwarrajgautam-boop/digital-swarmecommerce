import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { products as staticProducts } from "@/lib/data";

function isProductUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
}

/**
 * PDPs often expose a static-catalog slug as `product.id` (see `/api/products/[id]`).
 * `reviews.product_id` in Supabase is usually the real `products.id` UUID — querying
 * with a slug breaks UUID columns. Resolve slug → DB id when possible.
 */
async function resolveReviewsProductId(rawId: string): Promise<string | null> {
  if (isProductUuid(rawId)) return rawId;
  const staticProduct = staticProducts.find((p) => p.id === rawId);
  if (!staticProduct || !supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("id")
    .eq("name", staticProduct.name)
    .maybeSingle();
  if (error) {
    console.warn("[reviews] resolve product id:", error.message);
    return null;
  }
  return data?.id ?? null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json([]);
  }

  const resolved = await resolveReviewsProductId(productId);
  if (!resolved) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .eq("product_id", resolved)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[reviews] GET:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, user_name, rating, comment, verified, images } = body;

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    if (!product_id || typeof product_id !== "string") {
      return NextResponse.json({ error: "product_id required" }, { status: 400 });
    }

    const resolvedProductId = await resolveReviewsProductId(product_id);
    if (!resolvedProductId) {
      return NextResponse.json(
        { error: "Unknown product — cannot attach review" },
        { status: 400 }
      );
    }

    const row: Record<string, unknown> = {
      product_id: resolvedProductId,
      user_name,
      rating,
      comment,
      verified: verified || false,
    };
    const imageList = Array.isArray(images) ? images : [];
    if (imageList.length > 0) {
      row.images = imageList;
    }

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .insert([row])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Review creation failed:", error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
