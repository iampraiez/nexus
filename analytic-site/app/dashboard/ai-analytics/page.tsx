'use client';

import { useState, useEffect } from 'react';
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

export default function AIAnalyticsPage() {
  const { company } = useDashboard();
  const [period, setPeriod] = useState('weekly');
  const [generating, setGenerating] = useState(false);
  const [currentReport, setCurrentReport] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
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
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period }),
      });
      const data = await res.json();
      
      if (data.success) {
        const newReport = {
          content: data.data.report,
          generatedAt: data.data.generatedAt,
          period,
          _id: 'temp-' + Date.now() // Temp ID until refresh
        };
        setCurrentReport(newReport);
        if (data.data.dataAvailable) {
          fetchHistory(); // Refresh list to get real ID
        }
      }
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!currentReport) return;
    const blob = new Blob([currentReport.content], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-report-${new Date(currentReport.generatedAt).toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-6 overflow-hidden">
      {/* Sidebar / History */}
      <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-4 overflow-hidden">
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Insights
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Powered by Gemini 2.0 Flash
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
                  onClick={() => setCurrentReport(report)}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-colors border ${
                    currentReport?._id === report._id
                      ? 'bg-primary/10 border-primary/20 text-foreground'
                      : 'hover:bg-secondary/50 border-transparent text-muted-foreground'
                  }`}
                >
                  <div className="font-medium capitalize">{report.period} Report</div>
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(report.generatedAt).toLocaleDateString()} • {new Date(report.generatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
        <Card className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-border bg-card flex-shrink-0">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Period:
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px]">
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
                    {currentReport.period.charAt(0).toUpperCase() + currentReport.period.slice(1)} Analysis
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Generated on {new Date(currentReport.generatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="hidden sm:inline">Email</span>
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                  <ReactMarkdown>{currentReport.content}</ReactMarkdown>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
              <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No Report Selected</h3>
              <p className="text-center max-w-sm">
                Select a report from the history or generate a new one to get AI-powered insights about your data.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
