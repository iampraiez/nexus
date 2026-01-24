"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Minus, Plus, Heart } from "lucide-react";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import Image from "next/image";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { Nexus } from "nexus-avail";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { addRecentlyViewed } = useRecentlyViewed();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isInWishlist, setIsInWishlist] = useState(false);

  const checkWishlist = useCallback(
    async (productId: string) => {
      if (!session?.user) return;
      try {
        const response = await fetch("/api/wishlist");
        const data = await response.json();
        const isIn = data.productIds?.some(
          (id: any) => (id.$oid || id.toString?.() || id) === productId,
        );
        setIsInWishlist(!!isIn);
      } catch (error) {
        console.error("Error checking wishlist:", error);
      }
    },
    [session?.user],
  );

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data);
        addRecentlyViewed(params.id as string);
        checkWishlist(params.id as string);
        
        // Track Product View
        Nexus.track("product_viewed", {
          productId: data._id,
          productName: data.name,
          category: data.category
        });
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [params.id, addRecentlyViewed, checkWishlist]);

  const handleToggleWishlist = async () => {
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    // Optimistic update
    const previousState = isInWishlist;
    setIsInWishlist(!previousState);

    try {
      if (previousState) {
        await fetch(`/api/wishlist?productId=${params.id}`, {
          method: "DELETE",
        });
      } else {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: params.id }),
        });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      // Revert on error
      setIsInWishlist(previousState);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = existingCart.find(
      (item: any) => item._id === product._id,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      existingCart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    
    // Track Add to Cart
    Nexus.track("product_added_to_cart", {
      productId: product._id,
      quantity,
      price: product.price
    });

    router.push("/cart");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <p className="text-red-600 mb-4">{error}</p>
        <Button asChild>
          <Link href="/">Back to Products</Link>
        </Button>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </header>

      {/* Product Detail */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-muted rounded-lg overflow-hidden aspect-square relative">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm text-accent font-semibold mb-2">
                {product.category}
              </p>
              <h1 className="text-4xl font-bold text-primary mb-4">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-accent mb-6">
                ${product.price.toFixed(2)}
              </p>

              <Card className="mb-8">
                <CardContent className="pt-6">
                  <p className="text-foreground">{product.description}</p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">
                    Stock Available: {product.stock}
                  </p>
                  {!isOutOfStock && (
                    <div className="flex items-center gap-4 bg-card p-4 rounded-lg w-fit">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity === 1}
                        className="p-2 hover:bg-muted rounded disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-semibold w-8 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(Math.min(product.stock, quantity + 1))
                        }
                        disabled={quantity >= product.stock}
                        className="p-2 hover:bg-muted rounded disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    size="lg"
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </Button>
                  {session?.user && (
                    <Button
                      onClick={handleToggleWishlist}
                      variant="outline"
                      size="lg"
                      className={
                        isInWishlist ? "bg-accent text-accent-foreground" : ""
                      }
                    >
                      <Heart
                        className={`w-5 h-5 ${isInWishlist ? "fill-accent" : ""}`}
                      />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
