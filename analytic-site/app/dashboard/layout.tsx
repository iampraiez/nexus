"use client";

import React from "react";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MinimalBackground } from "@/components/minimal-background";
import {
  Settings,
  CreditCard,
  Bell,
  LogOut,
  Menu,
  X,
  Home,
  FileText,
  Activity,
  Users,
  Fuel as Funnel,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Loader2,
  Info,
} from "lucide-react";

interface NavItem {
  href?: string;
  label: string;
  icon?: any;
  submenu?: { href: string; label: string; icon: any }[];
}

const navigationItems: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/projects", label: "Projects", icon: BarChart3 },
  { href: "/dashboard/analytics", label: "Analytics", icon: Activity },
  {
    label: "Analytics Details",
    submenu: [
      { href: "/dashboard/analytics/events", label: "Events", icon: Activity },
      { href: "/dashboard/analytics/users", label: "Users", icon: Users },
      { href: "/dashboard/analytics/funnels", label: "Funnels", icon: Funnel },
      {
        href: "/dashboard/analytics/retention",
        label: "Retention",
        icon: TrendingUp,
      },
      {
        href: "/dashboard/analytics/sdk-health",
        label: "SDK Health",
        icon: AlertTriangle,
      },
    ],
  },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/about", label: "About Nexus", icon: Info },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/session");
        if (!isMounted) return;
        if (!response.ok) {
          router.push("/auth/login");
          return;
        }
        setLoading(false);
      } catch (error) {
        if (isMounted) router.push("/auth/login");
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      <MinimalBackground />
      {/* Mobile Top Bar - Floating & Transparent */}
      <div className="lg:hidden fixed top-4 left-1/2 -translate-x-1/2 w-[92%] h-14 bg-background/40 backdrop-blur-md border border-border/30 rounded-2xl flex items-center justify-between px-6 z-50 shadow-lg transition-all duration-300">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            Nexus
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-secondary/50 rounded-xl transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 border-r border-border bg-card transform transition-transform lg:translate-x-0 z-60 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 mb-8">
            <Activity className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Nexus
            </span>
          </Link>

          <nav className="space-y-2">
            {navigationItems.map((item) => {
              if (item.submenu) {
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                      {item.label}
                    </div>
                    {item.submenu.map((subitem) => {
                      const isActive = pathname === subitem.href;
                      const Icon = subitem.icon;
                      return (
                        <Link key={subitem.href} href={subitem.href}>
                          <button
                            onClick={() => setSidebarOpen(false)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {subitem.label}
                          </button>
                        </Link>
                      );
                    })}
                  </div>
                );
              }

              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.href || item.label} href={item.href || "#"}>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto ml-0 lg:ml-64 relative z-10 pt-24 lg:pt-0">
        <div className="p-4 md:p-8">{children}</div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-55 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
