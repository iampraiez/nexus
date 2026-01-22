"use client"
import { useState, useEffect, useCallback } from 'react';
import { Loader2, Calendar, Filter, Database, Globe, AlertCircle, AlertTriangle } from 'lucide-react';
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

export default function SdkHealthPage() {
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
      const response = await fetch(`/api/analytics/sdk-health?${params.toString()}`);
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

  const { metrics, healthData, versionStats, errorTypes } = data;

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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">SDK Health</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Monitor SDK performance, delivery rates, and errors
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
          { label: 'Delivery Rate', value: `${metrics.deliveryRate}%`, sub: 'Target: 99.9%', subClass: 'text-green-600' },
          { label: 'Error Rate', value: `${metrics.errorRate}%`, sub: 'Healthy', subClass: 'text-green-600' },
          { label: 'Avg Latency', value: `${metrics.avgLatency}ms`, sub: 'Healthy', subClass: 'text-green-600' },
          { label: 'p95 Latency', value: `${metrics.p95Latency}ms`, sub: 'Healthy', subClass: 'text-green-600' }
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

      {/* Delivery Rate */}
      <Card className="p-4 md:p-6 border border-border bg-card relative overflow-hidden">
        {refreshing && (
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6">Delivery Rate & Latency</h2>
        <div className="h-[300px] md:h-[400px] w-full">
          {healthData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--color-muted-foreground)" 
                  fontSize={12} 
                  tickFormatter={(val) => range === '24h' ? val.split(' ')[1] : val}
                />
                <YAxis yAxisId="left" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="deliveryRate"
                  name="Delivery Rate"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="latency"
                  name="Latency (ms)"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState />
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SDK Versions */}
        <Card className="p-6 border border-border bg-card relative overflow-hidden">
          {refreshing && (
            <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          <h2 className="text-xl font-semibold text-foreground mb-6">SDK Version Distribution</h2>
          {versionStats.length > 0 ? (
            <div className="space-y-4">
              {versionStats.map((version: any) => (
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
                      className="bg-blue-500 h-full rounded transition-all duration-500"
                      style={{ width: `${version.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-4">
                Latest version adoption: 65% (recommend updating 28% on 0.9.5)
              </p>
            </div>
          ) : (
            <EmptyState />
          )}
        </Card>

        {/* Error Rate Trend */}
        <Card className="p-6 border border-border bg-card relative overflow-hidden">
          {refreshing && (
            <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          <h2 className="text-xl font-semibold text-foreground mb-6">Error Rate by Day</h2>
          <div className="h-[300px] w-full">
            {healthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--color-muted-foreground)" 
                    tickFormatter={(val) => range === '24h' ? val.split(' ')[1] : val}
                  />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="errorRate" name="Error Rate (%)" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </div>
        </Card>
      </div>

      {/* Error Types */}
      <Card className="border border-border bg-card overflow-hidden relative">
        {refreshing && (
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
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
              {errorTypes.length > 0 ? (
                errorTypes.map((error: any) => (
                  <tr
                    key={error.type}
                    className="border-b border-border hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {error.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{error.count}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{error.percentage.toFixed(1)}%</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No errors found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recommendations */}
      {healthData.length > 0 && (
        <Card className="p-6 border border-border bg-card relative overflow-hidden">
          {refreshing && (
            <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          <h2 className="text-xl font-semibold text-foreground mb-4">Recommendations</h2>
          <div className="space-y-3">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded">
              <p className="text-sm font-semibold text-foreground">Update SDK versions</p>
              <p className="text-xs text-muted-foreground mt-1">
                Some users are still on older versions. Consider notifying them to upgrade to 1.1.4
              </p>
            </div>
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded">
              <p className="text-sm font-semibold text-foreground">Performance is healthy</p>
              <p className="text-xs text-muted-foreground mt-1">
                Delivery rate is {metrics.deliveryRate}% and latency is under 150ms average
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
