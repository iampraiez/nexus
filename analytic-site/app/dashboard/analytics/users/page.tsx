"use client"
import { useState, useEffect, useCallback } from 'react';
import { Loader2, Calendar, Filter, Database, Globe, AlertCircle, TrendingUp } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UsersPage() {
  const [data, setData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [range, setRange] = useState('7d');
  const [projectId, setProjectId] = useState('all');
  const [environment, setEnvironment] = useState('all');

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const result = await response.json();
      if (result.success) {
        setProjects(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const fetchData = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    else setRefreshing(true);
    
    try {
      const params = new URLSearchParams({
        range,
        projectId,
        environment
      });
      const response = await fetch(`/api/analytics/users?${params.toString()}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [range, projectId, environment]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

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
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => fetchData(true)}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const { metrics, userGrowth, deviceData, userSegments } = data;

  const EmptyState = ({ message = "No data available for the selected filters" }) => (
    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
      <AlertCircle className="w-12 h-12 text-muted-foreground/30 mb-4" />
      <p className="text-muted-foreground font-medium">{message}</p>
      <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or range</p>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">User Analytics</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Understand user behavior and demographics
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {/* Project Filter */}
          <Select value={projectId} onValueChange={setProjectId} disabled={refreshing}>
            <SelectTrigger className="w-full md:w-[180px] bg-card border-border">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="All Projects" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Environment Filter */}
          <Select value={environment} onValueChange={setEnvironment} disabled={refreshing}>
            <SelectTrigger className="w-full md:w-[160px] bg-card border-border">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Environment" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Environments</SelectItem>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="development">Development</SelectItem>
            </SelectContent>
          </Select>

          {/* Range Filter */}
          <Select value={range} onValueChange={setRange} disabled={refreshing}>
            <SelectTrigger className="w-full md:w-[140px] bg-card border-border">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Range" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: 'Total Users', value: metrics.totalUsers.toLocaleString(), sub: 'All time' },
          { label: 'New Users', value: metrics.newUsers.toLocaleString(), sub: 'In selected range' },
          { label: 'Active Users', value: metrics.activeUsers.toLocaleString(), sub: 'In selected range' },
          { label: 'Returning Users', value: metrics.returningUsers.toLocaleString(), sub: `${metrics.returningPercentage.toFixed(1)}% of active`, subClass: 'text-blue-600' }
        ].map((m, i) => (
          <Card key={i} className="p-3 md:p-4 border border-border bg-card relative overflow-hidden">
            {refreshing && (
              <div className="absolute inset-0 bg-background/10 backdrop-blur-[1px] z-10" />
            )}
            <p className="text-muted-foreground text-xs md:text-sm mb-1">{m.label}</p>
            <p className="text-xl md:text-3xl font-bold text-foreground">{m.value}</p>
            <p className={`hidden md:block text-xs mt-2 ${m.subClass || 'text-muted-foreground'}`}>{m.sub}</p>
            {refreshing && (
              <div className="absolute top-2 right-2">
                <Loader2 className="w-3 h-3 animate-spin text-primary/40" />
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* User Growth */}
      <Card className="p-4 md:p-6 border border-border bg-card relative overflow-hidden">
        {refreshing && (
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6">User Growth</h2>
        <div className="h-[300px] md:h-[400px] w-full">
          {userGrowth.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--color-muted-foreground)" 
                  fontSize={12} 
                  tickFormatter={(val) => range === '24h' ? val.split(' ')[1] : val}
                />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  name="Active Users"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  name="New Users"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState />
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Device Breakdown */}
        <Card className="p-4 md:p-6 border border-border bg-card relative overflow-hidden">
          {refreshing && (
            <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6">Device Breakdown</h2>
          <div className="h-[250px] md:h-[300px] w-full">
            {deviceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="device" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="users" name="Users" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </div>
        </Card>

        {/* Cohort Analysis Preview */}
        <Card className="p-4 md:p-6 border border-border bg-card relative overflow-hidden">
          {refreshing && (
            <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6">Cohort Analysis</h2>
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center justify-between p-2 md:p-3 bg-secondary/30 rounded">
              <span className="text-xs md:text-sm font-medium">Week of Jan 1</span>
              <span className="text-xs md:text-sm font-bold">245 users</span>
            </div>
            <div className="flex items-center justify-between p-2 md:p-3 bg-secondary/30 rounded">
              <span className="text-xs md:text-sm font-medium">Week of Jan 8</span>
              <span className="text-xs md:text-sm font-bold">187 users</span>
            </div>
            <div className="flex items-center justify-between p-2 md:p-3 bg-secondary/30 rounded">
              <span className="text-xs md:text-sm font-medium">Week of Jan 15</span>
              <span className="text-xs md:text-sm font-bold">156 users</span>
            </div>
          </div>
        </Card>
      </div>

      {/* User Segments */}
      <Card className="border border-border bg-card overflow-hidden relative">
        {refreshing && (
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
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
              {userSegments.length > 0 ? (
                userSegments.map((segment: any) => (
                  <tr
                    key={segment.segment}
                    className="border-b border-border hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {segment.segment}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{segment.count.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {segment.percentage.toFixed(1)}%
                    </td>
                    <td className={`px-6 py-4 text-sm font-medium ${segment.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {segment.trend}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No segments found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
