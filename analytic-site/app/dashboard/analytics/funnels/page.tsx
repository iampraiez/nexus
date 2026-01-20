'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, ArrowDown } from 'lucide-react';

const funnelSteps = [
  {
    step: 1,
    name: 'Page Visit',
    users: 10000,
    dropoff: 0,
    dropoffPercent: 0,
    avgTime: '-',
  },
  {
    step: 2,
    name: 'Sign Up',
    users: 3200,
    dropoff: 6800,
    dropoffPercent: 68,
    avgTime: '2m 45s',
  },
  {
    step: 3,
    name: 'Email Verification',
    users: 2856,
    dropoff: 344,
    dropoffPercent: 10.8,
    avgTime: '1m 12s',
  },
  {
    step: 4,
    name: 'Onboarding',
    users: 2284,
    dropoff: 572,
    dropoffPercent: 20,
    avgTime: '5m 34s',
  },
  {
    step: 5,
    name: 'First Project',
    users: 1713,
    dropoff: 571,
    dropoffPercent: 25,
    avgTime: '3m 18s',
  },
  {
    step: 6,
    name: 'First Event Track',
    users: 1456,
    dropoff: 257,
    dropoffPercent: 15,
    avgTime: '8m 22s',
  },
];

export default function FunnelsPage() {
  const totalConversion = ((1456 / 10000) * 100).toFixed(1);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Conversion Funnels</h1>
          <p className="text-muted-foreground">
            Analyze user conversion funnels and identify drop-off points
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="p-6 border border-border bg-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Funnel Name</p>
            <p className="text-2xl font-bold text-foreground">Signup to First Event</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-1">Overall Conversion</p>
            <p className="text-2xl font-bold text-foreground">{totalConversion}%</p>
            <p className="text-xs text-red-600 mt-1">↓ 2.3% from last period</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-1">Total Users</p>
            <p className="text-2xl font-bold text-foreground">10,000</p>
            <p className="text-xs text-green-600 mt-1">↑ 8.2% from last period</p>
          </div>
        </div>
      </Card>

      {/* Funnel Visualization */}
      <Card className="p-6 border border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-8">Funnel Flow</h2>
        <div className="space-y-4">
          {funnelSteps.map((item, index) => {
            const width = (item.users / 10000) * 100;
            return (
              <div key={item.step} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      Step {item.step}: {item.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{item.users.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {width.toFixed(1)}% of initial
                    </p>
                  </div>
                </div>
                <div className="w-full bg-secondary/50 rounded-full h-8 overflow-hidden">
                  <div
                    className="bg-primary h-full flex items-center justify-end pr-3 transition-all"
                    style={{ width: `${width}%` }}
                  >
                    <span className="text-xs font-bold text-primary-foreground">
                      {width.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {index < funnelSteps.length - 1 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/20 rounded">
                    <ArrowDown className="w-4 h-4 text-destructive" />
                    <span className="text-sm text-destructive">
                      <span className="font-bold">{item.dropoff.toLocaleString()}</span> users dropped off (
                      {item.dropoffPercent.toFixed(1)}%)
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Step Details */}
      <Card className="border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Step Analysis</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Step
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Users Entered
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Users Completed
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Step Conversion
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Avg. Time
                </th>
              </tr>
            </thead>
            <tbody>
              {funnelSteps.map((step, index) => {
                const prevUsers = index === 0 ? 10000 : funnelSteps[index - 1].users;
                const stepConversion = ((step.users / prevUsers) * 100).toFixed(1);
                return (
                  <tr
                    key={step.step}
                    className="border-b border-border hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {step.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {prevUsers.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {step.users.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-foreground">
                      {stepConversion}%
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{step.avgTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Improvement Suggestions */}
      <Card className="p-6 border border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Insights & Recommendations</h2>
        <div className="space-y-3">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded">
            <p className="text-sm font-semibold text-foreground">High drop-off at signup (68%)</p>
            <p className="text-xs text-muted-foreground mt-1">
              Consider simplifying the signup form or adding incentives
            </p>
          </div>
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded">
            <p className="text-sm font-semibold text-foreground">Onboarding drop-off (20%)</p>
            <p className="text-xs text-muted-foreground mt-1">
              Review onboarding flow and add progress indicators
            </p>
          </div>
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded">
            <p className="text-sm font-semibold text-foreground">Positive: Email verification (10.8%)</p>
            <p className="text-xs text-muted-foreground mt-1">
              This is a natural drop-off. Consider sending reminder emails
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
