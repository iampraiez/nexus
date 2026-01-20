'use client';

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
import {
  Settings,
  Key,
  Users,
  Shield,
  Download,
  Copy,
  RefreshCw,
  Trash2,
  Mail,
} from 'lucide-react';

const apiKeys = [
  {
    id: 'key_1',
    name: 'Production SDK',
    key: 'pk_live_****9a7b2',
    created: 'Dec 15, 2024',
    lastUsed: 'Jan 20, 2025',
  },
  {
    id: 'key_2',
    name: 'Development',
    key: 'pk_test_****3c1d5',
    created: 'Dec 1, 2024',
    lastUsed: 'Jan 19, 2025',
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'api' | 'team' | 'security' | 'email'>(
    'general'
  );
  const [copied, setCopied] = useState(false);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application settings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'general'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Settings className="w-4 h-4 inline mr-2" />
          General
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'api'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Key className="w-4 h-4 inline mr-2" />
          API Keys
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'team'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Team
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'security'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Shield className="w-4 h-4 inline mr-2" />
          Security
        </button>
        <button
          onClick={() => setActiveTab('email')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'email'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Mail className="w-4 h-4 inline mr-2" />
          Email
        </button>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <Card className="p-6 border border-border bg-card space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Company Information
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  defaultValue="Acme Inc."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="companyEmail">Email</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  defaultValue="admin@acme.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">EST</SelectItem>
                    <SelectItem value="pst">PST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Save Changes</Button>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Data & Privacy
            </h3>
            <div className="space-y-4">
              <div>
                <Label>Event Retention</Label>
                <Select defaultValue="365">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">365 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export All Data
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* API Keys */}
      {activeTab === 'api' && (
        <Card className="p-6 border border-border bg-card space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">API Keys</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Use API keys to authenticate requests to our SDK and API.
            </p>
          </div>

          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="p-4 border border-border rounded-lg bg-secondary/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{apiKey.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created on {apiKey.created}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyKey(apiKey.key)}
                      title="Copy API key"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-secondary/50 rounded font-mono text-sm">
                  {apiKey.key}
                  {copied && (
                    <span className="text-xs text-green-600 ml-auto">Copied!</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Last used: {apiKey.lastUsed}
                </p>
              </div>
            ))}
          </div>

          <Button>Create New API Key</Button>
        </Card>
      )}

      {/* Team Settings */}
      {activeTab === 'team' && (
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Team Members</h2>
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium text-foreground">you@acme.com</p>
                <p className="text-xs text-muted-foreground">Owner</p>
              </div>
              <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                Admin
              </span>
            </div>
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium text-foreground">team@acme.com</p>
                <p className="text-xs text-muted-foreground">Member</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  Remove
                </Button>
              </div>
            </div>
          </div>
          <Button>Invite Team Member</Button>
        </Card>
      )}

      {/* Email Settings */}
      {activeTab === 'email' && (
        <Card className="p-6 border border-border bg-card space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Email Configuration
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Configure SendGrid to send email notifications for alerts and reports
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="senderEmail">Sender Email</Label>
              <Input
                id="senderEmail"
                type="email"
                placeholder="noreply@your-domain.com"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The email address that will be used to send notifications
              </p>
            </div>

            <div>
              <Label htmlFor="senderName">Sender Name</Label>
              <Input
                id="senderName"
                placeholder="Nexus Alerts"
                className="mt-1"
                defaultValue="Nexus Analytics"
              />
            </div>

            <div>
              <Label>Email Notification Preferences</Label>
              <div className="space-y-3 mt-3">
                <div className="flex items-center gap-3 p-3 rounded border border-border bg-secondary/20">
                  <input type="checkbox" id="alertEmails" defaultChecked className="w-4 h-4" />
                  <label htmlFor="alertEmails" className="flex-1 cursor-pointer">
                    <p className="font-medium text-sm text-foreground">Alert Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive alerts when thresholds are exceeded</p>
                  </label>
                </div>
                <div className="flex items-center gap-3 p-3 rounded border border-border bg-secondary/20">
                  <input type="checkbox" id="reportEmails" defaultChecked className="w-4 h-4" />
                  <label htmlFor="reportEmails" className="flex-1 cursor-pointer">
                    <p className="font-medium text-sm text-foreground">Weekly Reports</p>
                    <p className="text-xs text-muted-foreground">Get a summary of your analytics every week</p>
                  </label>
                </div>
                <div className="flex items-center gap-3 p-3 rounded border border-border bg-secondary/20">
                  <input type="checkbox" id="productEmails" className="w-4 h-4" />
                  <label htmlFor="productEmails" className="flex-1 cursor-pointer">
                    <p className="font-medium text-sm text-foreground">Product Updates</p>
                    <p className="text-xs text-muted-foreground">Be notified about new features and improvements</p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button>Save Email Settings</Button>
            <p className="text-xs text-muted-foreground">
              Make sure to verify your sender email in SendGrid before sending emails
            </p>
          </div>
        </Card>
      )}

      {/* Security */}
      {activeTab === 'security' && (
        <Card className="p-6 border border-border bg-card space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Two-Factor Authentication
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              Add an extra layer of security to your account
            </p>
            <Button>Enable 2FA</Button>
          </div>

          <div className="pt-6 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Session Management
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Chrome on macOS
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Active • Last seen today
                  </p>
                </div>
                <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">
                  Current
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Safari on iPhone
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Active • Last seen 2 days ago
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Account Deletion
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Permanently delete your account and all associated data
            </p>
            <Button variant="outline" className="text-destructive bg-transparent">
              Delete Account
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
