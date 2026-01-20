"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowLeft, Package, Trash2, Calendar, CreditCard } from "lucide-react";
import Image from "next/image";

interface Order {
  _id: string;
  total: number;
  subtotal?: number;
  taxAmount?: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  paid: "bg-blue-100 text-blue-800 border-blue-300",
  shipped: "bg-purple-100 text-purple-800 border-purple-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300"
};

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/${params.id}`);
        if (!response.ok) throw new Error("Order not found");
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError("Failed to load order");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [params.id]);

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      const response = await fetch(`/api/orders/${params.id}/cancel`, {
        method: "POST"
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to cancel order");
      }
      
      const result = await response.json();
      if (result.success) {
        setOrder((prev) => prev ? { ...prev, status: "cancelled" } : null);
      }
      setShowCancelDialog(false);
    } catch (err: any) {
      setError(err.message || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Button asChild variant="ghost" className="gap-2">
              <Link href="/orders">
                <ArrowLeft className="w-4 h-4" />
                Back to Orders
              </Link>
            </Button>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-red-600">{error || "Order not found"}</p>
        </main>
      </div>
    );
  }

  // Calculate values with fallbacks
  const itemsTotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const displaySubtotal = order.subtotal || itemsTotal;
  const displayTax = order.taxAmount || 0;
  const displayTotal = order.total;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Button asChild variant="ghost" className="gap-2 mb-4">
            <Link href="/orders">
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Order Details</h1>
              <p className="text-sm text-muted-foreground">
                Order #{order._id.slice(-8).toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-4 py-2 rounded-lg text-sm font-semibold border ${STATUS_COLORS[order.status]}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Order Details */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 pb-4 border-b border-border last:border-b-0 last:pb-0"
                  >
                    <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden shrink-0 relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1 truncate">{item.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                      <p className="font-bold text-accent">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-4">
            {/* Order Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Order Date</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground mb-1">
                    {order.status === "delivered" ? "Delivered On" : 
                     order.status === "cancelled" ? "Cancelled On" : 
                     "Estimated Delivery"}
                  </p>
                  <p className="font-medium">
                    {order.status === "delivered" && order.updatedAt ? (
                      new Date(order.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    ) : order.status === "cancelled" && order.updatedAt ? (
                      new Date(order.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    ) : (
                      // Estimated delivery is 3 days from creation
                      new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric"
                      })
                    )}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground mb-1">Order ID</p>
                  <p className="font-mono text-xs break-all bg-muted px-2 py-1 rounded">
                    {order._id}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="w-5 h-5" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${displaySubtotal.toFixed(2)}</span>
                </div>
                
                {displayTax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${displayTax.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-accent">${displayTotal.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                {order.status !== "delivered" && order.status !== "cancelled" && (
                  <Button
                    onClick={() => setShowCancelDialog(true)}
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Cancel Order
                  </Button>
                )}
                
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                >
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Order</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700"
            >
              {isCancelling ? "Cancelling..." : "Cancel Order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
