'use client';

import React from "react"
import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
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
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Settings, Trash2, Copy, Key, Loader2, Search, Check, ExternalLink, Activity, BarChart3 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Project {
  _id: string;
  name: string;
  environment: string;
  createdAt: string;
}

interface ApiKey {
  _id: string;
  displayKey: string;
  isActive: boolean;
  createdAt: string;
}

import { useDashboard } from '../dashboard-context';

export default function ProjectsPage() {
  const { projects: contextProjects, loading: contextLoading, refreshData } = useDashboard();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Project State
  const [showNewProject, setShowNewProject] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [environment, setEnvironment] = useState('production');
  
  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEnv, setEditEnv] = useState('');
  
  // API Key State
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (contextProjects.length > 0) {
      setProjects(contextProjects);
      if (!selectedProject) {
        setSelectedProject(contextProjects[0]);
        loadApiKeys(contextProjects[0]._id);
      }
    }
  }, [contextProjects, selectedProject]);

  const loadProjects = useCallback(async () => {
    // If we have context data, don't re-fetch unless forced or empty
    if (contextProjects.length > 0) return;

    try {
      setLoading(true);
      await refreshData();
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  }, [contextProjects, refreshData]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  async function loadApiKeys(projectId: string) {
    try {
      const response = await fetch(`/api/projects/${projectId}/api-keys`);
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.data || []);
      }
    } catch (error) {
      console.error('Error loading API keys:', error);
    }
  }

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.environment.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!projectName.trim()) return;

    try {
      setLoading(true);
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName, environment }),
      });

      const result = await response.json();
      if (response.ok) {
        await refreshData(true); // Update global context (forced)
        setProjectName('');
        setShowNewProject(false);
        // Optimistic update or wait for context? Context update will trigger useEffect
        // But we want to select the new project.
        // Let's just set selected manually for UX speed
        setSelectedProject(result.data);
        loadApiKeys(result.data._id);
        toast({
          title: "Project created",
          description: `Project "${projectName}" has been created successfully.`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create project",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProject() {
    if (!selectedProject || !editName.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${selectedProject._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, environment: editEnv }),
      });

      const result = await response.json();
      if (response.ok) {
        await refreshData(true); // Update global context (forced)
        setProjects(projects.map(p => p._id === selectedProject._id ? result.data : p));
        setSelectedProject(result.data);
        setShowSettings(false);
        toast({
          title: "Project updated",
          description: "Project settings have been saved.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update project",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProject() {
    if (!selectedProject) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${selectedProject._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await refreshData(true); // Update global context (forced)
        const remainingProjects = projects.filter(p => p._id !== selectedProject._id);
        setProjects(remainingProjects);
        setSelectedProject(remainingProjects.length > 0 ? remainingProjects[0] : null);
        if (remainingProjects.length > 0) loadApiKeys(remainingProjects[0]._id);
        setShowSettings(false);
        toast({
          title: "Project deleted",
          description: "The project and its API keys have been removed.",
        });
      } else {
        const result = await response.json();
        toast({
          title: "Error",
          description: result.error || "Failed to delete project",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateApiKey() {
    if (!selectedProject) return;

    try {
      const response = await fetch(`/api/projects/${selectedProject._id}/api-keys`, {
        method: 'POST',
      });

      const result = await response.json();
      if (response.ok) {
        setApiKeys([result.data, ...apiKeys]);
        setNewlyGeneratedKey(result.data.key);
        toast({
          title: "API key generated",
          description: "Make sure to copy your new key now. You won't be able to see it again.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate API key",
        variant: "destructive",
      });
    }
  }

  async function handleRevokeApiKey(keyId: string) {
    if (!selectedProject) return;

    try {
      const response = await fetch(`/api/projects/${selectedProject._id}/api-keys/${keyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setApiKeys(apiKeys.filter(k => k._id !== keyId));
        toast({
          title: "Key revoked",
          description: "The API key has been permanently revoked.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke API key",
        variant: "destructive",
      });
    }
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Projects
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Create and manage API projects for event tracking
          </p>
        </div>

        <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-fit sm:w-auto">New Project</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Give your project a name and select an environment.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProject} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="e.g. My E-commerce App"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="environment">Environment</Label>
                <Select value={environment} onValueChange={setEnvironment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-9 bg-card border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Card className="border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/30">
              <h2 className="font-semibold text-foreground text-sm uppercase tracking-wider">
                Your Projects
              </h2>
            </div>
            <div className="max-h-100 overflow-y-auto divide-y divide-border custom-scrollbar">
              {filteredProjects.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  {searchQuery
                    ? "No projects match your search."
                    : "No projects yet. Create one to get started."}
                </div>
              ) : (
                filteredProjects.map((project) => (
                  <button
                    key={project._id}
                    onClick={() => {
                      setSelectedProject(project);
                      loadApiKeys(project._id);
                      setNewlyGeneratedKey(null);
                    }}
                    className={`w-full p-4 text-left transition-all group ${
                      selectedProject?._id === project._id
                        ? "bg-primary/10 border-l-4 border-primary"
                        : "hover:bg-secondary/50 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {project.name}
                      </div>
                      <div
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          project.environment === "production"
                            ? "border-green-500/30 bg-green-500/10 text-green-500"
                            : project.environment === "staging"
                              ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-500"
                              : "border-blue-500/30 bg-blue-500/10 text-blue-500"
                        }`}
                      >
                        {project.environment}
                      </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-2">
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </button>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Project Details */}
        <div className="lg:col-span-2">
          {selectedProject ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card className="p-6 border border-border bg-card relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <Activity className="w-24 h-24" />
                </div>

                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        {selectedProject.name}
                      </h2>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            selectedProject.environment === "production"
                              ? "bg-green-500"
                              : selectedProject.environment === "staging"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                          }`}
                        />
                        {selectedProject.environment}
                      </span>
                      <span>•</span>
                      <span>ID: {selectedProject._id}</span>
                    </div>
                  </div>

                  <Dialog
                    open={showSettings}
                    onOpenChange={(open) => {
                      if (open) {
                        setEditName(selectedProject.name);
                        setEditEnv(selectedProject.environment);
                      }
                      setShowSettings(open);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Project Settings</DialogTitle>
                        <DialogDescription>
                          Update your project details or delete the project.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Project Name</Label>
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Environment</Label>
                          <Select value={editEnv} onValueChange={setEditEnv}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="production">
                                Production
                              </SelectItem>
                              <SelectItem value="staging">Staging</SelectItem>
                              <SelectItem value="development">
                                Development
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <Button
                          onClick={handleUpdateProject}
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Save Changes"
                          )}
                        </Button>

                        <div className="pt-4 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-3">
                            Danger Zone: Deleting a project will permanently
                            remove all associated API keys and data.
                          </p>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                className="w-full gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Project
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the project{" "}
                                  <strong>{selectedProject.name}</strong> and
                                  all of its API keys.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteProject}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete Project
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>

              {/* API Keys Section */}
              <Card className="border border-border bg-card overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/10">
                  <div>
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Key className="w-4 h-4 text-primary" />
                      API Keys
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use these keys to authenticate your SDK requests
                    </p>
                  </div>
                  <Button
                    onClick={handleGenerateApiKey}
                    size="sm"
                    className="gap-2"
                  >
                    Generate Key
                  </Button>
                </div>

                {/* Newly Generated Key Alert */}
                {newlyGeneratedKey && (
                  <div className="p-6 bg-primary/5 border-b border-primary/20 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                      <Check className="w-4 h-4" />
                      New API Key Generated
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                      Copy this key now. For security reasons, it will not be
                      shown again.
                    </p>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-background border border-primary/30 rounded-lg p-3 font-mono text-sm text-primary break-all">
                        {newlyGeneratedKey}
                      </div>
                      <Button
                        size="icon"
                        className="h-auto px-4"
                        onClick={() => handleCopy(newlyGeneratedKey, "new")}
                      >
                        {copiedKeyId === "new" ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="divide-y divide-border">
                  {apiKeys.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground text-sm">
                      <Key className="w-8 h-8 mx-auto mb-3 opacity-20" />
                      No API keys yet. Generate one to start tracking events.
                    </div>
                  ) : (
                    apiKeys.map((key) => (
                      <div
                        key={key._id}
                        className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-secondary/20 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="font-mono text-sm text-foreground flex items-center gap-2">
                            {key.displayKey}
                            {key.isActive && (
                              <span
                                className="w-1.5 h-1.5 rounded-full bg-green-500"
                                title="Active"
                              />
                            )}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            Created on{" "}
                            {new Date(key.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex gap-2 self-end md:self-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 h-8"
                            onClick={() => handleCopy(key.displayKey, key._id)}
                          >
                            {copiedKeyId === key._id ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span className="hidden sm:inline">Copy</span>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span className="hidden sm:inline">Revoke</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Revoke API Key?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will immediately disable this API key.
                                  Any applications using this key will no longer
                                  be able to track events.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRevokeApiKey(key._id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Revoke Key
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Integration Tip */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3 items-start">
                <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Integration Guide
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Ready to start tracking? Check out our{" "}
                    <Link
                      href="/docs"
                      className="text-primary hover:underline font-medium"
                    >
                      SDK Documentation
                    </Link>{" "}
                    to learn how to initialize the Nexus SDK with your project
                    credentials.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Card className="p-12 text-center border border-border bg-card flex flex-col items-center justify-center space-y-4">
              <div className="p-4 rounded-full bg-secondary/50">
                <BarChart3 className="w-12 h-12 text-muted-foreground opacity-20" />
              </div>
              <div className="max-w-xs">
                <h3 className="text-lg font-semibold text-foreground">
                  No Project Selected
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Select a project from the list on the left or create a new one
                  to manage your API keys and settings.
                </p>
              </div>
              <Button
                onClick={() => setShowNewProject(true)}
                variant="outline"
                className="mt-4"
              >
                Create Your First Project
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
