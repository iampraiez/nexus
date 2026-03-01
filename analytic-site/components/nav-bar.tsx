"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, Menu, X } from "lucide-react";

export function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating pill */}
      <div className="bg-background/40 backdrop-blur-md border border-border/30 rounded-2xl px-5 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold text-foreground hover:text-primary transition"
        >
          <Activity className="w-5 h-5 text-primary" />
          Nexus
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex gap-5 items-center">
          <Link
            href="/docs"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Docs
          </Link>
          <Link
            href="/sdk-test"
            className="text-sm text-muted-foreground hover:text-primary transition"
          >
            SDK Demo
          </Link>
          <Link href="/auth/register">
            <Button size="sm" className="text-sm">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {open && (
        <>
          {/* Dim backdrop */}
          <div
            className="sm:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setOpen(false)}
          />

          {/* Sidebar panel — slides in from right */}
          <div className="sm:hidden fixed top-0 right-0 z-50 h-screen w-72 bg-background border-l border-border/50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 font-semibold text-foreground"
              >
                <Activity className="w-4 h-4 text-primary" />
                Nexus
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col gap-1 p-4 flex-1">
              <Link
                href="/docs"
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-lg transition"
              >
                Docs
              </Link>
              <Link
                href="/sdk-test"
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition"
              >
                SDK Demo
              </Link>
            </nav>

            {/* CTA pinned to bottom */}
            <div className="p-4 border-t border-border/30">
              <Link href="/auth/register" onClick={() => setOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
