import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { ObjectId } from "mongodb";
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
    const { items, subtotal, taxAmount, total } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: "Cart is empty" },
        { status: 400 }
      );
    }

    const db = await getDB();
    const ordersCollection = db.collection("orders");

    // Create order in database with "paid" status (Demo Mode - No payment required)
    const orderResult = await ordersCollection.insertOne({
      userId: new ObjectId(session.user.id),
      userEmail: session.user.email,
      items,
      subtotal: subtotal || items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
      taxAmount: taxAmount || 0,
      total: total || items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
      status: "paid", // Demo mode - instantly paid
      createdAt: new Date()
    });

    const orderId = orderResult.insertedId.toString();

    // Return success immediately (no Stripe involved)
    return NextResponse.json(
      {
        orderId,
        message: "Order placed successfully"
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
