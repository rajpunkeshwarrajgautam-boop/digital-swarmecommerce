import { NextResponse } from "next/server";
import { products as staticProducts } from "@/lib/data";
import { isSellableProductId, sanitizePublicProduct } from "@/lib/catalog-integrity";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

const catalog = staticProducts
  .filter((product) => product.inStock && isSellableProductId(product.id))
  .map(sanitizePublicProduct);

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function productScore(message: string, product: (typeof catalog)[number]) {
  const queryTokens = new Set(normalize(message).split(" ").filter((token) => token.length > 1));
  const haystack = normalize(`${product.id} ${product.name} ${product.category} ${product.description} ${(product.features || []).join(" ")}`);
  let score = 0;
  for (const token of queryTokens) {
    if (haystack.includes(token)) score += token.length >= 5 ? 3 : 1;
  }
  if (haystack.includes(normalize(product.name))) score += 3;
  return score;
}

function findMatches(message: string) {
  return catalog
    .map((product) => ({ product, score: productScore(message, product) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
    .slice(0, 3)
    .map(({ product }) => product);
}

function detectPurchase(message: string) {
  const normalized = normalize(message);
  const purchaseIntent = /\b(buy|purchase|order|get)\b/.test(normalized);
  if (!purchaseIntent) return null;

  const explicit = catalog.find((product) => {
    const name = normalize(product.name);
    const id = normalize(product.id);
    return normalized.includes(name) || normalized.includes(id);
  });
  if (explicit) return explicit;

  const matches = findMatches(message);
  return matches.length === 1 ? matches[0] : null;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
    try {
      await limiter.check(10, ip);
    } catch {
      return NextResponse.json(
        { message: "Too many requests. Please try the catalog assistant again in about a minute." },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => null);
    const message = typeof body?.message === "string" ? body.message.trim().slice(0, 800) : "";
    if (!message) {
      return NextResponse.json({ message: "Enter a product name, category, use case, or a command such as ‘open cart’." }, { status: 400 });
    }

    const normalized = normalize(message);
    if (normalized === "cart" || normalized.includes("open cart")) {
      return NextResponse.json({ message: "Opening your cart.\nCOMMAND_TRIGGER: {\"action\":\"OPEN_CART\",\"productId\":\"\"}" });
    }

    const purchase = detectPurchase(message);
    if (purchase) {
      return NextResponse.json({
        message:
          `${purchase.name} is currently listed at ₹${purchase.price.toLocaleString("en-IN")} for the Standard licence. Review the product scope and licence before checkout.\n` +
          `COMMAND_TRIGGER: {"action":"INITIATE_ORDER","productId":"${purchase.id}"}`,
      });
    }

    const matches = findMatches(message);
    if (!matches.length) {
      return NextResponse.json({
        message: "I could not match that request to a currently approved product. Try a product name or terms such as AI agent, playbook, SaaS, finance, sales, marketing, or source code.",
      });
    }

    const lines = matches.map(
      (product, index) =>
        `${index + 1}. ${product.name} — ₹${product.price.toLocaleString("en-IN")} — ${product.category} — /product/${product.id}`,
    );

    return NextResponse.json({
      message: `Closest approved catalog matches:\n${lines.join("\n")}\n\nPrices above are current INR catalog prices; checkout revalidates them on the server.`,
    });
  } catch (error) {
    console.error("[catalog-assistant] Unexpected failure", error);
    return NextResponse.json({ message: "The catalog assistant is temporarily unavailable. Please use /products or /search." }, { status: 500 });
  }
}
