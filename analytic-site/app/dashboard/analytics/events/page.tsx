"use client"
import { useState, useEffect, useCallback } from 'react';
import { Loader2, Calendar, Filter, Database, Globe, AlertCircle } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EventsPage() {
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
      const response = await fetch(`/api/analytics/events?${params.toString()}`);
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

  const { metrics, eventsOverTime, topEvents, eventsByEnvironment } = data;
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Event Analytics</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Track and analyze user events across your application
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
          { label: 'Total Events', value: metrics.totalEvents.toLocaleString(), sub: 'In selected range' },
          { label: 'Events/Day Avg', value: metrics.avgEventsPerDay.toLocaleString(), sub: 'Based on range' },
          { label: 'Unique Events', value: metrics.uniqueEventTypes, sub: 'Event types tracked' },
          { label: 'Errors', value: metrics.errorCount, sub: `${metrics.errorRate.toFixed(1)}% error rate`, subClass: 'text-red-600' }
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

      {/* Events Over Time */}
      <Card className="p-4 md:p-6 border border-border bg-card relative overflow-hidden">
        {refreshing && (
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6">Events Over Time</h2>
        <div className="h-[300px] md:h-[400px] w-full">
          {eventsOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={eventsOverTime}>
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
                  dataKey="events"
                  name="Total Events"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="pageViews"
                  name="Page Views"
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
        {/* Top Events */}
        <Card className="p-4 md:p-6 border border-border bg-card relative overflow-hidden">
          {refreshing && (
            <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6">Top Events</h2>
          <div className="h-[250px] md:h-[300px] w-full">
            {topEvents.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topEvents} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="var(--color-muted-foreground)" fontSize={12} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" name="Count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </div>
        </Card>

        {/* Events by Environment */}
        <Card className="p-4 md:p-6 border border-border bg-card relative overflow-hidden">
          {refreshing && (
            <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6">
            Events by Environment
          </h2>
          <div className="h-[250px] md:h-[300px] w-full">
            {eventsByEnvironment.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventsByEnvironment}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
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
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </div>
        </Card>
      </div>

      {/* Event Breakdown Table */}
      <Card className="border border-border bg-card overflow-hidden relative">
        {refreshing && (
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
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
              {topEvents.length > 0 ? (
                topEvents.map((event: any) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No events found for the selected filters.
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
