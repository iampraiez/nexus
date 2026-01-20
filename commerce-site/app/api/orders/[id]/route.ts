import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(
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

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const db = await getDB();
    const ordersCollection = db.collection("orders");

    // Auto-delivery logic for single order
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    
    await ordersCollection.updateOne(
      {
        _id: new ObjectId(id),
        userId: new ObjectId(session.user.id),
        status: "paid",
        createdAt: { $lt: thirtySecondsAgo }
      },
      {
        $set: { status: "delivered", updatedAt: new Date() }
      }
    );

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

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
