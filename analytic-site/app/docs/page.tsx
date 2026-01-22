"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Code,
  FileText,
  Github,
  Globe,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Activity,
} from "lucide-react";
import { CopyableCode } from "@/components/copyable-code";
import { MinimalBackground } from "@/components/minimal-background";

export default function PublicDocsPage() {
  return (
    <div className="h-screen bg-background flex flex-col overflow-y-auto relative">
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
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Home
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="text-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-24 pt-28 relative z-10">
        <div className="space-y-20">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-light text-foreground leading-relaxed flex items-center gap-3">
              <Activity className="w-10 h-10 text-primary flex-shrink-0" />
              Nexus{" "}
              <span className="text-primary font-semibold">Analytics SDK</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              A powerful, production-ready event tracking SDK for understanding
              user behavior. Track events in real-time, build powerful
              analytics, and make data-driven decisions with confidence.
            </p>
          </div>

          {/* What is Nexus */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-foreground">
              What is Nexus?
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Nexus is a modern analytics platform that helps you understand
              your users through real-time event tracking. Instead of relying on
              third-party analytics services, Nexus gives you full control over
              your data with a simple, developer-friendly SDK and powerful
              backend infrastructure.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="p-6 rounded-lg border border-border/50 bg-card/30 backdrop-blur">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Real-time Data
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Events are tracked and available instantly on your
                      dashboards. No delays, no batching tricks—pure real-time
                      analytics.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-lg border border-border/50 bg-card/30 backdrop-blur">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Reliable at Scale
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Designed to handle millions of events. Automatic batching,
                      retries, and failsafe delivery ensure nothing is lost.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-lg border border-border/50 bg-card/30 backdrop-blur">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Privacy First
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your data stays yours. We don&apos;t sell data, and you
                      have complete control over what gets tracked.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-lg border border-border/50 bg-card/30 backdrop-blur">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Developer Friendly
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Simple, intuitive API that takes minutes to integrate. No
                      complex configuration needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Start */}
          <div className="space-y-8">
            <h2 className="text-3xl font-semibold text-foreground">
              Quick Start (5 minutes)
            </h2>

            {/* Step 0: API Key */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  1
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Get Your API Key
                </h3>
              </div>
              <div className="bg-card/40 border border-border/50 rounded-lg p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Before you can start tracking events, you need to create a project and generate an API key in your Nexus dashboard.
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Create an account or sign in</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Create a new project</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>Go to <strong>Settings &gt; API Keys</strong> to find your credentials</span>
                  </div>
                </div>
                <Link href="/auth/register">
                  <Button size="sm" className="mt-2">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>

            {/* Step 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  2
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Install the SDK
                </h3>
              </div>
              <div className="bg-card/40 border border-border/50 rounded-lg p-6 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Install the production-ready SDK via npm or pnpm:
                </p>
                <div className="bg-secondary rounded-lg p-3 font-mono text-xs text-primary overflow-x-auto">
                  npm install nexus-avail
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  3
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Initialize the SDK
                </h3>
              </div>
              <div className="bg-card/40 border border-border/50 rounded-lg p-6">
                <CopyableCode
                  code={`import { Nexus } from 'nexus-avail';

// Initialize once at app startup
Nexus.init({
  apiKey: 'pk_live_your_api_key', // Generate at https://nexus-anal.vercel.app/
  projectId: 'your_project_id',
  environment: 'production'
});`}
                  language="typescript"
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  4
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Start Tracking Events
                </h3>
              </div>
              <div className="bg-card/40 border border-border/50 rounded-lg p-6">
                <CopyableCode
                  code={`// Track user actions with type-safe schemas
Nexus.track('user_signup', {
  email: 'user@example.com',
  source: 'landing_page'
});

// Track product interactions
Nexus.track('product_viewed', {
  productId: 'prod_123',
  productName: 'Awesome Headphones',
  category: 'Electronics'
});

// Track orders
Nexus.track('order_created', {
  orderId: 'order_987',
  userId: 'user_123',
  amount: 99.99,
  currency: 'USD',
  items: [{ productId: 'prod_123', qty: 1 }]
});`}
                  language="typescript"
                />
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  5
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  View Your Analytics
                </h3>
              </div>
              <div className="bg-card/40 border border-border/50 rounded-lg p-6 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Go to your Nexus dashboard and watch your events stream in
                  real-time. Explore trends, user behavior, and conversion
                  funnels.
                </p>
              </div>
            </div>
          </div>

          {/* Environment Support */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-foreground">
              Cross-Platform Support
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              The Nexus SDK is designed to work seamlessly in any environment.
              It automatically detects where it&apos;s running and adjusts its
              behavior for maximum performance and reliability.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="p-6 rounded-lg border border-border/50 bg-card/30 backdrop-blur">
                <div className="flex items-start gap-4">
                  <Globe className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Browser Environment
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Uses IndexedDB for robust offline persistence and
                      SubtleCrypto for secure request signing. Perfect for
                      React, Next.js, and Vue apps.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-lg border border-border/50 bg-card/30 backdrop-blur">
                <div className="flex items-start gap-4">
                  <Code className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Node.js Environment
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Uses the filesystem for event caching and the native
                      crypto module. Ideal for server-side tracking in API
                      routes or backend services.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Concepts */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-foreground">
              Core Concepts
            </h2>

            <div className="space-y-4">
              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h3 className="font-semibold text-foreground mb-2 text-lg">
                  Type-Safe Events
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Nexus uses TypeScript to ensure your event data is always
                  correct. No more missing fields or typos in your analytics
                  data.
                </p>
                <CopyableCode
                  code={`Nexus.track('payment_failed', { 
  orderId: 'order_123', 
  error: 'Insufficient funds' 
})`}
                  language="typescript"
                />
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h3 className="font-semibold text-foreground mb-2 text-lg">
                  Automatic Batching
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  To optimize performance, events are automatically batched and
                  sent every 2 seconds or when the batch size reaches 10.
                </p>
                <CopyableCode
                  code={`// Events are queued and sent efficiently
Nexus.track('product_viewed', { productId: '1' });
Nexus.track('product_viewed', { productId: '2' });`}
                  language="typescript"
                />
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h3 className="font-semibold text-foreground mb-2 text-lg">
                  Offline Persistence
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  If the user goes offline, events are saved locally and
                  automatically synced when the connection is restored.
                </p>
                <div className="bg-secondary/30 rounded-lg p-4 text-sm text-muted-foreground italic">
                  &ldquo;Never lose a single event due to network
                  instability.&rdquo;
                </div>
              </div>
            </div>
          </div>

          {/* SDK Methods */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-foreground">
              SDK Methods Reference
            </h2>

            <div className="space-y-4">
              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h4 className="font-mono text-primary mb-3 text-sm font-semibold">
                  Nexus.init(config)
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Initializes the SDK. Must be called before tracking any
                  events.
                </p>
                <CopyableCode
                  code={`Nexus.init({
  apiKey: 'your_key',
  projectId: 'your_id',
  environment: 'production',
  batchSize: 10,
  flushInterval: 2000
});`}
                  language="typescript"
                />
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h4 className="font-mono text-primary mb-3 text-sm font-semibold">
                  Nexus.track(eventType, data)
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Records an event with type-safe data validation.
                </p>
                <CopyableCode
                  code={`Nexus.track('user_login', {
  email: 'john@example.com'
});`}
                  language="typescript"
                />
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h4 className="font-mono text-primary mb-3 text-sm font-semibold">
                  Nexus.flush()
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Immediately sends all queued events. Returns a promise that
                  resolves when sending is complete.
                </p>
                <CopyableCode
                  code={`await Nexus.flush();`}
                  language="typescript"
                />
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h4 className="font-mono text-primary mb-3 text-sm font-semibold">
                  Nexus.getSessionId()
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Returns the current unique session identifier.
                </p>
                <CopyableCode
                  code={`const sessionId = Nexus.getSessionId();`}
                  language="typescript"
                />
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h4 className="font-mono text-primary mb-3 text-sm font-semibold">
                  Nexus.destroy()
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Flushes pending events and cleans up resources.
                </p>
                <CopyableCode
                  code={`await Nexus.destroy();`}
                  language="typescript"
                />
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-foreground">
              Best Practices
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <h4 className="font-semibold text-foreground">
                    Use Consistent Event Names
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Stick to the predefined event types for maximum compatibility
                  with Nexus dashboards.
                </p>
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <h4 className="font-semibold text-foreground">
                    Initialize Once
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Call `Nexus.init()` once at the root of your application
                  (e.g., in `App.tsx` or `layout.tsx`).
                </p>
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <h4 className="font-semibold text-foreground">
                    Include Contextual Data
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Always include relevant properties with events. More context =
                  better insights.
                </p>
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <h4 className="font-semibold text-foreground">
                    Don&apos;t Track Sensitive Data
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Never track passwords, API keys, or payment information. Only
                  track what you need for analysis.
                </p>
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <h4 className="font-semibold text-foreground">
                    Flush Before Unload
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Call `Nexus.destroy()` in your cleanup logic to ensure all
                  pending events are sent.
                </p>
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <h4 className="font-semibold text-foreground">
                    Use TypeScript
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Take advantage of the SDK&apos;s full TypeScript support for
                  autocompletion and error checking.
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-foreground">
              Platform Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h4 className="font-semibold text-foreground mb-2">
                  Event Analytics
                </h4>
                <p className="text-sm text-muted-foreground">
                  View event trends, distributions, and patterns. Understand
                  which actions drive your business.
                </p>
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h4 className="font-semibold text-foreground mb-2">
                  User Cohorts
                </h4>
                <p className="text-sm text-muted-foreground">
                  Segment users by behavior, traits, or time. Build cohorts for
                  targeted analysis and campaigns.
                </p>
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h4 className="font-semibold text-foreground mb-2">
                  Conversion Funnels
                </h4>
                <p className="text-sm text-muted-foreground">
                  Track multi-step user journeys and identify where users drop
                  off. Optimize conversion rates.
                </p>
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h4 className="font-semibold text-foreground mb-2">
                  Retention Analysis
                </h4>
                <p className="text-sm text-muted-foreground">
                  Measure user retention over time. Build cohort retention
                  tables to track user engagement.
                </p>
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h4 className="font-semibold text-foreground mb-2">
                  Real-time Dashboards
                </h4>
                <p className="text-sm text-muted-foreground">
                  Live event streams and dashboards. See what&apos;s happening
                  right now, not yesterday.
                </p>
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h4 className="font-semibold text-foreground mb-2">
                  Custom Alerts
                </h4>
                <p className="text-sm text-muted-foreground">
                  Get notified when something unusual happens. Set alerts for
                  error rates, usage spikes, and more.
                </p>
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h4 className="font-semibold text-foreground mb-2">
                  Multiple Projects
                </h4>
                <p className="text-sm text-muted-foreground">
                  Manage analytics for multiple apps or environments. Each with
                  its own API key and data.
                </p>
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h4 className="font-semibold text-foreground mb-2">
                  Data Privacy
                </h4>
                <p className="text-sm text-muted-foreground">
                  Your data is yours. No selling, no sharing. Complete control
                  over what gets tracked.
                </p>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="p-8 rounded-lg border border-border/50 bg-card/30 backdrop-blur">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Need Help?
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Have questions or need support? We&apos;re here to help.
                </p>
                <div className="flex gap-3">
                  <Link href="/auth/register">
                    <Button size="sm" variant="default">
                      Create Account
                    </Button>
                  </Link>
                  <a
                    href="https://github.com/iampraiez/commerce_brain"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="outline" className="gap-2">
                      <Github className="w-4 h-4" />
                      GitHub Repo
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50 backdrop-blur px-6 py-6 mt-20 relative z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center gap-8">
          <div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Nexus • Modern Analytics, Built
              Simple by{" "}
              <a
                href="https://github.com/iampraiez"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                iampraiez
              </a>
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
  );
}
