'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2, AlertTriangle, Zap } from 'lucide-react';
import { Suspense } from 'react';
import Loading from './loading';
import { useDashboard } from '../dashboard-context';

const plans = [
  {
    name: "Free",
    id: "free",
    price: "0",
    description: "Perfect for getting started",
    features: [
      "10,000 events/month",
      "3 API Projects",
      "Basic analytics",
      "1 Day Data Retention",
    ],
  },
  {
    name: "Pro",
    id: "pro",
    price: "9.99",
    description: "For growing teams",
    features: [
      "Unlimited events",
      "Unlimited Projects",
      "Advanced analytics",
      "Full retention",
      "Email alerts",
      "Priority support",
    ],
  },
];

export default function BillingPage() {
  const searchParams = useSearchParams();
  const { usage, company, loading: contextLoading, refreshData } = useDashboard();
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (company) {
      setCurrentPlan(company.plan || 'free');
    }
    
    // Check if returning from Stripe checkout
    const sessionId = searchParams.get('session');
    if (sessionId) {
      setMessage('Payment successful! Your subscription has been activated.');
      refreshData(true); // Force refresh to update plan and limits
      setTimeout(() => setMessage(''), 5000);
    }
  }, [company, searchParams]);

  async function handleUpgrade(plan: string) {
    if (plan === currentPlan) return;

    setLoading(true);
    try {
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, currency }),
      });

      const data = await response.json();

      if (response.ok && data.data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.data.url;
      } else if (response.ok && plan === 'free') {
        // Successfully downgraded to free
        await refreshData(true); // Force refresh to update plan and limits
        setCurrentPlan('free');
        setMessage('Downgraded to Free plan');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Failed to process upgrade');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (contextLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-8">
      <Suspense fallback={<Loading />}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Billing</h1>
            <p className="text-muted-foreground">
              Manage your plan and billing information
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center bg-secondary/50 p-1 rounded-lg border border-border w-fit">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                currency === 'USD' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('NGN')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                currency === 'NGN' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              NGN (₦)
            </button>
          </div>
        </div>

        {message && (
          <Card className="p-4 border border-green-500/20 bg-green-500/10">
            <p className="text-sm text-green-600">{message}</p>
          </Card>
        )}

        {/* Free Tier Exceeded Warning */}
        {usage.isFreeTierExceeded && (
          <Card className="p-4 border border-destructive/20 bg-destructive/10 flex items-start gap-4">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
            <div>
              <h3 className="font-semibold text-destructive">Free Tier Limit Exceeded</h3>
              <p className="text-sm text-destructive/80 mt-1">
                You have exceeded the 10,000 events limit for the Free tier. 
                Data ingestion is currently paused. Please upgrade to Pro to resume tracking.
              </p>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            const price = currency === 'NGN' && plan.id === 'pro' ? '14,000' : plan.price;
            const symbol = currency === 'NGN' ? '₦' : '$';
            
            return (
              <Card
                key={plan.id}
                className={`p-6 border relative overflow-hidden transition-all ${
                  isCurrent 
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
                    : !usage.isFreeTier && plan.id === 'free'
                      ? 'border-border bg-card/50 opacity-60' // Dim free plan if Pro is active
                      : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                {isCurrent && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                    CURRENT PLAN
                  </div>
                )}
                
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    {plan.name}
                    {plan.id === 'pro' && <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
                  </h2>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">
                    {symbol}{price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <Button
                  className="w-full mb-6"
                  variant={isCurrent || (!usage.isFreeTier && plan.id === 'free') ? 'outline' : 'default'}
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loading || isCurrent || (!usage.isFreeTier && plan.id === 'free')}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : isCurrent ? (
                    'Active'
                  ) : !usage.isFreeTier ? (
                    'Included'
                  ) : (
                    `Upgrade to ${plan.name}`
                  )}
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-foreground text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Usage Information */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-6">Current Usage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Events Usage */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <p className="text-sm font-medium text-muted-foreground">Monthly Events</p>
                <p className="text-sm font-medium text-foreground">
                  {usage.eventsCount.toLocaleString()} / {currentPlan === 'free' ? '10,000' : 'Unlimited'}
                </p>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    usage.isFreeTierExceeded ? 'bg-destructive' : 'bg-primary'
                  }`}
                  style={{ 
                    width: currentPlan === 'free' 
                      ? `${Math.min((usage.eventsCount / 10000) * 100, 100)}%` 
                      : '100%' 
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {usage.isFreeTierExceeded 
                  ? 'Limit exceeded. Upgrade to continue tracking.' 
                  : 'Resets on the 1st of next month.'}
              </p>
            </div>

            {/* Projects Usage */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-sm font-medium text-foreground">
                  {usage.projectsCount} / {currentPlan === 'free' ? '3' : 'Unlimited'}
                </p>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ 
                    width: currentPlan === 'free' 
                      ? `${Math.min((usage.projectsCount / 3) * 100, 100)}%` 
                      : `${Math.min((usage.projectsCount / 10) * 100, 100)}%` // Visual filler for pro
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {currentPlan === 'free' && usage.projectsCount >= 3
                  ? 'Project limit reached.'
                  : 'Create more projects to organize your data.'}
              </p>
            </div>
          </div>
        </Card>
      </Suspense>
    </div>
  );
}
