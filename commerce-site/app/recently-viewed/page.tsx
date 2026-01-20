"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ArrowLeft, Eye, AlertCircle } from "lucide-react";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
}

export default function RecentlyViewedPage() {
  const router = useRouter();
  const { recentProducts, isLoading, clearRecentlyViewed } = useRecentlyViewed();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchProducts = useCallback(async () => {
    if (!recentProducts || recentProducts.length === 0) {
      setProductsLoading(false);
      return;
    }

    setProductsLoading(true);
    setError("");
    try {
      const productList = await Promise.all(
        recentProducts.map(async (item) => {
          try {
            const res = await fetch(`/api/products/${item.productId}`);
            if (!res.ok) return null;
            return await res.json();
          } catch (err) {
            console.error(`Failed to fetch product ${item.productId}:`, err);
            return null;
          }
        }),
      );
      setProducts(productList.filter(Boolean));
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load recently viewed products. Please try again.");
    } finally {
      setProductsLoading(false);
    }
  }, [recentProducts]);

  useEffect(() => {
    if (recentProducts.length > 0) {
      fetchProducts();
    } else if (!isLoading) {
      setProductsLoading(false);
    }
  }, [recentProducts, fetchProducts, isLoading]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Shop
              </Link>
            </Button>
            {products.length > 0 && (
              <Button onClick={clearRecentlyViewed} variant="outline" size="sm">
                Clear History
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-accent" />
            <h1 className="text-3xl font-bold text-primary">Recently Viewed</h1>
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
              onClick={fetchProducts}
              variant="outline"
              size="sm"
              className="shrink-0"
            >
              Retry
            </Button>
          </div>
        )}

        {productsLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Eye className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">
              You haven&apos;t viewed any products yet
            </p>
            <Button asChild>
              <Link href="/">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {products.length} item{products.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  description={product.description}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
