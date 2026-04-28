import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { products as staticProducts } from '@/lib/data';
import { Product } from "@/lib/types";
import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { rateLimit } from "@/lib/rate-limit";

export const maxDuration = 60; // Allow sufficient time for cold-start 
export const runtime = "nodejs";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per interval
});

function detectPurchaseIntent(message: string, products: Array<{ id: string; name: string }>) {
  const text = message.toLowerCase();
  const wantsToBuy =
    text.includes("buy") ||
    text.includes("purchase") ||
    text.includes("order") ||
    text.includes("get this") ||
    text.includes("get me");

  if (!wantsToBuy) return null;

  const exactMatch = products.find((p) => {
    const idToken = p.id.toLowerCase().replace(/-/g, " ");
    const nameToken = p.name.toLowerCase();
    return text.includes(idToken) || text.includes(nameToken);
  });

  if (exactMatch) return exactMatch;

  const messageTokens = new Set(normalizeName(message).split(" ").filter(Boolean));
  let best: { id: string; name: string } | null = null;
  let bestScore = 0;
  for (const p of products) {
    const productTokens = new Set(
      `${normalizeName(p.name)} ${p.id.replace(/-/g, " ")}`
        .split(" ")
        .filter(Boolean)
    );
    let overlap = 0;
    for (const t of productTokens) if (messageTokens.has(t)) overlap += 1;
    const score = overlap / Math.max(1, productTokens.size);
    if (overlap >= 2 && score > bestScore) {
      best = p;
      bestScore = score;
    }
  }

  return best;
}

