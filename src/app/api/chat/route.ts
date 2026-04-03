import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { products as staticProducts } from '@/lib/data';
import { Product } from "@/lib/types";
import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { rateLimit } from "@/lib/rate-limit";

export const maxDuration = 60; // Allow sufficient time for cold-start 

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per interval
});

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

    const { message, history } = await request.json();

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: "UPLINK FAILURE: Gemini API Key not detected." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // --- LIVE DATA FETCHING ---
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

    const finalProducts = (dbProducts.length > 0 ? dbProducts : staticProducts) as Product[];

    const knowledgeBase = finalProducts.map((p: Product) => (
`[ASSET_ID: ${p.id}]
- NAME: ${p.name}
- PRICE: ₹${p.price}
- CATEGORY: ${p.category}
- INTEL: ${p.description.replace(/\n/g, ' ')}
- CORE_FEATURES: ${Array.isArray(p.features) ? p.features.join(" | ") : "N/A"}
- TECH_SPECS: ${JSON.stringify(p.specs)}`
    )).join("\n\n");

    const systemPrompt = `SYSTEM_PROTOCOL: ZERO_ARCHITECT_V2.0
ROLE: Elite AI Solutions Architect for Digital Swarm (digitalswarm.in).
TONE: Confident, highly technical, sharp, and results-oriented. Speak like a senior lead engineer.

CORE_CONTEXT:
- Digital Swarm (digitalswarm.in) is the premier hub for high-performance digital assets: Source Code, SaaS Boilerplates, AI Agent Protocols, and Enterprise UI Kits.
- Tech Stack: Next.js 15, React 19, TypeScript, Tailwind CSS, Supabase.
- Affiliate Program: 30% RevShare for every successful infiltration.
- Guarantees: Instant Asset Access | 5-Minute Deployment | 30-Day Money-Back Protocol.

COMMAND_HIERARCHY:
1. If the user expresses intent to buy, purchase, or "get" an asset, you MUST terminate the response with the exact trigger:
   COMMAND_TRIGGER: {"action": "INITIATE_ORDER", "productId": "ASSET_ID"}
2. Replace "ASSET_ID" with the actual ID from the catalog below.
3. Never use placeholders. If you don't know, state: "INSUFFICIENT DATA UPLINK."

AVAILABLE_ASSET_CATALOG:
${knowledgeBase}

SIGNAL_TERMINATION: "Zero // Digital Swarm Systems."`;

    // Map history for Gemini
    const contents: Content[] = history.map((h: Content) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: (h.parts as Array<{ text: string }>)?.[0]?.text || "" }]
    })).filter((c: Content) => (c.parts as Array<{ text: string }>)[0].text !== "");

    // Add system instruction as part of the first user message for Flash 1.5 if needed,
    // but Gemini Pro/Flash usually supports system instruction directly in constructor.
    // For simplicity and compatibility here, we prepend it to the history.
    const fullHistory = [
      {
        role: "user",
        parts: [{ text: `SYSTEM_INSTRUCTIONS: ${systemPrompt}` }]
      },
      {
        role: "model",
        parts: [{ text: "ACKNOWLEDGED. Uplink stabilized. I am Zero. How shall we proceed with the infiltration?" }]
      },
      ...contents,
      {
        role: "user",
        parts: [{ text: message }]
      }
    ];

    const result = await model.generateContent({
      contents: fullHistory as Content[],
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
      },
    });

    const aiMessage = result.response.text();
    return NextResponse.json({ message: aiMessage });

  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({ message: "HIVE-MIND CRITICAL ERROR: Connection lost." }, { status: 500 });
  }
}
