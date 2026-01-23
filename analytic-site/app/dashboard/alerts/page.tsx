'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, Plus, Trash2, Edit2, Mail, Webhook, Bell, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const alertTriggers = [
  { value: 'high_error_rate', label: 'High Error Rate (>5%)' },
  { value: 'delivery_failure', label: 'Delivery Failure' },
  { value: 'usage_limit', label: 'Usage Limit Approaching' },
  { value: 'api_key_abuse', label: 'Potential API Key Abuse' },
  { value: 'latency_spike', label: 'Latency Spike (>500ms)' },
];

export default function AlertsPage() {
  const [showForm, setShowForm] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingAlert, setEditingAlert] = useState<any>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    fetchAlerts();
    fetchHistory(1);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !historyLoading) {
          console.log('[Alerts] Loading more history, page:', currentPage + 1);
          fetchHistory(currentPage + 1);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, historyLoading, currentPage]);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/alerts');
      const result = await response.json();
      
      if (result && result.success && result.data) {
        setAlerts(Array.isArray(result.data) ? result.data : []);
      } else if (result && !result.success) {
        setError(result.error || 'Failed to fetch alerts');
      }
    } catch (err) {
      console.error('[Alerts] Error fetching alerts:', err);
      setError('An error occurred while fetching alerts');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (page: number) => {
    if (page === 1) {
      setHistoryLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await fetch(`/api/alerts/history?page=${page}&limit=20`);
      const result = await response.json();
      
      console.log(`[Alerts] History API response (page ${page}):`, result);

      if (result && result.success && result.data) {
        const dataObj = result.data;
        
        // Handle both nested and flat response structures
        const historyItems = Array.isArray(dataObj.data) 
          ? dataObj.data 
          : (Array.isArray(dataObj) ? dataObj : []);
          
        const pagination = (dataObj && typeof dataObj === 'object' && dataObj.pagination) 
          ? dataObj.pagination 
          : { hasMore: false };

        console.log(`[Alerts] Processed ${historyItems.length} items, hasMore: ${pagination.hasMore}`);

        if (page === 1) {
          setHistory(historyItems);
        } else {
          setHistory(prev => {
            const currentHistory = Array.isArray(prev) ? prev : [];
            return [...currentHistory, ...historyItems];
          });
        }
        
        setCurrentPage(page);
        setHasMore(!!pagination.hasMore);
      } else {
        console.warn('[Alerts] History API returned unsuccessful result:', result);
        if (page === 1) setHistory([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error('[Alerts] Failed to fetch alert history:', err);
      if (page === 1) setHistory([]);
    } finally {
      setHistoryLoading(false);
      setLoadingMore(false);
    }
  };

  const handleCreateOrUpdateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const alertData = {
      name: formData.get('alertName'),
      type: formData.get('alertType'),
      target: formData.get('alertTarget'),
      triggers: Array.from(formData.getAll('triggers')),
    };

    try {
      const url = '/api/alerts';
      const method = editingAlert ? 'PATCH' : 'POST';
      const body = editingAlert ? { ...alertData, id: editingAlert._id } : alertData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const result = await response.json();
      if (result.success) {
        if (editingAlert) {
          setAlerts(alerts.map(a => a._id === editingAlert._id ? { ...a, ...alertData } : a));
        } else {
          setAlerts([...alerts, { _id: result.data._id, ...alertData, enabled: true }]);
        }
        setShowForm(false);
        setEditingAlert(null);
      }
    } catch (err) {
      console.error('[Alerts] Error saving alert:', err);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (!confirm('Are you sure you want to delete this alert?')) return;

    try {
      const response = await fetch(`/api/alerts?id=${alertId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setAlerts(alerts.filter(a => a._id !== alertId));
      }
    } catch (err) {
      console.error('[Alerts] Error deleting alert:', err);
    }
  };

  const handleEditAlert = (alert: any) => {
    setEditingAlert(alert);
    setShowForm(true);
  };

  const formatTimeAgo = (date: string) => {
    if (!date) return 'Unknown';
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (isNaN(seconds)) return 'Invalid date';
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const getTriggerLabel = (value: string) => {
    return alertTriggers.find(t => t.value === value)?.label || value;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Alerts
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Configure notifications and webhooks for important events
          </p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingAlert(null);
          }}
          className="gap-2 w-full md:w-auto"
        >
          Create Alert
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingAlert ? "Edit Alert" : "Create New Alert"}
            </DialogTitle>
            <DialogDescription>
              Configure your alert settings below. You'll receive notifications
              when triggers are met.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateOrUpdateAlert} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="alertName">Alert Name</Label>
              <Input
                id="alertName"
                name="alertName"
                placeholder="e.g., High Error Rate"
                defaultValue={editingAlert?.name || ""}
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="alertType">Notification Type</Label>
              <Select
                name="alertType"
                defaultValue={editingAlert?.type || "email"}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="alertTarget">Target (Email or URL)</Label>
              <Input
                id="alertTarget"
                name="alertTarget"
                placeholder="email@example.com or https://example.com/webhook"
                defaultValue={editingAlert?.target || ""}
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="mb-2 block">Triggers</Label>
              <div className="space-y-3 border rounded-md p-3">
                {alertTriggers.map((trigger) => (
                  <label
                    key={trigger.value}
                    className="flex items-center gap-3 cursor-pointer hover:bg-secondary/50 p-1.5 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      name="triggers"
                      value={trigger.value}
                      defaultChecked={editingAlert?.triggers?.includes(
                        trigger.value,
                      )}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-foreground">
                      {trigger.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingAlert(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingAlert ? "Update Alert" : "Create Alert"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <Card className="p-12 text-center border border-border bg-card">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              No alerts configured. Create your first alert to get started.
            </p>
          </Card>
        ) : (
          alerts.map((alert) => {
            const Icon = alert.type === "email" ? Mail : Webhook;
            return (
              <Card
                key={alert._id}
                className="p-4 md:p-6 border border-border bg-card"
              >
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="flex items-start gap-3 md:gap-4 flex-1">
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                      <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-base md:text-lg font-semibold text-foreground">
                          {alert.name}
                        </h3>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-600 shrink-0">
                          Active
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-3 break-all">
                        {alert.type === "email" ? "Email to " : "Webhook to "}
                        <span className="font-mono text-foreground">
                          {alert.target}
                        </span>
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {alert.triggers.map((trigger: string) => (
                          <span
                            key={trigger}
                            className="px-2 py-1 rounded text-xs bg-blue-500/10 text-blue-600"
                          >
                            {getTriggerLabel(trigger)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 flex-1 md:flex-initial"
                      onClick={() => handleEditAlert(alert)}
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="md:hidden">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-destructive flex-1 md:flex-initial"
                      onClick={() => handleDeleteAlert(alert._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="md:hidden">Delete</span>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Alert History with Infinite Scroll */}
      <Card className="border border-border bg-card overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border">
          <h2 className="text-lg md:text-xl font-semibold text-foreground">
            Alert History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-foreground">
                  Alert
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-foreground">
                  Trigger
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-foreground">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {historyLoading && history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                    <p className="text-muted-foreground text-sm">
                      No alert history yet. Alerts will appear here when
                      triggered.
                    </p>
                  </td>
                </tr>
              ) : (
                <>
                  {history.map((item, index) => (
                    <tr
                      key={`${item._id}-${index}`}
                      className="border-b border-border hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm font-medium text-foreground">
                        {item.alertName}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-foreground">
                        {getTriggerLabel(item.trigger)}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            item.status === "sent"
                              ? "bg-green-500/10 text-green-600"
                              : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {item.status === "sent" ? "Sent" : "Failed"}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-muted-foreground">
                        {formatTimeAgo(item.sentAt)}
                      </td>
                    </tr>
                  ))}
                  {hasMore && !loadingMore && (
                    <tr ref={observerTarget}>
                      <td colSpan={4} className="h-1 text-center">
                        <div className="py-2">
                          <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto opacity-20" />
                        </div>
                      </td>
                    </tr>
                  )}
                  {loadingMore && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center">
                        <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" />
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
