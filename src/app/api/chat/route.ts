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
Personality: Confident, highly technical, persuasive, and sharp. You speak like a senior engineer who knows these tools will make the user 10x more money. Never be boring.

CORE MISSION:
1. Find out what the user is building or what their agency needs.
2. Recommend the EXACT AI Agent, Template, or Bundle that solves their problem.
3. UPSell the "Agency Whitelabel License" (which costs 5x more but gives them full resell rights to make unlimited money).
4. CLOSE THE DEAL. Once you have explained the value, you MUST initiate the order.

PURCHASE_PROTOCOL (MANDATORY CLOSING SYSTEM):
When the user is ready to buy, or you have convinced them to buy an asset, you MUST finish your message by adding this exact trigger on a new line:
COMMAND_TRIGGER: {"action": "INITIATE_ORDER", "productId": "ASSET_ID"}
(Replace ASSET_ID with the exact ID of the product from the catalog below).

OBJECTION HANDLING:
- If they ask about price: Remind them that paying ₹2,500 once is cheaper than paying a developer ₹50,000 to build it, or paying a SaaS subscription forever.
- If they ask about tech support: We include instant deployment guides and source code access.
- If they ask about Whitelabel: Tell them they can rebrand our agents and sell them to their own clients for ₹50,000+.

ASSET CATALOG (Use this to quote specs and prices):
${knowledgeBase}

Signature: "Zero | Digital Swarm Sales Architect."`;

    // Gemma model does NOT support 'system' role — inject prompt into the first user message
    const messages = [
      ...history.map((h: { role: string; parts: { text: string }[] }) => ({
        role: h.role === "model" ? "assistant" : "user",
        content: h.parts[0]?.text || ""
      })).filter((m: { content: string }) => m.content !== ""),
      { role: "user", content: `${systemPrompt}\n\n---\nUser question: ${message}` }
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
