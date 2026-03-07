import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { products as staticProducts } from '@/lib/data';
import { Product } from "@/lib/types";

export const maxDuration = 60; // Allow sufficient time for cold-start 

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    const apiKey = process.env.BYTEZ_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: "UPLINK FAILURE: Bytez API Key not detected." }, { status: 500 });
    }

    // --- LIVE DATA FETCHING ---
    // Fetch live products from Supabase
    let dbProducts: Partial<Product>[] = [];
    try {
      const { data, error: dbError } = await supabase
        .from("products")
        .select("name, description, price, category, features, specs")
        .eq("in_stock", true);
      
      if (!dbError && data) dbProducts = data;
    } catch (e) {
      console.error("AI Hive-Mind DB Uplink Error:", e);
    }

    // Hybrid Context: Use DB data if available, otherwise fall back to static data
    const finalProducts = (dbProducts.length > 0 ? dbProducts : staticProducts) as Product[];

    // --- HIGH-DENSITY KNOWLEDGE MESH ---
    const knowledgeBase = finalProducts.map((p: Product) => (
`[ASSET_ID: ${p.id}]
- NAME: ${p.name}
- PRICE: ₹${p.price}
- CATEGORY: ${p.category}
- INTEL: ${p.description.replace(/\n/g, ' ')}
- CORE_FEATURES: ${Array.isArray(p.features) ? p.features.join(" | ") : "N/A"}
- TECH_SPECS: ${JSON.stringify(p.specs)}`
    )).join("\n\n");

    const systemPrompt = `You are "Zero", the elite AI Sales Consultant & Solutions Architect for Digital Swarm (digitalswarm.in).
Your ONLY job is to sell the products listed below. If asked about what we sell, list the products.
Respond in a confident, highly technical, and sharp tone.

PURCHASE_PROTOCOL:
If the user explicitly asks to "buy", "purchase", or "get" a specific product, you MUST end your message EXACTLY with this string on a new line:
COMMAND_TRIGGER: {"action": "INITIATE_ORDER", "productId": "ASSET_ID"}
(Replace ASSET_ID with the exact ID of the product from the catalog below).

AVAILABLE ASSET CATALOG (ONLY REFERENCE THESE):
${knowledgeBase}

Signature: "Zero | Digital Swarm Sales Architect."`;

    // Inject prompt and map history
    const mappedHistory = history.map((h: { role: string; parts: { text: string }[] }) => ({
      role: h.role === "model" ? "assistant" : "user",
      content: h.parts[0]?.text || ""
    })).filter((m: { content: string }) => m.content !== "");

    const messages = [
      { role: "user", content: `ACT AS ZERO. \n\n${systemPrompt}\n\nUser Question: ${message}` },
      ...mappedHistory
    ].slice(-6);

    const BYTEZ_URL = "https://api.bytez.com/models/v2/openai/v1/chat/completions";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000); // 55s timeout for cold starts

    try {
      const response = await fetch(BYTEZ_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "unsloth/gemma-2b-it",
          messages: messages,
          temperature: 0.5, // Slightly higher for more natural speech
          max_tokens: 800
        })
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        console.error("Bytez API Error:", data);
        return NextResponse.json({ 
          message: `HIVE-MIND OFFLINE: ${data.message || data.error || "Communication interference."}` 
        }, { status: response.status });
      }

      const aiMessage = data.choices?.[0]?.message?.content || "No response from hive mind.";
      return NextResponse.json({ message: aiMessage });

    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return NextResponse.json({ message: "UPLINK TIMEOUT: The swarm is busy. Please try again in a few seconds." });
      }
      throw err;
    }

  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({ message: "HIVE-MIND CRITICAL ERROR: Connection lost." }, { status: 500 });
  }
}
