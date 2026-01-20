"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Globe, Activity } from "lucide-react";
import { MinimalBackground } from "@/components/minimal-background";
import { SdkInstallCard } from "@/components/sdk-install-card";

export default function HomePage() {
  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden relative">
      <MinimalBackground />

      {/* Content */}
      <div className="relative z-10 h-screen flex flex-col overflow-hidden">
        {/* Navigation Header - Floating */}
        <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-6xl">
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

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-6 pt-20 pb-24">
          <div className="max-w-3xl w-full space-y-12">
            {/* Hero Content */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-light text-foreground leading-relaxed text-balance">
                Track events with{" "}
                <span className="text-primary font-semibold">
                  perfect clarity
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Real-time analytics platform that makes sense of your user
                behavior. Understand patterns, optimize decisions, and scale
                with confidence.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex gap-4 pt-4">
              <Link href="/auth/register">
                <Button size="lg" className="gap-2 text-base px-8">
                  Start Free
                </Button>
              </Link>
              <Link href="/docs">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 bg-transparent"
                >
                  Explore Docs
                </Button>
              </Link>
            </div>

            {/* Quick Install Clipboard */}
            <div className="pt-12 max-w-2xl">
              <p className="text-sm text-muted-foreground mb-3">
                Get started in seconds:
              </p>
              <SdkInstallCard />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 bg-background/50 backdrop-blur px-6 py-6 relative z-10">
          <div className="max-w-6xl mx-auto flex justify-between items-center gap-8">
            <div>
              <p className="text-xs text-muted-foreground">
                © 2026 Nexus • Built by @iampraiez
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
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/iampraiez"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
