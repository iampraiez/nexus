import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Await params in Next.js 15+
    const { id } = await params;

    const db = await getDB();
    const ordersCollection = db.collection("orders");

    const order = await ordersCollection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(session.user.id)
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    // Can only cancel orders that are not delivered or already cancelled
    if (order.status === "delivered" || order.status === "cancelled") {
      return NextResponse.json(
        { message: `Cannot cancel order with status: ${order.status}` },
        { status: 400 }
      );
    }

    // Update order status to cancelled
    const result = await ordersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "cancelled",
          updatedAt: new Date()
        }
      },
      { returnDocument: "after" }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
