'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 md:py-12">
      <div className="bg-card border border-border rounded-xl shadow-sm p-8 md:p-12 space-y-12">
        {/* Main Content */}
        <div className="space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            About <span className="text-primary">Nexus</span>
          </h1>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-xl text-foreground font-medium">
              Nexus was born from a simple observation during a hackathon:
              analytics tools for e-commerce are often too expensive or too
              generic.
            </p>

            <p>
              I built Nexus to solve this. Initially designed as a specialized
              analytics platform for e-commerce applications, it has evolved
              into an open-source solution that can be adapted for any use case.
              Whether you're tracking product views, user retention, or custom
              events, Nexus gives you the data you need without the bloat.
            </p>

            <p>
              My goal was to create something that developers would actually
              enjoy using. Clean APIs, fast dashboards, and insights that don't
              require a data science degree to understand. Since it's open
              source, the community can take it even further.
            </p>
          </div>
        </div>

        {/* Creator Section */}
        <div className="border-t border-border pt-12">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                Created by Praise Olaoye
              </h2>
              <p className="text-muted-foreground max-w-md">
                Software developer passionate about building tools that empower
                other developers. Nexus is a testament to the power of modern
                web technologies.
              </p>

              <div className="flex gap-4 pt-2">
                <Link href="https://github.com/iampraiez" target="_blank">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Github className="w-4 h-4" />
                    GitHub
                  </Button>
                </Link>
                <Link href="https://iampraiez.vercel.app" target="_blank">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Globe className="w-4 h-4" />
                    Portfolio
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="p-6 bg-secondary/30 border-border/50 backdrop-blur-sm max-w-sm">
              <p className="text-sm font-mono text-muted-foreground mb-4 italic">
                "Code is like humor. When you have to explain it, it’s bad."
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                  <Image
                    src="/praise.jpeg"
                    alt="Praise Olaoye"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Praise Olaoye
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Software Engineer
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
