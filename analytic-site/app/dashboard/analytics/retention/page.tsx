'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Filter } from 'lucide-react';

const retentionData = [
  {
    cohort: 'Week of Jan 1',
    users: 245,
    day1: 245,
    day7: 198,
    day14: 167,
    day30: 112,
  },
  {
    cohort: 'Week of Jan 8',
    users: 312,
    day1: 312,
    day7: 267,
    day14: 198,
    day30: null,
  },
  {
    cohort: 'Week of Jan 15',
    users: 289,
    day1: 289,
    day7: 231,
    day14: null,
    day30: null,
  },
  {
    cohort: 'Week of Jan 22',
    users: 356,
    day1: 356,
    day7: null,
    day14: null,
    day30: null,
  },
];

const keyMetrics = [
  {
    label: 'Day 1 Retention',
    value: '100%',
    description: 'Users active on signup day',
  },
  {
    label: 'Day 7 Retention',
    value: '82.3%',
    description: 'Coming back within 7 days',
    trend: '+5.2%',
  },
  {
    label: 'Day 30 Retention',
    value: '45.7%',
    description: 'Active after 30 days',
    trend: '-3.1%',
  },
];

export default function RetentionPage() {
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
        {keyMetrics.map((metric) => (
          <Card key={metric.label} className="p-4 border border-border bg-card">
            <p className="text-muted-foreground text-sm mb-1">{metric.label}</p>
            <p className="text-3xl font-bold text-foreground">{metric.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
            {metric.trend && (
              <p
                className={`text-xs mt-2 ${
                  metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {metric.trend} from last month
              </p>
            )}
          </Card>
        ))}
      </div>

      {/* Cohort Retention Table */}
      <Card className="border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Retention Cohorts</h2>
          <p className="text-sm text-muted-foreground mt-1">
            User retention by signup cohort (week)
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Cohort
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">
                  Users
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">
                  Day 1
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">
                  Day 7
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">
                  Day 14
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">
                  Day 30
                </th>
              </tr>
            </thead>
            <tbody>
              {retentionData.map((cohort) => (
                <tr
                  key={cohort.cohort}
                  className="border-b border-border hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {cohort.cohort}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-foreground">
                    {cohort.users}
                  </td>
                  <td className="px-6 py-4 text-sm text-center font-bold bg-green-500/10">
                    100%
                  </td>
                  <td
                    className={`px-6 py-4 text-sm text-center font-bold ${
                      cohort.day7 ? 'bg-blue-500/10' : 'text-muted-foreground'
                    }`}
                  >
                    {getRetentionPercent(cohort.day7, cohort.users)}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm text-center font-bold ${
                      cohort.day14 ? 'bg-blue-500/10' : 'text-muted-foreground'
                    }`}
                  >
                    {getRetentionPercent(cohort.day14, cohort.users)}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm text-center font-bold ${
                      cohort.day30 ? 'bg-blue-500/10' : 'text-muted-foreground'
                    }`}
                  >
                    {getRetentionPercent(cohort.day30, cohort.users)}
                  </td>
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
            {retentionData
              .filter((c) => c.day7)
              .map((cohort) => {
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
