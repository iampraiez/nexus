"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from "lucide-react";
import {
  CartItem,
  getCart,
  setCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  getCartTotal,
} from "@/lib/cart";
import Image from "next/image";

import { Nexus } from "nexus-avail";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [taxRate, setTaxRate] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [showProcessing, setShowProcessing] = useState(false);

  useEffect(() => {
    const cartItems = getCart();
    setItems(cartItems);
    // Generate random tax rate between 1.5% and 3.7%
    const randomTax = (Math.random() * (3.7 - 1.5) + 1.5) / 100;
    setTaxRate(randomTax);
    
    // Generate random delivery fee between $5 and $30
    const randomDelivery = Math.floor(Math.random() * (30 - 5 + 1)) + 5;
    setDeliveryFee(randomDelivery);
    
    setIsLoading(false);
  }, []);

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    setItems(items.filter((item) => item._id !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      handleRemoveItem(productId);
    } else {
      updateQuantity(productId, quantity);
      setItems(
        items.map((item) =>
          item._id === productId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount + deliveryFee;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setShowProcessing(true);
    
    try {
      // Simulate a brief processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items,
          subtotal,
          taxAmount,
          deliveryFee,
          total 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setShowProcessing(false);
        alert(data.message || "Checkout failed");
        return;
      }

      // Clear cart and redirect to success
      clearCart();
      
      // Track Checkout
      Nexus.track("checkout_completed", {
        orderId: data.orderId,
        cartValue: total
      });

      router.push(`/checkout/success?orderId=${data.orderId}`);
    } catch (error) {
      console.error("Checkout error:", error);
      setShowProcessing(false);
      alert("An error occurred during checkout");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  // Processing overlay
  if (showProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-12 pb-12 text-center">
            <LoadingSpinner className="mb-4" />
            <h3 className="text-xl font-semibold mb-2">Processing Your Order</h3>
            <p className="text-muted-foreground">Please wait...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cart Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-accent/10 rounded-full">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Shopping Cart</h1>
        </div>

        <Button
          asChild
          variant="ghost"
          className="gap-2 mb-6 pl-0 hover:pl-2 transition-all"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </Button>

        {items.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center pb-12">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-6">
                Your cart is empty
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item._id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden shrink-0 relative">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {item.name}
                        </h3>
                        <p className="text-2xl font-bold text-accent mb-4">
                          ${item.price.toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item._id, item.quantity - 1)
                            }
                            className="p-1 hover:bg-muted rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item._id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-muted rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="flex flex-col items-end justify-between">
                        <p className="text-right text-sm text-muted-foreground">
                          Subtotal
                        </p>
                        <p className="text-lg font-bold text-accent mb-4">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="p-2 hover:bg-red-50 rounded text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax ({(taxRate * 100).toFixed(2)}%)</span>
                      <span className="font-medium">${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-accent">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    <Link href="/">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
