"use server";

import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export interface StripeCartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface StripeCustomer {
  email: string;
  firstName?: string;
  lastName?: string;
}

export async function createStripeSession(items: StripeCartItem[], customer: StripeCustomer) {
  try {
    const user = await currentUser();
    const origin = (await headers()).get("origin");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
            images: [item.image],
            metadata: {
              productId: item.productId,
            },
          },
          unit_amount: item.price * 100, // Stripe uses cents/paise
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${origin}/dashboard?purchase_success=true`,
      cancel_url: `${origin}/checkout?canceled=true`,
      customer_email: user?.emailAddresses[0].emailAddress || customer.email,
      metadata: {
        clerkId: user?.id || "guest",
        orderItems: JSON.stringify(items.map(i => ({ id: i.productId, q: i.quantity }))),
      },
    });

    return { success: true, sessionId: session.id, url: session.url };
  } catch (error) {
    console.error("[Stripe Session Error]", error);
    return { success: false, error: "Payment Uplink Failure" };
  }
}
