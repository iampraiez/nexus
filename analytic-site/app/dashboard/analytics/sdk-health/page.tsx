'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, Filter, AlertTriangle } from 'lucide-react';

const healthData = [
  { date: 'Jan 1', deliveryRate: 99.8, errorRate: 0.2, latency: 145 },
  { date: 'Jan 2', deliveryRate: 99.9, errorRate: 0.1, latency: 142 },
  { date: 'Jan 3', deliveryRate: 99.7, errorRate: 0.3, latency: 156 },
  { date: 'Jan 4', deliveryRate: 99.9, errorRate: 0.1, latency: 138 },
  { date: 'Jan 5', deliveryRate: 99.8, errorRate: 0.2, latency: 151 },
  { date: 'Jan 6', deliveryRate: 99.6, errorRate: 0.4, latency: 167 },
  { date: 'Jan 7', deliveryRate: 99.9, errorRate: 0.1, latency: 144 },
];

const versionStats = [
  { version: '1.0.0', count: 4200, percentage: 65 },
  { version: '0.9.5', count: 1800, percentage: 28 },
  { version: '0.9.0', count: 400, percentage: 6 },
  { version: 'Others', count: 100, percentage: 1 },
];

const errorTypes = [
  { type: 'Network Error', count: 45, percentage: 42 },
  { type: 'Invalid API Key', count: 32, percentage: 30 },
  { type: 'Timeout', count: 20, percentage: 19 },
  { type: 'Rate Limited', count: 10, percentage: 9 },
];

export default function SdkHealthPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">SDK Health</h1>
          <p className="text-muted-foreground">
            Monitor SDK performance, delivery rates, and errors
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Calendar className="w-4 h-4" />
            Last 7 Days
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-border bg-card">
          <p className="text-muted-foreground text-sm mb-1">Delivery Rate</p>
          <p className="text-3xl font-bold text-foreground">99.8%</p>
          <p className="text-xs text-green-600 mt-2">↑ 0.2% from last week</p>
        </Card>
        <Card className="p-4 border border-border bg-card">
          <p className="text-muted-foreground text-sm mb-1">Error Rate</p>
          <p className="text-3xl font-bold text-foreground">0.2%</p>
          <p className="text-xs text-red-600 mt-2">↑ 0.1% from last week</p>
        </Card>
        <Card className="p-4 border border-border bg-card">
          <p className="text-muted-foreground text-sm mb-1">Avg Latency</p>
          <p className="text-3xl font-bold text-foreground">149ms</p>
          <p className="text-xs text-green-600 mt-2">↓ 8ms from last week</p>
        </Card>
        <Card className="p-4 border border-border bg-card">
          <p className="text-muted-foreground text-sm mb-1">p95 Latency</p>
          <p className="text-3xl font-bold text-foreground">267ms</p>
          <p className="text-xs text-green-600 mt-2">↓ 12ms from last week</p>
        </Card>
      </div>

      {/* Delivery Rate */}
      <Card className="p-6 border border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-6">Delivery Rate & Latency</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={healthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
            <YAxis yAxisId="left" stroke="var(--color-muted-foreground)" />
            <YAxis yAxisId="right" orientation="right" stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="deliveryRate"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981' }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="latency"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SDK Versions */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-6">SDK Version Distribution</h2>
          <div className="space-y-4">
            {versionStats.map((version) => (
              <div key={version.version}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">{version.version}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-foreground">
                      {version.count.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">({version.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-secondary/50 rounded h-2">
                  <div
                    className="bg-blue-500 h-full rounded transition-all"
                    style={{ width: `${version.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Latest version adoption: 65% (recommend updating 28% on 0.9.5)
          </p>
        </Card>

        {/* Error Rate Trend */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-6">Error Rate by Day</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={healthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                }}
              />
              <Bar dataKey="errorRate" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Error Types */}
      <Card className="border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Error Breakdown</h2>
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Error Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Count
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  % of Total
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {errorTypes.map((error) => (
                <tr
                  key={error.type}
                  className="border-b border-border hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {error.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{error.count}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{error.percentage}%</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                        error.percentage > 30
                          ? 'bg-red-500/10 text-red-600'
                          : 'bg-yellow-500/10 text-yellow-600'
                      }`}
                    >
                      {error.percentage > 30 ? 'High' : 'Monitor'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6 border border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Recommendations</h2>
        <div className="space-y-3">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded">
            <p className="text-sm font-semibold text-foreground">Update SDK versions</p>
            <p className="text-xs text-muted-foreground mt-1">
              28% of SDKs are on 0.9.5. Consider notifying users to upgrade to 1.0.0
            </p>
          </div>
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded">
            <p className="text-sm font-semibold text-foreground">API key validation</p>
            <p className="text-xs text-muted-foreground mt-1">
              30% of errors are invalid API keys. Review key rotation policies
            </p>
          </div>
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded">
            <p className="text-sm font-semibold text-foreground">Performance is healthy</p>
            <p className="text-xs text-muted-foreground mt-1">
              Delivery rate is 99.8% and latency is under 150ms average
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
