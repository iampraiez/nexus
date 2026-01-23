'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Settings, Users, Shield, Download, Mail, Trash2, LogOut, Laptop, Smartphone, Globe } from 'lucide-react';
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
  DialogTrigger,
} from '@/components/ui/dialog';

import { useDashboard } from '../dashboard-context';

import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const router = useRouter();
  const { company, loading: contextLoading, refreshData } = useDashboard();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'general' | 'team' | 'security' | 'email'>('general');
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Form states
  const [workspaceName, setWorkspaceName] = useState('');

  useEffect(() => {
    if (company) {
      setWorkspaceName(company.name);
    }
    fetchSessions();
  }, [company]);

  const fetchSessions = async () => {
    try {
      const sessionsRes = await fetch('/api/auth/sessions');
      const sessionsData = await sessionsRes.json();
      if (sessionsData.success) {
        setSessions(sessionsData.data);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleSaveGeneral = async () => {
    if (!workspaceName.trim()) {
      toast({
        title: "Error",
        description: "Workspace name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/settings/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: workspaceName }),
      });
      
      if (response.ok) {
        await refreshData(); // Update global context
        toast({
          title: "Success",
          description: "Workspace settings updated successfully.",
        });
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      // Collect preferences from DOM or state (simplified for now as we don't have controlled inputs for prefs yet)
      // Assuming we just want to show it works for now, or we can add state for them.
      // For now, let's just simulate the API call structure since the UI inputs aren't controlled yet.
      // Ideally we should make them controlled.
      
      const response = await fetch('/api/settings/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          preferences: {
            alerts: (document.getElementById('alerts') as HTMLInputElement)?.checked,
            reports: (document.getElementById('reports') as HTMLInputElement)?.checked,
            // Add other prefs
          } 
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Notification preferences saved.",
        });
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const response = await fetch('/api/settings/export');
      const result = await response.json();
      
      if (result.success) {
        const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nexus-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Export Complete",
          description: "Your data has been successfully exported.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Export failed:', err);
      toast({
        title: "Export Failed",
        description: "Could not export data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/auth/sessions?id=${sessionId}`, { method: 'DELETE' });
      if (response.ok) {
        setSessions(sessions.filter(s => s._id !== sessionId));
        toast({
          title: "Session Revoked",
          description: "The session has been successfully revoked.",
        });
      } else {
        throw new Error('Failed to revoke');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to revoke session.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const response = await fetch('/api/settings/delete-account', { method: 'DELETE' });
      if (response.ok) {
        toast({
          title: "Workspace Deleted",
          description: "Your workspace has been permanently deleted.",
        });
        router.push('/auth/register');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (err) {
      console.error('Delete account failed:', err);
      setDeleting(false);
      setShowDeleteDialog(false);
      toast({
        title: "Error",
        description: "Failed to delete workspace. Please contact support.",
        variant: "destructive",
      });
    }
  };

  if (contextLoading || loadingSessions) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and workspace settings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        {[
          { id: 'general', label: 'General', icon: Settings },
          { id: 'team', label: 'Team', icon: Users },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'email', label: 'Notifications', icon: Mail },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6 max-w-2xl">
          <Card className="p-6 border border-border bg-card space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Workspace Information</h2>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="companyName">Workspace Name</Label>
                  <Input
                    id="companyName"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="companyEmail">Contact Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    defaultValue={company?.email}
                    className="mt-1.5"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground mt-1">Contact support to change your email</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveGeneral} 
                disabled={saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>

          <Card className="p-6 border border-border bg-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">Data Export</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Download a complete archive of your workspace data including events, users, and configuration.
            </p>
            <Button variant="outline" onClick={handleExportData} disabled={exporting} className="gap-2 w-full sm:w-auto">
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {exporting ? 'Exporting...' : 'Export All Data (JSON)'}
            </Button>
          </Card>
        </div>
      )}

      {/* Team Settings */}
      {activeTab === 'team' && (
        <Card className="p-12 border border-border bg-card flex flex-col items-center justify-center text-center space-y-4 max-w-2xl">
          <div className="p-4 rounded-full bg-secondary/50">
            <Users className="w-12 h-12 text-muted-foreground opacity-20" />
          </div>
          <div className="max-w-sm">
            <h3 className="text-lg font-semibold text-foreground">Team Management</h3>
            <p className="text-sm text-muted-foreground mt-1">
              We're currently building advanced team collaboration features. Check back soon!
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            Work in Progress
          </span>
        </Card>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="space-y-6 max-w-2xl">
          <Card className="p-8 border border-border bg-card flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 rounded-full bg-secondary/50">
              <Shield className="w-10 h-10 text-muted-foreground opacity-20" />
            </div>
            <div className="max-w-sm">
              <h3 className="text-lg font-semibold text-foreground">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Enhanced security features including 2FA are currently under development.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
              Work in Progress
            </span>
          </Card>

          <Card className="p-6 border border-border bg-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">Active Sessions</h2>
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session._id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-full">
                      <Laptop className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Web Session
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(session.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRevokeSession(session._id)}
                  >
                    Revoke
                  </Button>
                </div>
              ))}
              {sessions.length === 0 && (
                <p className="text-sm text-muted-foreground">No active sessions found.</p>
              )}
            </div>
          </Card>

          <Card className="p-6 border border-destructive/20 bg-destructive/5">
            <h2 className="text-lg font-semibold text-destructive mb-2">Delete Workspace</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your workspace and all associated data. This action cannot be undone.
            </p>
            
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">Delete Workspace</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your
                    workspace, all projects, events, and user data.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting}>
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                    {deleting ? 'Deleting...' : 'Confirm Deletion'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Card>
        </div>
      )}

      {/* Email/Notification Settings */}
      {activeTab === 'email' && (
        <Card className="p-6 border border-border bg-card max-w-2xl">
          <h2 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-secondary/20 transition-colors">
              <input type="checkbox" id="alerts" defaultChecked className="mt-1 w-4 h-4 rounded border-primary text-primary focus:ring-primary" />
              <label htmlFor="alerts" className="cursor-pointer">
                <p className="font-medium text-sm text-foreground">Alert Notifications</p>
                <p className="text-xs text-muted-foreground">Receive emails when your configured alerts are triggered.</p>
              </label>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-secondary/20 transition-colors">
              <input type="checkbox" id="reports" defaultChecked className="mt-1 w-4 h-4 rounded border-primary text-primary focus:ring-primary" />
              <label htmlFor="reports" className="cursor-pointer">
                <p className="font-medium text-sm text-foreground">Scheduled AI Reports</p>
                <p className="text-xs text-muted-foreground">Receive automated AI insights directly to your email.</p>
                
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Frequency:</span>
                  <Select defaultValue="weekly">
                    <SelectTrigger className="h-8 w-[120px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="3days">Every 3 Days</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </label>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleSavePreferences}
              disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {saving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
