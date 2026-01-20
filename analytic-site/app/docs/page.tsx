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

            {/* Step 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  1
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Create a Project
                </h3>
              </div>
              <div className="bg-card/40 border border-border/50 rounded-lg p-6 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Sign up for free and create your first project. You&apos;ll
                  get an API key instantly:
                </p>
                <div className="bg-secondary rounded-lg p-3 font-mono text-xs text-primary overflow-x-auto">
                  pk_live_xxxxxxxxxxxxxxxxxxxx
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  2
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Initialize the SDK
                </h3>
              </div>
              <div className="bg-card/40 border border-border/50 rounded-lg p-6">
                <CopyableCode
                  code={`import { Analytics } from '@nexus/analytics-sdk';

// Initialize once at app startup
const analytics = new Analytics({
  apiKey: 'pk_live_your_api_key',
  apiUrl: 'https://api.nexus-analytics.com/events'
});`}
                  language="typescript"
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  3
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Start Tracking Events
                </h3>
              </div>
              <div className="bg-card/40 border border-border/50 rounded-lg p-6">
                <CopyableCode
                  code={`// Track user actions
analytics.track('user_signup', {
  plan: 'pro',
  source: 'landing_page'
});

// Identify users (optional but recommended)
analytics.identify('user_12345', {
  email: 'user@example.com',
  plan: 'pro',
  signup_date: '2026-01-20'
});

// Track page views
analytics.pageView('pricing_page', {
  referrer: 'home'
});`}
                  language="typescript"
                />
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  4
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

          {/* Core Concepts */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-foreground">
              Core Concepts
            </h2>

            <div className="space-y-4">
              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h3 className="font-semibold text-foreground mb-2 text-lg">
                  Events
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Events are actions your users take. They can be anything:
                  button clicks, form submissions, page views, or custom
                  business events.
                </p>
                <CopyableCode
                  code={`analytics.track('purchase', { amount: 99.99, currency: 'USD' })`}
                  language="typescript"
                />
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h3 className="font-semibold text-foreground mb-2 text-lg">
                  User Identification
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Link events to specific users with the `identify` method. This
                  allows you to build user profiles, track user journeys, and
                  create cohorts.
                </p>
                <CopyableCode
                  code={`analytics.identify('user_id', { email: 'user@example.com' })`}
                  language="typescript"
                />
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h3 className="font-semibold text-foreground mb-2 text-lg">
                  Properties
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Every event can have properties—contextual data that describes
                  what happened. Use properties to segment and analyze your
                  data.
                </p>
                <CopyableCode
                  code={`analytics.track('course_completed', { course_id: '101', duration_minutes: 45 })`}
                  language="typescript"
                />
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
                  track(eventName, properties?)
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Records an event. This is the primary method for tracking user
                  actions.
                </p>
                <CopyableCode
                  code={`analytics.track('video_watched', {
  video_id: 'v123',
  duration_seconds: 300,
  completed: true
});`}
                  language="typescript"
                />
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h4 className="font-mono text-primary mb-3 text-sm font-semibold">
                  identify(userId, traits?)
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Associate events with a specific user and set their traits.
                  Traits are persistent user attributes.
                </p>
                <CopyableCode
                  code={`analytics.identify('user_456', {
  email: 'john@example.com',
  name: 'John Doe',
  plan: 'premium',
  signup_date: '2025-06-15'
});`}
                  language="typescript"
                />
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h4 className="font-mono text-primary mb-3 text-sm font-semibold">
                  pageView(pageName, properties?)
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Automatically tracks page views with URL and referrer
                  information.
                </p>
                <CopyableCode
                  code={`analytics.pageView('pricing', {
  utm_source: 'google',
  utm_campaign: 'summer_sale'
});`}
                  language="typescript"
                />
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h4 className="font-mono text-primary mb-3 text-sm font-semibold">
                  flush()
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Immediately sends all queued events. Useful before page
                  unloads.
                </p>
                <CopyableCode
                  code={`analytics.flush()`}
                  language="typescript"
                />
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <h4 className="font-mono text-primary mb-3 text-sm font-semibold">
                  reset()
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Clears the current user context. Use this on logout.
                </p>
                <CopyableCode
                  code={`analytics.reset()`}
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
                  Keep event names consistent with your team&apos;s naming
                  convention (e.g., snake_case). This makes analysis easier.
                </p>
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <h4 className="font-semibold text-foreground">
                    Identify Users Early
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Call `identify()` as soon as you know who the user is,
                  typically after login or signup.
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
                  Call `flush()` before page unloads to ensure all events are
                  sent.
                </p>
              </div>

              <div className="border border-border/50 rounded-lg p-6 bg-card/30 backdrop-blur">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <h4 className="font-semibold text-foreground">
                    Test Your Events
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use the dashboard to verify that events are being tracked
                  correctly before going live.
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
              © 2026 Nexus • Modern Analytics, Built Simple
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
