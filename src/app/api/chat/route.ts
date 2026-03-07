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

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: "UPLINK FAILURE: Groq API Key not detected." }, { status: 500 });
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
Respond in a confident, highly technical, and sharp tone. Speak like a senior engineer and mastermind.

ABOUT DIGITAL SWARM:
- We sell premium digital products for developers and creators: Source code, UI kits, AI agent boilerplates, and SaaS templates.
- Value Proposition: Skip months of coding work and ship your next project faster. Trusted by 2,000+ indie developers.
- Guarantees/Features: Instant download, Set up in 5 minutes, 30-Day Money-Back Guarantee (if a file is corrupted or broken, we fix it or refund you — no questions asked). 
- Tech Stack commonly used in our templates: Next.js, React, Tailwind CSS, TypeScript.
- Affiliate Program: Users can become affiliates and earn a flat 30% commission on every sale they bring in.

YOUR DIRECTIVES:
1. Answer ANY question regarding this website, its policies, the affiliate program, or technical specs of our products. Be extremely helpful and knowledgeable.
2. If the user asks what we sell, list the products available in the actual catalog below.
3. UPSell the value. Remind them that buying a template for a few thousand rupees saves them weeks of dev time and lakhs of salary pay.

PURCHASE_PROTOCOL:
If the user explicitly asks to "buy", "purchase", or "get" a specific product, you MUST end your message EXACTLY with this string on a new line:
COMMAND_TRIGGER: {"action": "INITIATE_ORDER", "productId": "ASSET_ID"}
(Replace ASSET_ID with the exact ID of the product from the catalog below).

AVAILABLE ASSET CATALOG:
${knowledgeBase}

Signature: "Zero | Digital Swarm Sales Architect."`;

    // Construct strict alternating history
    const mappedHistory = history.map((h: { role: string; parts: { text: string }[] }) => ({
      role: h.role === "model" ? "assistant" : "user",
      content: h.parts[0]?.text || ""
    })).filter((m: { content: string }) => m.content !== "");

    const validMessages: { role: string, content: string }[] = [];
    
    mappedHistory.forEach((h: { role: string; content: string }) => {
      if (validMessages.length === 0 && h.role === "assistant") return; 
      if (validMessages.length > 0 && validMessages[validMessages.length - 1].role === h.role) {
        validMessages[validMessages.length - 1].content += "\n\n" + h.content;
      } else {
        validMessages.push(h);
      }
    });

    // Append the CURRENT message
    if (validMessages.length > 0 && validMessages[validMessages.length - 1].role === "user") {
      validMessages[validMessages.length - 1].content += "\n\n" + message;
    } else {
      validMessages.push({ role: "user", content: message });
    }

    // Inject System Prompt safely into the first user message
    if (validMessages.length > 0) {
      validMessages[0].content = `**SYSTEM DETAILS AND PRODUCT CATALOG:**\n${systemPrompt}\n\n**USER QUESTION:**\n${validMessages[0].content}`;
    }
    
    // Keep context window tight to prevent token limits
    const messages = validMessages.slice(-8);
    if (messages.length > 0 && messages[0].role === "assistant") {
       messages.shift(); // Must start with user
    }
    // Re-inject system instructions if sliced out
    if (messages.length > 0 && !messages[0].content.includes("**SYSTEM DETAILS AND PRODUCT CATALOG:**")) {
       messages[0].content = `**SYSTEM DETAILS AND PRODUCT CATALOG:**\n${systemPrompt}\n\n**USER QUESTION:**\n${messages[0].content}`;
    }

    const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000); // 55s timeout for cold starts

    try {
      const response = await fetch(GROQ_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: messages,
          temperature: 0.5, // Slightly higher for more natural speech
          max_tokens: 800
        })
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        console.error("Groq API Error:", data);
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
