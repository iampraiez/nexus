"use client";

import {
  useState,
  useEffect,
  Suspense,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSearchParams } from "next/navigation";
import { AlertCircle, LayoutGrid, List } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
}

interface PaginationData {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const CATEGORIES = [
  "All",
  "Home & Office",
  "Phones & Tablets",
  "Fashion",
  "Health & Beauty",
  "Electronics",
  "Computing",
  "Grocery",
  "Garden & Outdoors",
  "Automobile",
  "Sporting Goods",
  "Gaming",
  "Baby Products",
];

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  
  const searchQuery = searchParams?.get("search") || "";
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams?.get("category") || "All",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Handle hydration mismatch for viewMode
  useEffect(() => {
    const savedViewMode = localStorage.getItem("viewMode") as "grid" | "list";
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Use ref to track if we're currently fetching to prevent duplicate requests
  const isFetchingRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchProducts = useCallback(
    async (page: number = 1) => {
      // Prevent duplicate fetches
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      setIsLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", "12");
        if (searchQuery) params.append("search", searchQuery);
        if (selectedCategory !== "All")
          params.append("category", selectedCategory);

        const response = await fetch(`/api/products?${params}`);

        if (!response.ok) {
          if (response.status === 429) {
            setError("Too many requests. Please wait a moment and try again.");
          } else {
            setError("Failed to load products. Please try again.");
          }
          return;
        }

        const data: PaginationData = await response.json();

        // Safe defaults
        setProducts(data?.products || []);
        setCurrentPage(data?.pagination?.page || 1);
        setTotalPages(data?.pagination?.pages || 1);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("An error occurred while loading products.");
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [searchQuery, selectedCategory],
  );

  // Debounced search effect
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(
      () => {
        fetchProducts(1);
        setCurrentPage(1);
      },
      searchQuery ? 500 : 0,
    ); // No delay for category changes, 500ms delay for search

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, selectedCategory, fetchProducts]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > totalPages) return;
    await fetchProducts(page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">
            Categories
          </h2>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                onClick={() => handleCategoryChange(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-muted p-1 rounded-lg self-start md:self-end">
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

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-center py-12 flex flex-col items-center">
          <LoadingSpinner />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No products found</p>
          <Button onClick={() => handleCategoryChange("All")}>
            Browse All Products
          </Button>
        </div>
      ) : (
        <>
          <div className={`grid gap-6 mb-8 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {products.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                image={product.image}
                description={product.description}
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 py-8">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                variant="outline"
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum =
                    currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      disabled={isLoading}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      }>
        <HomeContent />
      </Suspense>
    </div>
  );
}
