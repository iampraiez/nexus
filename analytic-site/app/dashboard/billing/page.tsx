'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import Loading from './loading';

const plans = [
  {
    name: 'Free',
    id: 'free',
    price: '0',
    description: 'Perfect for getting started',
    features: [
      '10,000 events/month',
      'Basic analytics',
      'Limited retention',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    id: 'pro',
    price: '99',
    description: 'For growing teams',
    features: [
      'Unlimited events',
      'Advanced analytics',
      'Full retention',
      'Email alerts',
      'Priority support',
      'Custom integrations',
    ],
  },
];

export default function BillingPage() {
  const searchParams = useSearchParams();
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadCurrentPlan = useCallback(async () => {
    try {
      const response = await fetch('/api/billing/subscription');
      if (response.ok) {
        const data = await response.json();
        setCurrentPlan(data.data?.plan || 'free');
      }
    } catch (error) {
      console.error('Error loading plan:', error);
    }
  }, []);

  useEffect(() => {
    // Check if returning from Stripe checkout
    const sessionId = searchParams.get('session');
    if (sessionId) {
      setMessage('Payment successful! Your subscription has been activated.');
      setTimeout(() => setMessage(''), 5000);
    }

    loadCurrentPlan();
  }, [searchParams, loadCurrentPlan]);

  async function handleUpgrade(plan: string) {
    if (plan === currentPlan) return;

    setLoading(true);
    try {
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (response.ok && data.data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.data.url;
      } else if (response.ok && plan === 'free') {
        // Successfully downgraded to free
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

  return (
    <div className="space-y-8">
      <Suspense fallback={<Loading />}>
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Billing</h1>
          <p className="text-muted-foreground">
            Manage your plan and billing information
          </p>
        </div>

        {message && (
          <Card className="p-4 border border-green-500/20 bg-green-500/10">
            <p className="text-sm text-green-600">{message}</p>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            return (
              <Card
                key={plan.id}
                className={`p-6 border ${
                  isCurrent ? 'border-primary bg-primary/5' : 'border-border bg-card'
                }`}
              >
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-foreground">{plan.name}</h2>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <Button
                  className="w-full mb-6"
                  variant={isCurrent ? 'default' : 'outline'}
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : isCurrent ? (
                    'Current Plan'
                  ) : (
                    'Upgrade'
                  )}
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary" />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Events This Month</p>
              <p className="text-3xl font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground mt-1">
                {currentPlan === 'free'
                  ? 'of 10,000 allowed'
                  : 'Unlimited'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-1">Storage Used</p>
              <p className="text-3xl font-bold text-foreground">0 GB</p>
              <p className="text-xs text-muted-foreground mt-1">
                {currentPlan === 'free'
                  ? 'of 5 GB limit'
                  : 'Unlimited'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-1">Retention</p>
              <p className="text-3xl font-bold text-foreground">
                {currentPlan === 'free' ? '30' : '365'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">days</p>
            </div>
          </div>
        </Card>
      </Suspense>
    </div>
  );
}
