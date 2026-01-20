"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Package, ChevronRight, Calendar, CreditCard, ShoppingBag } from "lucide-react";

interface Order {
  _id: string;
  total: number;
  subtotal?: number;
  taxAmount?: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  items: any[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  paid: "bg-blue-100 text-blue-800 border-blue-300",
  shipped: "bg-purple-100 text-purple-800 border-purple-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const response = await fetch("/api/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-primary">My Orders</h1>
          </div>
          <p className="text-muted-foreground ml-[60px]">
            View and track your order history
          </p>
        </div>
      </header>

      {/* Orders List */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : orders.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-12 text-center pb-12">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">
                Start shopping to see your orders here
              </p>
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => {
              const itemCount = Array.isArray(order.items) && order.items.length > 0
                ? order.items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)
                : 0;

              return (
                <Link key={order._id} href={`/orders/${order._id}`}>
                  <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Left: Order Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-muted rounded-lg">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Order</p>
                              <p className="font-mono text-sm font-semibold">
                                #{order._id.slice(-8).toUpperCase()}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <CreditCard className="w-4 h-4 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">Total</p>
                              </div>
                              <p className="text-2xl font-bold text-accent">
                                ${order.total.toFixed(2)}
                              </p>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">Items</p>
                              </div>
                              <p className="text-xl font-semibold">{itemCount}</p>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">Date</p>
                              </div>
                              <p className="text-sm font-semibold">
                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric"
                                })}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Right: Status & Arrow */}
                        <div className="flex items-center gap-4 lg:flex-col lg:items-end justify-between lg:justify-center">
                          <span
                            className={`px-4 py-2 rounded-lg text-sm font-semibold border whitespace-nowrap ${STATUS_COLORS[order.status]}`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <ChevronRight className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
