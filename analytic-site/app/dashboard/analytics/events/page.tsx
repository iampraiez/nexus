"use client"
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, Filter } from 'lucide-react';

export default function EventsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/analytics/events');
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

  const { metrics, eventsOverTime, topEvents, eventsByEnvironment } = data;
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Event Analytics</h1>
          <p className="text-muted-foreground">
            Track and analyze user events across your application
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
          <p className="text-muted-foreground text-sm mb-1">Total Events</p>
          <p className="text-3xl font-bold text-foreground">{metrics.totalEvents.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">Across all projects</p>
        </Card>
        <Card className="p-4 border border-border bg-card">
          <p className="text-muted-foreground text-sm mb-1">Events/Day Avg</p>
          <p className="text-3xl font-bold text-foreground">{metrics.avgEventsPerDay.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-2">Last 7 days</p>
        </Card>
        <Card className="p-4 border border-border bg-card">
          <p className="text-muted-foreground text-sm mb-1">Unique Events</p>
          <p className="text-3xl font-bold text-foreground">{metrics.uniqueEventTypes}</p>
          <p className="text-xs text-muted-foreground mt-2">Event types tracked</p>
        </Card>
        <Card className="p-4 border border-border bg-card">
          <p className="text-muted-foreground text-sm mb-1">Errors</p>
          <p className="text-3xl font-bold text-foreground">{metrics.errorCount}</p>
          <p className="text-xs text-red-600 mt-2">{metrics.errorRate.toFixed(1)}% error rate</p>
        </Card>
      </div>

      {/* Events Over Time */}
      <Card className="p-6 border border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-6">Events Over Time</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={eventsOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="events"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6' }}
            />
            <Line
              type="monotone"
              dataKey="pageViews"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Events */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-6">Top Events</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topEvents}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Events by Environment */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Events by Environment
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={eventsByEnvironment}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="events"
              >
                {eventsByEnvironment.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Event Breakdown Table */}
      <Card className="border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Event Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Event Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Count
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  % of Total
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {topEvents.map((event: any) => (
                <tr
                  key={event.name}
                  className="border-b border-border hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {event.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{event.value.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {((event.value / metrics.totalEvents) * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
