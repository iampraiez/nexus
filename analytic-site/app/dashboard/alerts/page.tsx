'use client';

import React from "react"

import { useState } from 'react';
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
import { Plus, Trash2, Edit2, Mail, Webhook, Bell, AlertTriangle } from 'lucide-react';

const alertTriggers = [
  { value: 'high_error_rate', label: 'High Error Rate (>5%)' },
  { value: 'delivery_failure', label: 'Delivery Failure' },
  { value: 'usage_limit', label: 'Usage Limit Approaching' },
  { value: 'api_key_abuse', label: 'Potential API Key Abuse' },
];

export default function AlertsPage() {
  const [showForm, setShowForm] = useState(false);
  const [alerts, setAlerts] = useState([
    {
      id: '1',
      name: 'High Error Rate',
      type: 'email',
      triggers: ['high_error_rate'],
      enabled: true,
      target: 'admin@company.com',
    },
  ]);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setShowForm(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Alerts</h1>
          <p className="text-muted-foreground">
            Configure notifications and webhooks for important events
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Alert
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Create New Alert
          </h2>
          <form onSubmit={handleCreateAlert} className="space-y-4">
            <div>
              <Label htmlFor="alertName">Alert Name</Label>
              <Input
                id="alertName"
                placeholder="e.g., High Error Rate"
              />
            </div>
            <div>
              <Label htmlFor="alertType">Notification Type</Label>
              <Select>
                <SelectTrigger>
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
                placeholder="email@example.com or https://example.com/webhook"
              />
            </div>
            <div>
              <Label>Triggers</Label>
              <div className="space-y-2">
                {alertTriggers.map((trigger) => (
                  <label key={trigger.value} className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm text-foreground">{trigger.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Create Alert</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <Card className="p-6 text-center border border-border bg-card">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              No alerts configured. Create your first alert to get started.
            </p>
          </Card>
        ) : (
          alerts.map((alert) => {
            const Icon = alert.type === 'email' ? Mail : Webhook;
            return (
              <Card key={alert.id} className="p-6 border border-border bg-card">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {alert.name}
                        </h3>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-600">
                          Active
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {alert.type === 'email' ? 'Email to ' : 'Webhook to '}
                        <span className="font-mono text-foreground">{alert.target}</span>
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {alert.triggers.map((trigger) => {
                          const triggerLabel = alertTriggers.find(
                            (t) => t.value === trigger
                          )?.label;
                          return (
                            <span
                              key={trigger}
                              className="px-2 py-1 rounded text-xs bg-blue-500/10 text-blue-600"
                            >
                              {triggerLabel}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Alert History */}
      <Card className="border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Alert History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Alert
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Trigger
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-secondary/30">
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  High Error Rate
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  Error rate &gt; 5%
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-600">
                    Sent
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  2 hours ago
                </td>
              </tr>
              <tr className="border-b border-border hover:bg-secondary/30">
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  Usage Limit
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  90% of quota used
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-600">
                    Sent
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  1 day ago
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
