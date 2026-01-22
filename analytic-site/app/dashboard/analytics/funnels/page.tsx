"use client"
import { useState, useEffect, useCallback } from 'react';
import { Loader2, Calendar, Filter, Database, Globe, AlertCircle, ArrowDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FunnelsPage() {
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
      const response = await fetch(`/api/analytics/funnels?${params.toString()}`);
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

  const { funnelName, totalUsers, overallConversion, steps } = data;

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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Conversion Funnels</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Analyze user conversion funnels and identify drop-off points
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

      {/* Summary Card */}
      <Card className="p-4 md:p-6 border border-border bg-card relative overflow-hidden">
        {refreshing && (
          <div className="absolute inset-0 bg-background/10 backdrop-blur-[1px] z-10" />
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <div>
            <p className="text-muted-foreground text-xs md:text-sm mb-1">Funnel Name</p>
            <p className="text-lg md:text-2xl font-bold text-foreground">{funnelName}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs md:text-sm mb-1">Overall Conversion</p>
            <p className="text-lg md:text-2xl font-bold text-foreground">{overallConversion.toFixed(1)}%</p>
            <p className="hidden md:block text-xs text-muted-foreground mt-1">In selected range</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-muted-foreground text-xs md:text-sm mb-1">Total Users</p>
            <p className="text-lg md:text-2xl font-bold text-foreground">{totalUsers.toLocaleString()}</p>
            <p className="hidden md:block text-xs text-muted-foreground mt-1">Unique users in funnel</p>
          </div>
        </div>
        {refreshing && (
          <div className="absolute top-2 right-2">
            <Loader2 className="w-3 h-3 animate-spin text-primary/40" />
          </div>
        )}
      </Card>

      {/* Funnel Visualization */}
      <Card className="p-6 border border-border bg-card relative overflow-hidden">
        {refreshing && (
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        <h2 className="text-xl font-semibold text-foreground mb-8">Funnel Flow</h2>
        {totalUsers > 0 ? (
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
                      className="bg-primary h-full flex items-center justify-end pr-3 transition-all duration-500"
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
        ) : (
          <EmptyState />
        )}
      </Card>

      {/* Step Details */}
      <Card className="border border-border bg-card overflow-hidden relative">
        {refreshing && (
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
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
              {totalUsers > 0 ? (
                steps.map((step: any, index: number) => {
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
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No funnel data found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Improvement Suggestions */}
      {totalUsers > 0 && (
        <Card className="p-6 border border-border bg-card relative overflow-hidden">
          {refreshing && (
            <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] flex items-center justify-center z-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
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
          </div>
        </Card>
      )}
    </div>
  );
}
