"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, XCircle, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";

interface OrderDemoCardProps {
  onEventTracked: (type: string) => void;
}

function generateOrderId() {
  return `order-${Date.now().toString().slice(-6)}`;
}

export default function OrderDemoCard({ onEventTracked }: OrderDemoCardProps) {
  const { track, isInitialized } = useNexus();
  const [orderId, setOrderId] = useState(generateOrderId);
  const [amount, setAmount] = useState(299.97);
  const [currency, setCurrency] = useState("USD");
  const [failureReason, setFailureReason] = useState("Card declined");

  const refreshOrderId = () => setOrderId(generateOrderId());

  const handleOrderCreated = () => {
    track("order_created", {
      orderId,
      userId: "user-123456",
      amount,
      currency,
      items: [
        { productId: "prod-001", qty: 2 },
        { productId: "prod-002", qty: 1 },
      ],
    });
    onEventTracked("order_created");
  };

  const handleOrderCancelled = () => {
    track("order_cancelled", { orderId, reason: "Customer request" });
    onEventTracked("order_cancelled");
  };

  const handlePaymentFailed = () => {
    track("payment_failed", { orderId, error: failureReason });
    onEventTracked("payment_failed");
  };

  return (
    <Card
      className={`border-border/50 bg-card/50 backdrop-blur-sm flex flex-col transition-all ${!isInitialized ? "opacity-50 pointer-events-none" : "hover:border-primary/50"}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Package className="w-4 h-4 text-primary" />
          Order Events
        </CardTitle>
        <CardDescription className="text-xs">
          Simulate order lifecycle and failure states.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 flex-1">
        {/* Order ID row */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="ode-order" className="text-xs text-muted-foreground">
              Order ID
            </Label>
            <button
              onClick={refreshOrderId}
              className="text-[9px] text-muted-foreground/50 hover:text-primary flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              Regenerate
            </button>
          </div>
          <Input
            id="ode-order"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="bg-background/50 h-8 text-xs font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="ode-amount" className="text-xs text-muted-foreground">
              Amount
            </Label>
            <Input
              id="ode-amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="bg-background/50 h-8 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ode-currency" className="text-xs text-muted-foreground">
              Currency
            </Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="ode-currency" className="bg-background/50 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="JPY">JPY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ode-failure" className="text-xs text-muted-foreground">
            Failure Reason
          </Label>
          <Input
            id="ode-failure"
            value={failureReason}
            onChange={(e) => setFailureReason(e.target.value)}
            className="bg-background/50 h-8 text-xs border-destructive/20 focus-visible:ring-destructive"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-2">
        <Button
          size="sm"
          onClick={handleOrderCreated}
          className="w-full text-xs bg-primary hover:bg-primary/90"
        >
          <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
          Order Created
        </Button>
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleOrderCancelled}
            className="text-xs hover:bg-secondary/80"
          >
            <XCircle className="mr-1.5 h-3.5 w-3.5" />
            Cancel
          </Button>
          <Button size="sm" variant="destructive" onClick={handlePaymentFailed} className="text-xs">
            <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
            Pay Failed
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