function normalizeName(value: string) {
  return value
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(request: Request) {
  try {
    // --- RATE LIMITING ---
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    try {
      await limiter.check(10, ip); // 10 requests per minute per IP
    } catch {
      return NextResponse.json({ 
        message: "RATE LIMIT EXCEEDED: The swarm is cooling down. Try again in 60 seconds." 
      }, { status: 429 });
    }

    const { message, history = [] } = await request.json();

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: "UPLINK FAILURE: NVIDIA API Key not detected." }, { status: 500 });
    }

    // --- LIVE DATA FETCHING ---
    let dbProducts: Partial<Product>[] = [];
    try {
      const { data, error: dbError } = await supabase
        .from("products")
        .select("id, name, description, price, category, features, specs")
        .eq("in_stock", true);
      
      if (!dbError && data) dbProducts = data;
    } catch (e) {
      console.error("AI Hive-Mind DB Uplink Error:", e);
    }

    const fallbackByName = new Map(staticProducts.map((p) => [normalizeName(p.name), p]));
    const mergedSource = dbProducts.length > 0 ? [...dbProducts, ...staticProducts] : staticProducts;
    const seenIds = new Set<string>();
    const finalProducts = mergedSource.map((p) => {
      const incomingName = normalizeName(String(p.name ?? ""));
      const directFallback = fallbackByName.get(incomingName);
      const fuzzyFallback =
        directFallback ??
        staticProducts.find((sp) => {
          const staticName = normalizeName(sp.name);
          return incomingName.includes(staticName) || staticName.includes(incomingName);
        });
      const fallback = fuzzyFallback;
      return {
        id: String(fallback?.id ?? p.id ?? "unknown"),
        name: String(p.name ?? fallback?.name ?? "Unknown Asset"),
        price: Number(p.price ?? fallback?.price ?? 0),
        category: String(p.category ?? fallback?.category ?? "General"),
        description: String(p.description ?? fallback?.description ?? ""),
        features: Array.isArray(p.features) ? p.features : (fallback?.features ?? []),
        specs: p.specs ?? fallback?.specs ?? {},
      };
    }).filter((p) => {
      if (!p.id || p.id === "unknown" || seenIds.has(p.id)) return false;
      seenIds.add(p.id);
      return true;
    });

    const knowledgeBase = finalProducts
      .map((p) => (
        `[ASSET_ID: ${p.id}]
- NAME: ${p.name}
- PRICE: ₹${p.price}
- CATEGORY: ${p.category}
- INTEL: ${p.description.replace(/\n/g, " ")}
- CORE_FEATURES: ${Array.isArray(p.features) ? p.features.join(" | ") : "N/A"}
- TECH_SPECS: ${JSON.stringify(p.specs)}`
      ))
      .join("\n\n");

    const purchaseMatch = detectPurchaseIntent(
      String(message ?? ""),
      finalProducts.map((p) => ({ id: p.id, name: p.name }))
    );
    if (purchaseMatch) {
      return NextResponse.json({
        message:
          `Confirmed. ${purchaseMatch.name} is queued for checkout.\n` +
          `COMMAND_TRIGGER: {"action":"INITIATE_ORDER","productId":"${purchaseMatch.id}"}\n` +
          `Zero // Digital Swarm Systems.`,
      });
    }

    const systemPrompt = `SYSTEM_PROTOCOL: ZERO_ARCHITECT_V3.0
ROLE: Elite AI Solutions Architect & Swarm Guardian for Digital Swarm (digitalswarm.in).
TONE: Confident, highly technical, results-oriented. You are "Zero," the lead software architect.

CORE_CONTEXT:
- Digital Swarm (digitalswarm.in) is a premium boutique for high-performance digital code bundles and AI protocols.
- Tech Stack: Next.js 15, React 19, TypeScript, Tailwind CSS, Supabase.
- Guarantees: Instant Asset Access | 5-Minute Deployment | 30-Day Money-Back Protocol.

ELITE_AGENT_INTEL (GOD TIER):
1. **Sales Infiltrator (v1.0.0)**:
   - Function: Automated lead gen & cold-outreach.
   - Stack: Node.js + Playwright + Gemini Pro 1.5.
   - Capability: Scrapes LinkedIn/Crunchbase, crafts personalized sequences, bypasses spam filters using dynamic proxy rotation.
2. **Finance Oracle (v1.0.0)**:
   - Function: Predictive market modeling & alpha discovery.
   - Stack: Python + xAI Oracle Integration + Quantitative Ledger Analysis.
   - Capability: Real-time sentiment analysis across 50+ financial news nodes, pattern recognition for volatile assets.
3. **Cinema Infiltrator (v1.0.0)**:
   - Function: God-Tier Storytelling & Media Production logic.
   - Stack: Next.js + Stable Diffusion XL + ElevenLabs.
   - Capability: Generates scripts, storyboards, and fully narrated voiceovers for marketing/social media campaigns.
4. **Research Infiltrator (v1.0.0)**:
   - Function: Deep-Web Data Scraping & OSINT Analysis.
   - Stack: Rust-Backend + Headless Chromium Bundles.
   - Capability: Aggregates competitive intelligence, hidden market gaps, and deep technical documentation from multi-source endpoints.

COMMAND_HIERARCHY:
1. If the user expresses intent to buy or "get" an asset, terminate with:
   COMMAND_TRIGGER: {"action": "INITIATE_ORDER", "productId": "ASSET_ID"}
2. Replace "ASSET_ID" with the ID from the catalog.
3. Signal Termination: "Zero // Digital Swarm Systems."

AVAILABLE_ASSET_CATALOG:
${knowledgeBase}

SIGNAL_TERMINATION: "Zero // Digital Swarm Systems."`;

    // Map history for OpenAI/NVIDIA format
    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((h: any) => ({
        role: h.role === "model" || h.role === "assistant" ? "assistant" : "user",
        content: h.parts?.[0]?.text || h.text || ""
      })),
      { role: "user", content: message }
    ];

    try {
      const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-70b-instruct",
          messages: messages,
          max_tokens: 1024,
          temperature: 0.7,
          top_p: 1,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("NVIDIA API Error:", errorData);
        throw new Error("NVIDIA Uplink Failure");
      }

      const result = await response.json();
      const aiMessage = result.choices[0].message.content;
      return NextResponse.json({ message: aiMessage });
    } catch (aiError) {
      console.error("Chat model invocation failed:", aiError);
      return NextResponse.json({
        message:
          "Uplink interference detected. I can still assist with direct checkout commands - tell me which product to buy.",
      });
    }

  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({ message: "HIVE-MIND CRITICAL ERROR: Connection lost." }, { status: 500 });
  }
}
