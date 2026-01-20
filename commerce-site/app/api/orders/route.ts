import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = await getDB();
    const ordersCollection = db.collection("orders");

    // Auto-delivery logic: Update "paid" orders older than 30 seconds to "delivered"
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    
    await ordersCollection.updateMany(
      {
        userId: new ObjectId(session.user.id),
        status: "paid",
        createdAt: { $lt: thirtySecondsAgo }
      },
      {
        $set: { status: "delivered", updatedAt: new Date() }
      }
    );

    const orders = await ordersCollection
      .find({ userId: new ObjectId(session.user.id) })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
