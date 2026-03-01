"use client";

import { useState, useEffect } from "react";
import { useNexus } from "../NexusProvider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, ArrowRight, CheckCircle2 } from "lucide-react";

interface CheckoutDemoCardProps {
  onEventTracked: (type: string) => void;
}

export default function CheckoutDemoCard({ onEventTracked }: CheckoutDemoCardProps) {
  const { track, isInitialized } = useNexus();
  const [cartValue, setCartValue] = useState(149.97);
  const [itemCount, setItemCount] = useState(3);
  const [checkoutStarted, setCheckoutStarted] = useState(false);

  // Reset flow if SDK goes offline
  useEffect(() => {
    if (!isInitialized) setCheckoutStarted(false);
  }, [isInitialized]);

  const handleCheckoutStarted = () => {
    track("checkout_started", { cartValue, itemCount });
    onEventTracked("checkout_started");
    setCheckoutStarted(true);
  };

  const handleCheckoutCompleted = () => {
    const orderId = `order-${Date.now().toString().slice(-6)}`;
    track("checkout_completed", { orderId, cartValue });
    onEventTracked("checkout_completed");
    setCheckoutStarted(false);
  };

  return (
    <Card className={`border-border/50 bg-card/50 backdrop-blur-sm flex flex-col transition-all ${!isInitialized ? "opacity-50 pointer-events-none" : "hover:border-primary/50"}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CreditCard className="w-4 h-4 text-primary" />
          Checkout Flow
        </CardTitle>
        <CardDescription className="text-xs">
          Simulate cart-to-purchase events in sequence.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 flex-1">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="cde-cart" className="text-xs text-muted-foreground">
              Cart Total ($)
            </Label>
            <Input
              id="cde-cart"
              type="number"
              step="0.01"
              min="0"
              value={cartValue}
              onChange={(e) => setCartValue(parseFloat(e.target.value) || 0)}
              className="bg-background/50 h-8 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cde-qty" className="text-xs text-muted-foreground">
              Items
            </Label>
            <Input
              id="cde-qty"
              type="number"
              min="1"
              max="100"
              value={itemCount}
              onChange={(e) => setItemCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="bg-background/50 h-8 text-xs"
            />
          </div>
        </div>

        {/* Flow state indicator */}
        <div className="p-2.5 rounded-lg border space-y-1 transition-all"
          style={{
            background: checkoutStarted ? "rgba(16,185,129,0.05)" : "rgba(var(--secondary), 0.3)",
            borderColor: checkoutStarted ? "rgba(16,185,129,0.2)" : "rgba(var(--border), 0.5)",
          }}
        >
          <div className="flex justify-between text-[9px] uppercase tracking-widest text-muted-foreground/50">
            <span>Step</span>
            <span>Status</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-medium text-foreground/80">
              {checkoutStarted ? "Awaiting completion" : "Ready to start"}
            </span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${checkoutStarted ? "bg-amber-500/20 text-amber-500" : "bg-emerald-500/20 text-emerald-500"}`}>
              {checkoutStarted ? "STARTED" : "IDLE"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCheckoutStarted}
          disabled={checkoutStarted}
          className="w-full text-xs border-primary/20 hover:bg-primary/5 group disabled:opacity-40"
        >
          <span>1. Start Checkout</span>
          <ArrowRight className="ml-auto h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Button>
        <Button
          size="sm"
          onClick={handleCheckoutCompleted}
          disabled={!checkoutStarted}
          className="w-full text-xs bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/10 disabled:opacity-40"
        >
          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
          2. Complete Purchase
        </Button>
      </CardFooter>
    </Card>
  );
}
