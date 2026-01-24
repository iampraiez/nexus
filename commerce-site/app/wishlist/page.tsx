"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, AlertCircle, LayoutGrid, List } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Handle hydration mismatch for viewMode
  useEffect(() => {
    const savedViewMode = localStorage.getItem("viewMode") as "grid" | "list";
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      fetchWishlist();
    }
  }, [status, session, router]);

  const fetchWishlist = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Get wishlist IDs
      const wishlistRes = await fetch("/api/wishlist");
      if (!wishlistRes.ok) {
        throw new Error("Failed to fetch wishlist");
      }
      const wishlistData = await wishlistRes.json();
      const productIds = wishlistData.productIds || [];
      setWishlistIds(productIds.map((id: any) => id.$oid || id.toString?.() || id));

      // Fetch full product details only if we have IDs
      if (productIds.length > 0) {
        const products = await Promise.all(
          productIds.map(async (id: any) => {
            try {
              const productId = id.$oid || id.toString?.() || id;
              const res = await fetch(`/api/products/${productId}`);
              if (!res.ok) return null;
              return await res.json();
            } catch (err) {
              console.error(`Failed to fetch product:`, err);
              return null;
            }
          })
        );
        setWishlistProducts(products.filter(Boolean));
      } else {
        setWishlistProducts([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setError("Failed to load your wishlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      await fetch(`/api/wishlist?productId=${productId}`, {
        method: "DELETE"
      });
      setWishlistIds(wishlistIds.filter((id) => id !== productId));
      setWishlistProducts(wishlistProducts.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      setError("Failed to remove item from wishlist.");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Shop
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-accent fill-accent" />
              <h1 className="text-3xl font-bold text-primary">My Wishlist</h1>
            </div>

            <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => {
                  setViewMode("grid");
                  localStorage.setItem("viewMode", "grid");
                }}
                className="h-8 w-8 p-0"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => {
                  setViewMode("list");
                  localStorage.setItem("viewMode", "list");
                }}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <Button
              onClick={fetchWishlist}
              variant="outline"
              size="sm"
              className="shrink-0"
            >
              Retry
            </Button>
          </div>
        )}

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {wishlistProducts.length} item
              {wishlistProducts.length !== 1 ? "s" : ""} in your wishlist
            </p>
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" 
                : "grid-cols-1"
            }`}>
              {wishlistProducts.map((product) => (
                <div key={product._id} className="relative">
                  <ProductCard
                    id={product._id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    description={product.description}
                    viewMode={viewMode}
                  />
                  <Button
                    onClick={() => removeFromWishlist(product._id)}
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-accent hover:text-accent/80"
                  >
                    <Heart className="w-5 h-5 fill-accent" />
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
