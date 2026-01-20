"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  stock?: number;
  viewMode?: "grid" | "list";
}

export function ProductCard({
  id,
  name,
  price,
  image,
  description,
  stock,
  viewMode = "grid",
}: ProductCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isCheckingWishlist, setIsCheckingWishlist] = useState(false);

  // Check if product is in wishlist on mount
  useEffect(() => {
    if (!session?.user) return;

    const checkWishlist = async () => {
      setIsCheckingWishlist(true);
      try {
        const response = await fetch("/api/wishlist");
        if (!response.ok) return;
        
        const data = await response.json();
        const isIn = data.productIds?.some(
          (productId: any) => (productId.$oid || productId.toString?.() || productId) === id,
        );
        setIsInWishlist(!!isIn);
      } catch (error) {
        console.error("Error checking wishlist:", error);
      } finally {
        setIsCheckingWishlist(false);
      }
    };

    checkWishlist();
  }, [session?.user, id]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling

    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    // Optimistic update
    const previousState = isInWishlist;
    setIsInWishlist(!previousState);

    try {
      if (previousState) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist?productId=${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to remove");
      } else {
        // Add to wishlist
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id }),
        });
        if (!response.ok) throw new Error("Failed to add");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      // Revert on error
      setIsInWishlist(previousState);
    }
  };

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow relative flex flex-col sm:flex-row h-auto sm:h-48 group">
        {/* Wishlist Button - Top Right */}
        {session?.user && (
          <button
            onClick={handleToggleWishlist}
            disabled={isCheckingWishlist}
            className="absolute top-3 right-3 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-all shadow-md disabled:opacity-50 opacity-0 group-hover:opacity-100"
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isInWishlist
                  ? "fill-accent text-accent"
                  : "text-foreground hover:text-accent"
              }`}
            />
          </button>
        )}

        <Link href={`/products/${id}`} className="w-full sm:w-48 aspect-video sm:aspect-square shrink-0 relative bg-muted">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            className="object-cover hover:scale-105 transition-transform duration-300"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </Link>

        <div className="flex flex-col flex-1 p-4 sm:p-6 justify-between">
          <div>
            <div className="flex justify-between items-start gap-4">
              <Link href={`/products/${id}`} className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg sm:text-xl hover:text-accent transition-colors truncate mb-1 sm:mb-2">
                  {name}
                </h3>
              </Link>
              <p className="text-lg sm:text-xl font-bold text-accent shrink-0">
                ${price.toFixed(2)}
              </p>
            </div>
            
            {description && (
              <p className="text-muted-foreground line-clamp-2 text-xs sm:text-sm max-w-2xl">
                {description}
              </p>
            )}
          </div>

          <div className="flex justify-end mt-4 sm:mt-0">
            <Button
              asChild
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href={`/products/${id}`}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow relative">
      {/* Wishlist Button - Top Right */}
      {session?.user && (
        <button
          onClick={handleToggleWishlist}
          disabled={isCheckingWishlist}
          className="absolute top-3 right-3 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-all shadow-md disabled:opacity-50"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isInWishlist
                ? "fill-accent text-accent"
                : "text-foreground hover:text-accent"
              }`}
          />
        </button>
      )}

      <Link href={`/products/${id}`}>
        <div className="aspect-video overflow-hidden bg-muted relative">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            className="object-cover hover:scale-105 transition-transform duration-300"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${id}`}>
          <h3 className="font-semibold text-lg hover:text-accent transition-colors truncate">
            {name}
          </h3>
        </Link>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {description}
          </p>
        )}
        <p className="text-lg font-bold text-accent mt-2">
          ${price.toFixed(2)}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          asChild
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Link href={`/products/${id}`}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
