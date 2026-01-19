import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { ObjectId } from "mongodb";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    try {
      await checkRateLimit(ip, "checkout", 10, 60); // 10 attempts per minute
    } catch (error) {
      return NextResponse.json(
        { message: "Too many checkout attempts. Please try again later." },
        { status: 429 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: "Cart is empty" },
        { status: 400 }
      );
    }

    const db = await getDB();
    const ordersCollection = db.collection("orders");

    // Create order in database
    const orderResult = await ordersCollection.insertOne({
      userId: new ObjectId(session.user.id),
      userEmail: session.user.email,
      items,
      total: items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
      status: "pending",
      createdAt: new Date()
    });

    const orderId = orderResult.insertedId.toString();

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.image]
          },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.quantity
      })),
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?orderId=${orderId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout/cancel`,
      customer_email: session.user.email,
      metadata: {
        orderId,
        userId: session.user.id
      }
    });

    return NextResponse.json(
      {
        sessionId: checkoutSession.id,
        orderId
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
