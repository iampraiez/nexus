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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Eye, Plus, Minus } from "lucide-react";

interface ProductDemoCardProps {
  onEventTracked: (type: string) => void;
}

const PRODUCTS = [
  { id: "prod-001", name: "Wireless Headphones", category: "Electronics", price: 79.99 },
  { id: "prod-002", name: "USB-C Cable", category: "Accessories", price: 12.99 },
  { id: "prod-003", name: "Phone Stand", category: "Accessories", price: 24.99 },
  { id: "prod-004", name: "Screen Protector", category: "Protection", price: 9.99 },
];

export default function ProductDemoCard({ onEventTracked }: ProductDemoCardProps) {
  const { track, isInitialized } = useNexus();
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [quantity, setQuantity] = useState(1);

  const product = PRODUCTS.find((p) => p.id === selectedProductId)!;

  const handleProductView = () => {
    track("product_viewed", {
      productId: product.id,
      productName: product.name,
      category: product.category,
    });
    onEventTracked("product_viewed");
  };

  const handleAddToCart = () => {
    track("product_added_to_cart", { productId: product.id, quantity, price: product.price });
    onEventTracked("product_added_to_cart");
  };

  const handleRemoveFromCart = () => {
    track("product_removed_from_cart", { productId: product.id, quantity });
    onEventTracked("product_removed_from_cart");
  };

  return (
    <Card
      className={`border-border/50 bg-card/50 backdrop-blur-sm flex flex-col transition-all ${!isInitialized ? "opacity-50 pointer-events-none" : "hover:border-primary/50"}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShoppingBag className="w-4 h-4 text-primary" />
          Product Events
        </CardTitle>
        <CardDescription className="text-xs">
          Track product interactions and cart actions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 flex-1">
        <div className="space-y-1.5">
          <Label htmlFor="pde-product" className="text-xs text-muted-foreground">
            Product
          </Label>
          <Select value={selectedProductId} onValueChange={setSelectedProductId}>
            <SelectTrigger id="pde-product" className="bg-background/50 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRODUCTS.map((p) => (
                <SelectItem key={p.id} value={p.id} className="text-xs">
                  {p.name} — ${p.price.toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-2.5 rounded-lg bg-secondary/30 border border-border/40 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium truncate">{product.name}</span>
            <Badge variant="outline" className="text-[9px] h-4 px-1.5 bg-background/50 shrink-0">
              {product.category}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-primary">
              ${(product.price * quantity).toFixed(2)}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-5 h-5 rounded border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-background/60 transition-colors"
              >
                <Minus className="w-2.5 h-2.5" />
              </button>
              <span className="text-xs font-mono w-4 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="w-5 h-5 rounded border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-background/60 transition-colors"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleProductView}
          className="w-full text-xs hover:bg-primary/10 hover:text-primary"
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          Track View
        </Button>
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="text-xs bg-emerald-600 hover:bg-emerald-500"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleRemoveFromCart}
            className="text-xs"
          >
            <Minus className="mr-1.5 h-3.5 w-3.5" />
            Remove
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
