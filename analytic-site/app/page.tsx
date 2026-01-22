"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Globe, Activity, TrendingUp, Users, Fuel as Funnel, AlertTriangle, ShieldCheck } from "lucide-react";
import { MinimalBackground } from "@/components/minimal-background";
import { SdkInstallCard } from "@/components/sdk-install-card";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: 'Real-time Analytics',
    description: 'Monitor user activity as it happens with millisecond precision.',
    icon: Activity,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    title: 'Retention Tracking',
    description: 'Analyze cohort retention to improve product stickiness.',
    icon: TrendingUp,
    color: 'text-green-500',
    bg: 'bg-green-500/10'
  },
  {
    title: 'Funnel Analysis',
    description: 'Visualize conversion paths and identify drop-off points.',
    icon: Funnel,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10'
  },
  {
    title: 'User Insights',
    description: 'Deep dive into individual user profiles and session history.',
    icon: Users,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  {
    title: 'SDK Health',
    description: 'Monitor the performance of your analytics integration.',
    icon: ShieldCheck,
    color: 'text-red-500',
    bg: 'bg-red-500/10'
  },
  {
    title: 'Smart Alerts',
    description: 'Get notified instantly when critical metrics spike or drop.',
    icon: AlertTriangle,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10'
  }
];

export default function HomePage() {
  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden relative">
      <MinimalBackground />

      {/* Content */}
      <div className="relative z-10 h-screen flex flex-col overflow-hidden">
        {/* Navigation Header - Floating */}
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-7xl">
          <div className="bg-background/40 backdrop-blur-md border border-border/30 rounded-2xl px-6 py-3 flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold text-foreground hover:text-primary transition"
            >
              <Activity className="w-5 h-5 text-primary" />
              Nexus
            </Link>
            <div className="flex gap-6 items-center">
              <Link
                href="/docs"
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                Docs
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="text-sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content - Split Layout */}
        <main className="flex-1 flex items-center justify-center px-6 pt-20 pb-12 w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Column: Hero Text */}
            <div className="space-y-8 max-w-2xl">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight text-balance">
                  Track events with{" "}
                  <span className="text-primary font-semibold block">
                    perfect clarity
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                  Real-time analytics platform that makes sense of your user
                  behavior. Understand patterns, optimize decisions, and scale
                  with confidence.
                </p>
              </div>

              <div className="flex gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="gap-2 text-base px-8 h-12">
                    Start Free
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base px-8 h-12 bg-transparent"
                  >
                   Explore Docs
                  </Button>
                </Link>
              </div>

              <div className="pt-8">
                <p className="text-sm text-muted-foreground mb-3 font-medium">
                  Install in seconds:
                </p>
                <SdkInstallCard />
              </div>
            </div>

            {/* Right Column: Feature Grid (Scrollable on mobile, fixed on desktop) */}
            <div className="hidden lg:grid grid-cols-2 gap-4 h-[600px] overflow-y-auto pr-2 pb-2 scrollbar-hide mask-gradient">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="p-5 border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 group">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${feature.bg} group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                );
              })}
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 bg-background/50 backdrop-blur px-6 py-4 relative z-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-8">
            <div>
              <p className="text-xs text-muted-foreground">
                © 2026 Nexus • Built by <a href="https://github.com/iampraiez" target="_blank" className="hover:text-primary transition">Praise Olaoye</a>
              </p>
            </div>
            <div className="flex gap-6 items-center">
              <a
                href="https://iampraiez.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition"
                title="Portfolio"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/iampraiez"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </footer>
      </div>
      
      <style jsx global>{`
        .mask-gradient {
          mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
