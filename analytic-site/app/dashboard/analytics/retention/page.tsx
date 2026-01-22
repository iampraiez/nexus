'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Filter } from 'lucide-react';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function RetentionPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/analytics/retention');
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

  const { cohorts, keyMetrics } = data;
  const getRetentionPercent = (retained: number | null, total: number) => {
    if (!retained) return '-';
    return ((retained / total) * 100).toFixed(0) + '%';
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Retention Analysis</h1>
          <p className="text-muted-foreground">
            Monitor user retention metrics and cohort behavior
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {keyMetrics.map((metric: any) => (
          <Card key={metric.label} className="p-4 border border-border bg-card">
            <p className="text-muted-foreground text-sm mb-1">{metric.label}</p>
            <p className="text-3xl font-bold text-foreground">{metric.value}</p>
            <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
          </Card>
        ))}
      </div>

      {/* Retention Table */}
      <Card className="border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Cohort Retention</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Cohort</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Users</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Day 1</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Day 7</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Day 14</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Day 30</th>
              </tr>
            </thead>
            <tbody>
              {cohorts.map((row: any) => (
                <tr key={row.cohort} className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{row.cohort}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{row.users.toLocaleString()}</td>
                  {[row.day1, row.day7, row.day14, row.day30].map((val, i) => {
                    const percentage = val !== null ? (val / row.users) * 100 : null;
                    const opacity = percentage !== null ? Math.max(0.1, percentage / 100) : 0;
                    
                    return (
                      <td key={i} className="px-2 py-4 text-center">
                        {percentage !== null ? (
                          <div 
                            className="py-2 rounded text-xs font-bold"
                            style={{ 
                              backgroundColor: `rgba(59, 130, 246, ${opacity})`,
                              color: opacity > 0.5 ? 'white' : 'inherit'
                            }}
                          >
                            {percentage.toFixed(1)}%
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Retention Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-6">Day 7 Retention Trends</h2>
          <div className="space-y-4">
            {cohorts
              .filter((c: any) => c.day7)
              .map((cohort: any) => {
                const retention = ((cohort.day7! / cohort.users) * 100).toFixed(0);
                return (
                  <div key={cohort.cohort}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {cohort.cohort}
                      </span>
                      <span className="text-sm font-bold text-foreground">{retention}%</span>
                    </div>
                    <div className="w-full bg-secondary/50 rounded h-2">
                      <div
                        className="bg-blue-500 h-full rounded transition-all"
                        style={{ width: `${retention}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>

        <Card className="p-6 border border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-6">Insights</h2>
          <div className="space-y-3">
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded">
              <p className="text-sm font-semibold text-foreground">Strong Initial Retention</p>
              <p className="text-xs text-muted-foreground mt-1">
                Most cohorts have 80%+ Day 7 retention
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
              <p className="text-sm font-semibold text-foreground">Declining After Day 14</p>
              <p className="text-xs text-muted-foreground mt-1">
                Day 30 retention drops to ~46%. Consider re-engagement campaigns
              </p>
            </div>
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
              <p className="text-sm font-semibold text-foreground">Newer cohorts showing promise</p>
              <p className="text-xs text-muted-foreground mt-1">
                Week of Jan 22 cohort has 100% Day 1 retention
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
