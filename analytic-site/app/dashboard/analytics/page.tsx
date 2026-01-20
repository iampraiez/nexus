'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Activity,
  Users,
  Fuel,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

const analyticsCategories = [
  {
    title: 'Events',
    description: 'Track and analyze user events in real-time',
    icon: Activity,
    href: '/dashboard/analytics/events',
  },
  {
    title: 'Users',
    description: 'Understand user behavior and demographics',
    icon: Users,
    href: '/dashboard/analytics/users',
  },
  {
    title: 'Funnels',
    description: 'Analyze user conversion funnels',
    icon: Fuel,
    href: '/dashboard/analytics/funnels',
  },
  {
    title: 'Retention',
    description: 'Monitor user retention metrics',
    icon: TrendingUp,
    href: '/dashboard/analytics/retention',
  },
  {
    title: 'SDK Health',
    description: 'Monitor SDK performance and errors',
    icon: AlertTriangle,
    href: '/dashboard/analytics/sdk-health',
  },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Choose an analytics category to explore your data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analyticsCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Link key={category.href} href={category.href}>
              <Card className="p-6 h-full hover:bg-secondary/50 transition-colors cursor-pointer border border-border bg-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {category.title}
                </h3>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                <Button variant="outline" size="sm">
                  Explore
                </Button>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
