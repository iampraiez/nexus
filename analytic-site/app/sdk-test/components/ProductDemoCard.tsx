"use client";

import { useState } from "react";
import { useNexus } from "../NexusProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Eye, Plus, Minus } from "lucide-react";

interface ProductDemoCardProps {
  onEventTracked: () => void;
}

const PRODUCTS = [
  {
    id: "prod-001",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 79.99,
  },
  {
    id: "prod-002",
    name: "USB-C Cable",
    category: "Accessories",
    price: 12.99,
  },
  {
    id: "prod-003",
    name: "Phone Stand",
    category: "Accessories",
    price: 24.99,
  },
  {
    id: "prod-004",
    name: "Screen Protector",
    category: "Protection",
    price: 9.99,
  },
];

export default function ProductDemoCard({
  onEventTracked,
}: ProductDemoCardProps) {
  const { track } = useNexus();
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [quantity, setQuantity] = useState(1);

  const selectedProduct = PRODUCTS.find(p => p.id === selectedProductId)!;

  const handleProductView = () => {
    track("product_viewed", {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      category: selectedProduct.category,
    });
    onEventTracked();
  };

  const handleAddToCart = () => {
    track("product_added_to_cart", {
      productId: selectedProduct.id,
      quantity,
      price: selectedProduct.price,
    });
    onEventTracked();
  };

  const handleRemoveFromCart = () => {
    track("product_removed_from_cart", {
      productId: selectedProduct.id,
      quantity,
    });
    onEventTracked();
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          Product Events
        </CardTitle>
        <CardDescription>
          Track interactions with specific products.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="product" className="text-muted-foreground">Product</Label>
          <Select value={selectedProductId} onValueChange={setSelectedProductId}>
            <SelectTrigger id="product" className="bg-background/50">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCTS.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} — ${product.price.toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-muted-foreground">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="bg-background/50"
          />
        </div>

        <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium">{selectedProduct.name}</span>
            <Badge variant="outline" className="text-[10px] h-5 bg-background/50">{selectedProduct.category}</Badge>
          </div>
          <div className="text-lg font-bold text-primary">${(selectedProduct.price * quantity).toFixed(2)}</div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button 
          variant="outline" 
          onClick={handleProductView}
          className="w-full hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Eye className="mr-2 h-4 w-4" />
          Track Product View
        </Button>
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button 
            onClick={handleAddToCart}
            className="bg-emerald-600 hover:bg-emerald-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
          <Button 
            variant="destructive"
            onClick={handleRemoveFromCart}
          >
            <Minus className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
