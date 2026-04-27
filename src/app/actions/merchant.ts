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

/**
 * PROTOCOL_GENESIS: Registers a new merchant protocol for verification.
 */
export async function createMerchantProduct(data: MerchantProductInput) {
  const user = await currentUser();
  
  if (!user) {
    throw new Error("UNAUTHORIZED_ACCESS_DENIED");
  }

  if (!supabaseAdmin) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const { error } = await supabaseAdmin
    .from("products")
    .insert({
      ...data,
      merchant_id: user.id,
      is_verified: false,
      rating: 5.0,
      in_stock: true,
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error("[MERCHANT_ACTION_ERROR]:", error);
    throw new Error("PROTOCOL_REGISTRATION_FAILED");
  }

  revalidatePath("/merchant");
  revalidatePath("/admin");
  return { success: true };
}

/**
 * PROTOCOL_QUERY: Fetches all protocols associated with the current merchant node.
 */
export async function getMerchantProducts() {
  const user = await currentUser();
  
  if (!user) {
    throw new Error("UNAUTHORIZED_ACCESS_DENIED");
  }

  if (!supabaseAdmin) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("merchant_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}
