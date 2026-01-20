'use client';

import React from "react"

import { useState, useEffect, useCallback } from 'react';
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
import { Plus, Settings, Trash2, Copy, Key, Loader2 } from 'lucide-react';
import Link from 'next/link';

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [environment, setEnvironment] = useState('production');

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedProject(data.data[0]);
          loadApiKeys(data.data[0]._id);
        }
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

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

      if (response.ok) {
        const data = await response.json();
        setProjects([...projects, data.data]);
        setProjectName('');
        setShowNewProject(false);
        setSelectedProject(data.data);
        loadApiKeys(data.data._id);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateApiKey(projectId: string) {
    try {
      const response = await fetch(`/api/projects/${projectId}/api-keys`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeys([data.data, ...apiKeys]);
      }
    } catch (error) {
      console.error('Error generating API key:', error);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Projects</h1>
          <p className="text-muted-foreground">
            Create and manage API projects for event tracking
          </p>
        </div>
        <Button onClick={() => setShowNewProject(!showNewProject)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {showNewProject && (
        <Card className="p-6 border border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Create New Project
          </h2>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="My App"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
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
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  'Create Project'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewProject(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-1">
          <Card className="border border-border bg-card">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Your Projects</h2>
            </div>
            <div className="divide-y divide-border">
              {projects.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No projects yet. Create one to get started.
                </div>
              ) : (
                projects.map((project) => (
                  <button
                    key={project._id}
                    onClick={() => {
                      setSelectedProject(project);
                      loadApiKeys(project._id);
                    }}
                    className={`w-full p-4 text-left transition-colors ${
                      selectedProject?._id === project._id
                        ? 'bg-primary/10 border-l-2 border-primary'
                        : 'hover:bg-secondary'
                    }`}
                  >
                    <div className="font-medium text-foreground">
                      {project.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {project.environment}
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
            <div className="space-y-6">
              <Card className="p-6 border border-border bg-card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {selectedProject.name}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      Environment: {selectedProject.environment}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </Card>

              {/* API Keys */}
              <Card className="border border-border bg-card">
                <div className="p-6 border-b border-border flex justify-between items-center">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    API Keys
                  </h3>
                  <Button
                    onClick={() => handleGenerateApiKey(selectedProject._id)}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Generate Key
                  </Button>
                </div>

                <div className="divide-y divide-border">
                  {apiKeys.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground text-sm">
                      No API keys yet. Generate one to start tracking events.
                    </div>
                  ) : (
                    apiKeys.map((key) => (
                      <div
                        key={key._id}
                        className="p-4 flex items-center justify-between"
                      >
                        <div className="font-mono text-sm text-foreground">
                          {key.displayKey}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                            onClick={() => {
                              navigator.clipboard.writeText(key.displayKey);
                            }}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-6 text-center border border-border bg-card">
              <p className="text-muted-foreground">
                Select a project or create a new one to get started
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
