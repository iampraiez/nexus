"use client";

import { useState, useMemo, useEffect } from "react";
import { useNexus } from "../NexusProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, ArrowRight, CheckCircle2 } from "lucide-react";

interface CheckoutDemoCardProps {
  onEventTracked: () => void;
}

export default function CheckoutDemoCard({
  onEventTracked,
}: CheckoutDemoCardProps) {
  const { track } = useNexus();
  const [mounted, setMounted] = useState(false);
  const [cartValue, setCartValue] = useState(149.97);
  const [itemCount, setItemCount] = useState(3);

  useEffect(() => {
    setMounted(true);
  }, []);

  const orderIdPreview = useMemo(() => {
    if (!mounted) return "order-......";
    return `order-${Date.now().toString().slice(-6)}`;
  }, [mounted]);

  const handleCheckoutStarted = () => {
    track("checkout_started", {
      cartValue,
      itemCount,
    });
    onEventTracked();
  };

  const handleCheckoutCompleted = () => {
    const orderId = `order-${Date.now()}`;
    track("checkout_completed", {
      orderId,
      cartValue,
    });
    onEventTracked();
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Checkout Flow
        </CardTitle>
        <CardDescription>
          Track the transition from cart to successful purchase.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cartValue" className="text-muted-foreground">Cart Total ($)</Label>
            <Input
              id="cartValue"
              type="number"
              step="0.01"
              min="0"
              value={cartValue}
              onChange={(e) => setCartValue(parseFloat(e.target.value) || 0)}
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="itemCount" className="text-muted-foreground">Qty</Label>
            <Input
              id="itemCount"
              type="number"
              min="1"
              max="100"
              value={itemCount}
              onChange={(e) => setItemCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="bg-background/50"
            />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest">
            <span>Next Order ID</span>
            <span>Status</span>
          </div>
          <div className="flex justify-between items-center">
            <code className="text-xs font-mono text-emerald-500">{orderIdPreview}</code>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-bold">READY</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button 
          variant="outline" 
          onClick={handleCheckoutStarted}
          className="w-full border-primary/20 hover:bg-primary/5 group"
        >
          <span>Start Checkout</span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
        <Button 
          onClick={handleCheckoutCompleted}
          className="w-full bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/10"
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Complete Purchase
        </Button>
      </CardFooter>
    </Card>
  );
}
