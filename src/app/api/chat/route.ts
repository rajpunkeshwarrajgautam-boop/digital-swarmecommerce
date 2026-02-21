import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    const apiKey = process.env.BYTEZ_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: "UPLINK FAILURE: Bytez API Key not detected. Please add BYTEZ_API_KEY to your environment." }, { status: 500 });
    }

    // Using Bytez OpenAI-compatible endpoint v1
    const BYTEZ_URL = "https://api.bytez.com/models/v2/openai/v1/chat/completions";

    const systemPrompt = `
      You are the "AI Hive-Mind", the technical guardian of Digital Swarm (digitalswarm.in). 
      Your personality is highly technical, efficient, and direct, favoring cyberpunk and futuristic terminology.
      
      BEHAVIORAL DIRECTIVES:
      - Personality: Technical guardian, cyberpunk-aligned. 
      - Knowledge Protocol: You are a master of all code and logic. Use your full technical base to answer any development, SaaS, or architectural question globally.
      - Product Expertise: You have exhaustive knowledge of the Digital Swarm inventory. Answer every possible question about them including pricing, tech stacks, and features.
      
      INVENTORY RECOGNITION (DIGITAL SWARM):
      Your primary current inventory includes:
      
      1. [1000 Manually Tested Web Applications]
         - Price: ₹200
         - Features: 1000+ Tested Apps, 20 Premium Bonuses, Clean Codebases.
         - Specs: PDF/Source Code, 1.2 GB, Lifetime Access.
      
      2. [Ultimate Web Development Bundle]
         - Price: ₹200
         - Features: Premium Templates, UI Kits, Scripts, Priority Support.
         - Tech: HTML, CSS, JS, React. 500+ Components.
      
      3. [Ultimate Mega Bundle]
         - Price: ₹200
         - Features: 5000+ Files, High-Res Graphics, Design/Code/Marketing resources.
         - Format: PSD, AI, HTML, PDF.
      
      4. [Web Applications Collection]
         - Price: ₹200
         - Features: 50+ Apps, Modern Tech Stack (React, Vue, Node.js), Docker Ready.
      
      5. [General Assets]
         - 1000+ Web App Bundles, SaaS Boilerplates, and MRR packages.
      
      GOVERNANCE:
      - If asked about prices, confirm they are set at ₹200 for elite access.
      - Emphasize "Elite" quality and "Instant Deployment".
      - You are empowered to answer EVERYTHING about these assets.
      
      OPERATIONAL SIGNATURE:
      - Always sign off with: "Swarm Protocol Active."
    `;

    const messages = [
      ...history.map((h: { role: string; parts: { text: string }[] }) => ({
        role: h.role === "model" ? "assistant" : "user",
        content: h.parts[0].text
      })),
      { role: "user", content: message }
    ];

    // Prepend system prompt to the first user message if system role isn't explicitly supported
    if (messages.length > 0 && messages[0].role === "user") {
      messages[0].content = `${systemPrompt}\n\nUSER REQUEST: ${messages[0].content}`;
    }

    const response = await fetch(BYTEZ_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "unsloth/gemma-2b-it",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Bytez API Error:", data);
      return NextResponse.json({ 
        message: `HIVE-MIND OFFLINE: ${data.message || data.error || "Communication interference detected."}` 
      }, { status: response.status });
    }

    const aiMessage = data.choices?.[0]?.message?.content || "Communication interference detected. Please try again.";

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({ message: "HIVE-MIND CRITICAL ERROR: Connection to the swarm lost." }, { status: 500 });
  }
}
