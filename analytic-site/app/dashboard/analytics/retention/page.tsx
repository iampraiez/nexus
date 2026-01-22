"use client"
import { useState, useEffect, useCallback } from 'react';
import { Loader2, Calendar, Filter, Database, Globe, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RetentionPage() {
  const [data, setData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [range, setRange] = useState('30d');
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
      const response = await fetch(`/api/analytics/retention?${params.toString()}`);
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

  const { cohorts, keyMetrics } = data;

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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Retention Analysis</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Monitor user retention metrics and cohort behavior
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {keyMetrics.map((metric: any) => (
          <Card key={metric.label} className="p-3 md:p-4 border border-border bg-card relative overflow-hidden">
            {refreshing && (
              <div className="absolute inset-0 bg-background/10 backdrop-blur-[1px] z-10" />
            )}
            <p className="text-muted-foreground text-xs md:text-sm mb-1">{metric.label}</p>
            <p className="text-xl md:text-3xl font-bold text-foreground">{metric.value}</p>
            <p className="hidden md:block text-xs text-muted-foreground mt-2">{metric.description}</p>
            {refreshing && (
              <div className="absolute top-2 right-2">
                <Loader2 className="w-3 h-3 animate-spin text-primary/40" />
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Retention Table */}
      <Card className="border border-border bg-card overflow-hidden relative">
        {refreshing && (
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
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
              {cohorts.some((c: any) => c.users > 0) ? (
                cohorts.map((row: any) => (
                  <tr key={row.cohort} className="border-b border-border hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{row.cohort}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{row.users.toLocaleString()}</td>
                    {[row.day1, row.day7, row.day14, row.day30].map((val, i) => {
                      const percentage = val !== null && row.users > 0 ? (val / row.users) * 100 : null;
                      const opacity = percentage !== null ? Math.max(0.1, percentage / 100) : 0;
                      
                      return (
                        <td key={i} className="px-2 py-4 text-center">
                          {percentage !== null ? (
                            <div 
                              className="py-2 rounded text-xs font-bold transition-all duration-500"
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
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No retention data found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Retention Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border border-border bg-card relative overflow-hidden">
          {refreshing && (
            <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          <h2 className="text-xl font-semibold text-foreground mb-6">Day 7 Retention Trends</h2>
          {cohorts.some((c: any) => c.day7 !== null && c.users > 0) ? (
            <div className="space-y-4">
              {cohorts
                .filter((c: any) => c.day7 !== null && c.users > 0)
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
                          className="bg-blue-500 h-full rounded transition-all duration-500"
                          style={{ width: `${retention}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <EmptyState />
          )}
        </Card>

        <Card className="p-6 border border-border bg-card relative overflow-hidden">
          {refreshing && (
            <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          <h2 className="text-xl font-semibold text-foreground mb-6">Insights</h2>
          {cohorts.some((c: any) => c.users > 0) ? (
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
            </div>
          ) : (
            <EmptyState message="No insights available" />
          )}
        </Card>
      </div>
    </div>
  );
}
