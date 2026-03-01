"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Activity, Users, Fuel, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";

const analyticsCategories = [
  {
    title: "Events",
    description: "Track and analyze user events in real-time",
    icon: Activity,
    href: "/dashboard/analytics/events",
  },
  {
    title: "Users",
    description: "Understand user behavior and demographics",
    icon: Users,
    href: "/dashboard/analytics/users",
  },
  {
    title: "Funnels",
    description: "Analyze user conversion funnels",
    icon: Fuel,
    href: "/dashboard/analytics/funnels",
  },
  {
    title: "Retention",
    description: "Monitor user retention metrics",
    icon: TrendingUp,
    href: "/dashboard/analytics/retention",
  },
  {
    title: "SDK Health",
    description: "Monitor SDK performance and errors",
    icon: AlertTriangle,
    href: "/dashboard/analytics/sdk-health",
  },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Analytics</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Choose an analytics category to explore your data
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {analyticsCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Link key={category.href} href={category.href}>
              <Card className="p-4 md:p-6 h-full hover:bg-secondary/50 transition-all cursor-pointer border border-border bg-card group">
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div className="p-1.5 md:p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-base md:text-xl font-semibold text-foreground mb-1 md:mb-2">
                  {category.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                  {category.description}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
