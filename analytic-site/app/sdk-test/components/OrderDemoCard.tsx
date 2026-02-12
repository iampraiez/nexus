"use client";

import { useState, useEffect } from "react";
import { useNexus } from "../NexusProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Box, XCircle, AlertTriangle, CheckCircle } from "lucide-react";

interface OrderDemoCardProps {
  onEventTracked: () => void;
}

export default function OrderDemoCard({ onEventTracked }: OrderDemoCardProps) {
  const { track } = useNexus();
  const [mounted, setMounted] = useState(false);
  const [orderId, setOrderId] = useState("order-......");
  const [userId, setUserId] = useState("user-123456");
  const [amount, setAmount] = useState(299.97);
  const [currency, setCurrency] = useState("USD");
  const [errorMsg, setErrorMsg] = useState("Card declined");

  useEffect(() => {
    setMounted(true);
    setOrderId(`order-${Date.now().toString().slice(-6)}`);
  }, []);

  const handleOrderCreated = () => {
    track("order_created", {
      orderId,
      userId,
      amount,
      currency,
      items: [
        { productId: "prod-001", qty: 2 },
        { productId: "prod-002", qty: 1 },
      ],
    });
    onEventTracked();
  };

  const handleOrderCancelled = () => {
    track("order_cancelled", {
      orderId,
      reason: "Customer request",
    });
    onEventTracked();
  };

  const handlePaymentFailed = () => {
    track("payment_failed", {
      orderId,
      error: errorMsg,
    });
    onEventTracked();
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Box className="w-5 h-5 text-primary" />
          Order Management
        </CardTitle>
        <CardDescription>
          Simulate order lifecycle events and failure states.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="orderId" className="text-muted-foreground">Order ID</Label>
            <Input
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="bg-background/50 font-mono text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userId" className="text-muted-foreground">User ID</Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="bg-background/50 font-mono text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-muted-foreground">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency" className="text-muted-foreground">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="currency" className="bg-background/50">
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

        <div className="space-y-2">
          <Label htmlFor="errorMsg" className="text-muted-foreground">Failure Reason</Label>
          <Input
            id="errorMsg"
            value={errorMsg}
            onChange={(e) => setErrorMsg(e.target.value)}
            className="bg-background/50 border-destructive/20 focus-visible:ring-destructive"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button 
          onClick={handleOrderCreated}
          className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/10"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Track Order Success
        </Button>
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button 
            variant="secondary"
            onClick={handleOrderCancelled}
            className="hover:bg-secondary/80"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handlePaymentFailed}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Fail Payout
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
