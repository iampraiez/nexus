"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart3,
  Users,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SdkInstallCard } from "@/components/sdk-install-card";

const stats = [
  {
    label: "Total Events",
    value: "2,543",
    change: "+12.5%",
    icon: Activity,
    href: "/dashboard/analytics/events",
    positive: true,
  },
  {
    label: "Active Users",
    value: "524",
    change: "+8.2%",
    icon: Users,
    href: "/dashboard/analytics/users",
    positive: true,
  },
  {
    label: "Conversion Rate",
    value: "3.24%",
    change: "-2.1%",
    icon: TrendingUp,
    href: "/dashboard/analytics/funnels",
    positive: false,
  },
  {
    label: "Projects",
    value: "3",
    change: "All active",
    icon: BarChart3,
    href: "/dashboard/projects",
    positive: true,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back. Here&apos;s your analytics overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const ChangeIcon = stat.positive ? ArrowUpRight : ArrowDownRight;
          const changeColor = stat.positive ? "text-green-600" : "text-red-600";

          return (
            <Link key={stat.href} href={stat.href}>
              <Card className="p-6 hover:bg-secondary/50 transition-colors cursor-pointer border border-border bg-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${changeColor}`}
                  >
                    <ChangeIcon className="w-4 h-4" />
                    {stat.change}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* SDK Install Card */}
      <SdkInstallCard />

      {/* Quick Links */}
      <Card className="p-6 border border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/projects">
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-3 px-4 bg-transparent"
            >
              <div className="text-left">
                <div className="font-medium">Manage Projects</div>
                <div className="text-xs text-muted-foreground">
                  Create and configure API projects
                </div>
              </div>
            </Button>
          </Link>
          <Link href="/dashboard/billing">
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-3 px-4 bg-transparent"
            >
              <div className="text-left">
                <div className="font-medium">Billing & Plans</div>
                <div className="text-xs text-muted-foreground">
                  Upgrade or manage your plan
                </div>
              </div>
            </Button>
          </Link>
          <Link href="/dashboard/docs">
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-3 px-4 bg-transparent"
            >
              <div className="text-left">
                <div className="font-medium">SDK Documentation</div>
                <div className="text-xs text-muted-foreground">
                  View integration guides and API reference
                </div>
              </div>
            </Button>
          </Link>
          <Link href="/dashboard/alerts">
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-3 px-4 bg-transparent"
            >
              <div className="text-left">
                <div className="font-medium">Setup Alerts</div>
                <div className="text-xs text-muted-foreground">
                  Configure notifications and webhooks
                </div>
              </div>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
