'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, ArrowDown } from 'lucide-react';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function FunnelsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/analytics/funnels');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border border-destructive/50 bg-destructive/10 rounded-lg text-destructive">
        <p className="font-medium">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const { funnelName, totalUsers, overallConversion, steps } = data;

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
            <p className="text-2xl font-bold text-foreground">{funnelName}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-1">Overall Conversion</p>
            <p className="text-2xl font-bold text-foreground">{overallConversion.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Across all projects</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-1">Total Users</p>
            <p className="text-2xl font-bold text-foreground">{totalUsers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Unique users in funnel</p>
          </div>
        </div>
      </Card>

      {/* Funnel Visualization */}
      <Card className="p-6 border border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-8">Funnel Flow</h2>
        <div className="space-y-4">
          {steps.map((item: any, index: number) => {
            const width = totalUsers > 0 ? (item.users / totalUsers) * 100 : 0;
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

                {index < steps.length - 1 && (
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
              {steps.map((step: any, index: number) => {
                const prevUsers = index === 0 ? totalUsers : steps[index - 1].users;
                const stepConversion = prevUsers > 0 ? ((step.users / prevUsers) * 100).toFixed(1) : 0;
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
