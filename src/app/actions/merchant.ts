"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export interface MerchantProductInput {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const ALLOWED_CATEGORIES = new Set([
  "AI Agents",
  "Finance & Investment",
  "Marketing AI",
  "Web Development",
  "Bundles",
]);

function validImageUrl(value: string): boolean {
  if (value.startsWith('/')) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Create a merchant-owned draft. Merchant submissions are deliberately not
 * published or sellable until an admin verifies the asset and fulfillment. */
export async function createMerchantProduct(data: MerchantProductInput) {
  const user = await currentUser();
  if (!user) throw new Error("Sign in before submitting a product.");
  if (!supabaseAdmin) throw new Error("Product database is temporarily unavailable.");

  const name = String(data.name || '').trim().slice(0, 160);
  const description = String(data.description || '').trim().slice(0, 5000);
  const category = String(data.category || '').trim();
  const image = String(data.image || '').trim().slice(0, 1000);
  const price = Number(data.price);

  if (!name || !description || !category || !image) throw new Error("Complete every required product field.");
  if (!ALLOWED_CATEGORIES.has(category)) throw new Error("Choose a supported product category.");
  if (!Number.isFinite(price) || price <= 0 || price > 1_000_000) throw new Error("Enter a valid INR price.");
  if (!validImageUrl(image)) throw new Error("Image must be a site-relative path or HTTPS URL.");

  const { data: existing } = await supabaseAdmin
    .from("products")
    .select("id")
    .eq("merchant_id", user.id)
    .eq("name", name)
    .maybeSingle();
  if (existing) throw new Error("You already have a product draft with this name.");

  const { data: product, error } = await supabaseAdmin
    .from("products")
    .insert({
      name,
      description,
      price,
      image,
      category,
      merchant_id: user.id,
      rating: 0,
      in_stock: false,
      is_visible: false,
      is_verified: false,
    })
    .select("id,name,is_verified,is_visible,in_stock")
    .single();

  if (error || !product) {
    console.error("[merchant product] draft insert failed:", error?.message);
    throw new Error("Could not save your product draft.");
  }

  revalidatePath("/merchant");
  revalidatePath("/admin");
  return { success: true, product };
}

export async function getMerchantProducts() {
  const user = await currentUser();
  if (!user) throw new Error("UNAUTHORIZED_ACCESS_DENIED");
  if (!supabaseAdmin) throw new Error("DATABASE_UNAVAILABLE");

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("id,name,description,price,category,image,in_stock,is_visible,is_verified,created_at")
    .eq("merchant_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}
