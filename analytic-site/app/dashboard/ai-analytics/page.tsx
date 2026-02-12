'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDashboard } from '../dashboard-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { Loader2, Sparkles, Calendar, Download, Mail, History, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from '@/hooks/use-toast';

export default function AIAnalyticsPage() {
  const { company } = useDashboard();
  const [period, setPeriod] = useState('weekly');
  const [generating, setGenerating] = useState(false);
  const [currentReport, setCurrentReport] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [pollingReportId, setPollingReportId] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/ai/generate');
      const data = await res.json();
      if (data.success) {
        setHistory(data.data);
        if (data.data.length > 0 && !currentReport) {
          setCurrentReport(data.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoadingHistory(false);
    }
  }, [currentReport]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Polling effect for pending reports
  useEffect(() => {
    if (!pollingReportId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/ai/generate");
        const data = await res.json();
        if (data.success) {
          const updatedReport = data.data.find(
            (r: any) => r._id.toString() === pollingReportId,
          );
          if (updatedReport && updatedReport.status === "completed") {
            // Report completed!
            setCurrentReport(updatedReport);
            setHistory(data.data);
            setGenerating(false);
            setPollingReportId(null);
            toast({
              title: "Report Ready!",
              description: "Your AI analytics report has been generated.",
            });
          } else if (updatedReport && updatedReport.status === "failed") {
            // Report failed
            setGenerating(false);
            setPollingReportId(null);
            toast({
              title: "Generation Failed",
              description:
                updatedReport.error ||
                "An error occurred while generating your report.",
              variant: "destructive",
            });
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000); 

    return () => clearInterval(interval);
  }, [pollingReportId, toast]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period }),
      });
      const data = await res.json();
      
      if (res.status === 429) {
        setGenerating(false);
        toast({
          title: "Daily Limit Reached",
          description: data.error || "You've used your AI credit for today. Please try again tomorrow.",
        });
        return;
      }

      if (data.success && data.data.status === 'pending') {
        // Report is being generated in background
        const pendingReport = {
          content: '',
          generatedAt: data.data.generatedAt,
          period: data.data.period,
          status: 'pending',
          _id: data.data.reportId
        };
        setCurrentReport(pendingReport);
        setPollingReportId(data.data.reportId);
        toast({
          title: "Generating Report",
          description: "Your report is being generated. This may take up to a minute.",
        });
      } else if (data.success && data.data.report) {
        // Old sync response (no data available case)
        const newReport = {
          content: data.data.report,
          generatedAt: data.data.generatedAt,
          period,
          dataAvailable: data.data.dataAvailable,
          _id: 'temp-' + Date.now()
        };
        setCurrentReport(newReport);
        setGenerating(false);
        toast({
          title: "Report Generated",
          description: "Your AI analytics report is ready.",
        });
      } else {
        throw new Error(data.error || 'Failed to generate report');
      }
    } catch (err: any) {
      console.error('Generation failed:', err);
      setGenerating(false);
      toast({
        title: "Generation Failed",
        description: err.message || "Could not generate report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!currentReport) return;
    try {
      const blob = new Blob([currentReport.content], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexus-report-${new Date(currentReport.generatedAt).toISOString().split('T')[0]}.md`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Download Started",
        description: "Your report is being downloaded.",
      });
    } catch (err) {
      toast({
        title: "Download Failed",
        description: "Could not download the report.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-6 overflow-hidden">
      {/* Sidebar / History */}
      <div className="w-full md:w-80 shrink-0 flex flex-col gap-4 overflow-hidden">
        <div className="shrink-0">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Insights
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Powered by Gemini 2.5 Flash
          </p>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden border-border bg-card">
          <div className="p-4 border-b border-border bg-secondary/10">
            <h2 className="font-semibold flex items-center gap-2">
              <History className="w-4 h-4" />
              Report History
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {loadingHistory ? (
              <div className="flex justify-center p-4">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground text-sm">
                No reports generated yet.
              </div>
            ) : (
              history.map((report) => (
                <button
                  key={report._id}
                  onClick={() => setCurrentReport(currentReport?._id === report._id ? null : report)}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-colors border ${
                    currentReport?._id === report._id
                      ? "bg-primary/10 border-primary/20 text-foreground"
                      : "hover:bg-secondary/50 border-transparent text-muted-foreground"
                  }`}
                >
                  <div className="font-medium capitalize flex items-center gap-2">
                    {report.period} Report
                    {report.status === 'pending' && (
                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    )}
                    {report.status === 'failed' && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">
                        Failed
                      </span>
                    )}
                  </div>
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(report.generatedAt).toLocaleDateString()} •{" "}
                    {new Date(report.generatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden min-h-0">
        {/* Controls */}
        <Card className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-border bg-card shrink-0">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Period:
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-35">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-sm"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Report View */}
        <Card className="flex-1 overflow-hidden border-border bg-card flex flex-col">
          {currentReport ? (
            <>
              <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/5">
                <div>
                  <h2 className="font-semibold text-lg">
                    {currentReport.period.charAt(0).toUpperCase() +
                      currentReport.period.slice(1)}{" "}
                    Analysis
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Generated on{" "}
                    {new Date(currentReport.generatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="gap-2"
                    disabled={currentReport.status === 'pending'}
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    disabled={currentReport.status === 'pending'}
                  >
                    <Mail className="w-4 h-4" />
                    <span className="hidden sm:inline">Email</span>
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {currentReport.status === 'pending' ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Generating Report...
                    </h3>
                    <p className="text-center max-w-sm">
                      Your AI analytics report is being generated. This may take up to a minute.
                    </p>
                  </div>
                ) : (
                  <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-xl prose-h2:mt-8 prose-p:leading-relaxed prose-li:marker:text-primary">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentReport.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
              <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No Report Selected
              </h3>
              <p className="text-center max-w-sm">
                Select a report from the history or generate a new one to get
                AI-powered insights about your data.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
