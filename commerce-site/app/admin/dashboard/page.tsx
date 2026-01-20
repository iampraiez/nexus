"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package, Users, TrendingUp, ChevronRight, AlertTriangle } from "lucide-react";

interface DashboardData {
  stats: {
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    totalRevenue: number;
  };
  recentOrders: Array<{
    _id: string;
    total: number;
    status: string;
    userEmail: string;
    createdAt: string;
  }>;
  lowStockProducts: Array<{
    _id: string;
    name: string;
    stock: number;
  }>;
  revenueByDay: Record<string, number>;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (session?.user?.role === "admin") {
      fetchDashboardData();
    }
  }, [session]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-red-600">Failed to load dashboard</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your store overview.
          </p>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-accent">
                    ${data.stats.totalRevenue.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-accent opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {data.stats.totalOrders}
                  </p>
                </div>
                <ShoppingCart className="w-8 h-8 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Products
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {data.stats.totalProducts}
                  </p>
                </div>
                <Package className="w-8 h-8 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Customers
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {data.stats.totalCustomers}
                  </p>
                </div>
                <Users className="w-8 h-8 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/admin/products">
              <Package className="w-4 h-4 mr-2" />
              Manage Products
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/admin/orders">
              <ShoppingCart className="w-4 h-4 mr-2" />
              View All Orders
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/profile">
              <Users className="w-4 h-4 mr-2" />
              My Profile
            </Link>
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin/orders">
                    View All
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.recentOrders.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No orders yet
                    </p>
                  ) : (
                    data.recentOrders.map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                      >
                        <div>
                          <p className="text-sm font-semibold">
                            {order.userEmail}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold">
                            ${order.total.toFixed(2)}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_COLORS[order.status]}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Alert */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  Low Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.lowStockProducts.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    All products have sufficient stock
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.lowStockProducts.map((product) => (
                      <Link
                        key={product._id}
                        href={`/admin/products/${product._id}/edit`}
                        className="block p-3 border border-yellow-200 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                      >
                        <p className="text-sm font-semibold text-foreground">
                          {product.name}
                        </p>
                        <p className="text-xs text-yellow-700">
                          Stock: {product.stock} units
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
