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
import { Calendar, Filter, TrendingUp } from 'lucide-react';

const userGrowthData = [
  { date: 'Jan 1', newUsers: 45, activeUsers: 320, returning: 275 },
  { date: 'Jan 2', newUsers: 52, activeUsers: 372, returning: 320 },
  { date: 'Jan 3', newUsers: 38, activeUsers: 410, returning: 372 },
  { date: 'Jan 4', newUsers: 61, activeUsers: 471, returning: 410 },
  { date: 'Jan 5', newUsers: 48, activeUsers: 519, returning: 471 },
  { date: 'Jan 6', newUsers: 55, activeUsers: 574, returning: 519 },
  { date: 'Jan 7', newUsers: 50, activeUsers: 624, returning: 574 },
];

const userSegments = [
  { segment: 'Power Users', count: 342, percentage: 34.2, trend: '+12.5%' },
  { segment: 'Regular Users', count: 445, percentage: 44.5, trend: '+8.3%' },
  { segment: 'Dormant Users', count: 156, percentage: 15.6, trend: '-2.1%' },
  { segment: 'One-time Users', count: 57, percentage: 5.7, trend: '+1.2%' },
];

const deviceData = [
  { device: 'Desktop', users: 542, percentage: 54.2 },
  { device: 'Mobile', users: 385, percentage: 38.5 },
  { device: 'Tablet', users: 73, percentage: 7.3 },
];

export default function UsersPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">User Analytics</h1>
          <p className="text-muted-foreground">
            Understand user behavior and demographics
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
          <p className="text-muted-foreground text-sm mb-1">Total Users</p>
          <p className="text-3xl font-bold text-foreground">1,000</p>
          <p className="text-xs text-green-600 mt-2">+18.2% this week</p>
        </Card>
        <Card className="p-4 border border-border bg-card">
          <p className="text-muted-foreground text-sm mb-1">New Users</p>
          <p className="text-3xl font-bold text-foreground">349</p>
          <p className="text-xs text-green-600 mt-2">+12.5% from last week</p>
        </Card>
        <Card className="p-4 border border-border bg-card">
          <p className="text-muted-foreground text-sm mb-1">Active Users (7d)</p>
          <p className="text-3xl font-bold text-foreground">624</p>
          <p className="text-xs text-green-600 mt-2">+8.3% from last week</p>
        </Card>
        <Card className="p-4 border border-border bg-card">
          <p className="text-muted-foreground text-sm mb-1">Returning Users</p>
          <p className="text-3xl font-bold text-foreground">574</p>
          <p className="text-xs text-blue-600 mt-2">92% of active users</p>
        </Card>
      </div>

      {/* User Growth */}
      <Card className="p-6 border border-border bg-card">
        <h2 className="text-xl font-semibold text-foreground mb-6">User Growth</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={userGrowthData}>
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
              dataKey="activeUsers"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6' }}
            />
            <Line
              type="monotone"
              dataKey="newUsers"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981' }}
            />
            <Line
              type="monotone"
              dataKey="returning"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-6">Device Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deviceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="device" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                }}
              />
              <Bar dataKey="users" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Cohort Analysis Preview */}
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-6">Cohort Analysis</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded">
              <span className="text-sm font-medium">Week of Jan 1</span>
              <span className="text-sm font-bold">245 users</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded">
              <span className="text-sm font-medium">Week of Jan 8</span>
              <span className="text-sm font-bold">187 users</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded">
              <span className="text-sm font-medium">Week of Jan 15</span>
              <span className="text-sm font-bold">156 users</span>
            </div>
          </div>
        </Card>
      </div>

      {/* User Segments */}
      <Card className="border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">User Segments</h2>
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Segment
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Users
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
              {userSegments.map((segment) => (
                <tr
                  key={segment.segment}
                  className="border-b border-border hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {segment.segment}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{segment.count}</td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {segment.percentage.toFixed(1)}%
                  </td>
                  <td className={`px-6 py-4 text-sm font-medium ${segment.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {segment.trend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
