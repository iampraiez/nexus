"use client";

import { useState, useCallback } from "react";
import { NexusProvider, useNexus } from "./NexusProvider";
import { useToast } from "@/hooks/use-toast";
import UserDemoCard from "./components/UserDemoCard";
import ProductDemoCard from "./components/ProductDemoCard";
import CheckoutDemoCard from "./components/CheckoutDemoCard";
import OrderDemoCard from "./components/OrderDemoCard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Rocket, 
  Activity, 
  Hash, 
  Upload, 
  History, 
  Zap,
  Info,
  ShieldCheck,
  AlertCircle
} from "lucide-react";


interface EventLog {
  id: string;
  type: string;
  timestamp: number;
}

function SdkTestContent() {
  const { isInitialized, sessionId, error, flush, config, updateConfig } = useNexus();
  const [events, setEvents] = useState<EventLog[]>([]);
  const { toast } = useToast();

  // Local state for inputs
  const [localApiKey, setLocalApiKey] = useState(config.apiKey);
  const [localProjectId, setLocalProjectId] = useState(config.projectId);

  const handleUpdateConfig = () => {
    updateConfig(localApiKey, localProjectId);
    toast({
      title: "Connection Updated",
      description: "SDK re-initialized with new credentials.",
    });
  };

  const addEvent = useCallback((type: string) => {
    const event: EventLog = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      timestamp: Date.now(),
    };
    setEvents((prev) => [event, ...prev].slice(0, 20));
  }, []);

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 space-y-12">
      {/* Header Section */}
      <section className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary animate-in fade-in slide-in-from-top-4 duration-1000">
          <Rocket className="w-4 h-4" />
          <span className="text-xs font-bold tracking-widest uppercase">Nexus SDK Build</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
          Interactive Event Sandbox
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Test and validate your Nexus SDK implementation in real-time. 
          Monitor event buffering, session persistence, and data schema integrity.
        </p>
      </section>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Connection Hub Card */}
        <Card className="lg:col-span-1 border-border/50 bg-card/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
              <Zap className="w-4 h-4" />
              CONNECTION HUB
            </CardTitle>
            <CardDescription className="text-[10px]">Configure your SDK credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* API Key Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground/60 px-1">Nexus API Key</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="password"
                  value={localApiKey}
                  onChange={(e) => setLocalApiKey(e.target.value)}
                  className="w-full bg-background/40 border border-border/50 rounded-lg py-2 pl-9 pr-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                  placeholder="pk_live_..."
                />
              </div>
            </div>

            {/* Project ID Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground/60 px-1">Project ID</label>
              <div className="relative group">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text"
                  value={localProjectId}
                  onChange={(e) => setLocalProjectId(e.target.value)}
                  className="w-full bg-background/40 border border-border/50 rounded-lg py-2 pl-9 pr-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                  placeholder="project_..."
                />
              </div>
            </div>

            <Button 
              onClick={handleUpdateConfig}
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs font-bold border-primary/20 hover:bg-primary/10 hover:text-primary transition-all active:scale-[0.98]"
            >
              Update Credentials
            </Button>

            <div className="flex flex-col gap-2 pt-1">
              <p className="text-[10px] text-muted-foreground/60 px-1 leading-tight">
                Don't have a project? <a href="/dashboard/projects" className="text-primary hover:underline font-medium">Create one in your dashboard</a> to generate an API key.
              </p>
            </div>

            <Separator className="bg-border/30 my-4" />

            {/* Status indicators */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-background/20 border border-border/40">
              <div className="flex items-center gap-2.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isInitialized ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"}`} />
                <span className="text-[10px] font-bold text-muted-foreground">Status</span>
              </div>
              <Badge variant={isInitialized ? "secondary" : "outline"} className={`h-5 text-[9px] px-2 font-black ${isInitialized ? "bg-emerald-500/10 text-emerald-500 border-none" : error ? "text-destructive border-destructive/30" : "text-amber-500 border-amber-500/30"}`}>
                {isInitialized ? "ACTIVE" : error ? "ERROR" : "OFFLINE"}
              </Badge>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-destructive/5 border border-destructive/20 flex items-center gap-2 animate-in fade-in zoom-in-95">
                <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
                <span className="text-[10px] font-medium text-destructive leading-tight">
                  {error}
                </span>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="px-1 flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-muted-foreground/60">Session Identity</span>
                {sessionId && <span className="text-[8px] bg-primary/20 text-primary px-1.5 rounded-full font-bold">VERIFIED</span>}
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 font-mono text-[9px] break-all border border-primary/5 text-primary/80 min-h-[36px] flex items-center justify-center">
                {sessionId || (
                  <span className="text-muted-foreground/30 italic">No active session - Configure SDK above</span>
                )}
              </div>
            </div>

            <Button 
              onClick={flush} 
              variant="default"
              size="sm"
              disabled={!isInitialized}
              className="w-full h-9 bg-primary/95 hover:bg-primary shadow-lg shadow-primary/10 font-bold disabled:opacity-50 disabled:grayscale transition-all"
            >
              <Upload className="mr-2 h-3.5 w-3.5" />
              Flush Analytics Buffer
            </Button>
          </CardContent>
        </Card>

        {/* Live Feed Card */}
        <Card className="lg:col-span-2 border-border/50 bg-card/40 backdrop-blur-xl flex flex-col h-[400px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                LIVE EVENT STREAM
              </CardTitle>
              <CardDescription className="text-[10px]">Recent telemetry data being processed</CardDescription>
            </div>
            {events.length > 0 && (
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                {events.length} CAPTURED
              </Badge>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden pt-4">
            <ScrollArea className="h-full pr-4">
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                  <div className="p-4 rounded-full bg-secondary/50">
                    <Activity className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">No telemetry signals found</p>
                    <p className="text-xs text-muted-foreground/50">Interact with the cards below to generate activity</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {events.map((event, i) => (
                    <div 
                      key={event.id} 
                      className="p-3 rounded-lg bg-background/40 border border-border/50 flex items-center justify-between animate-in fade-in slide-in-from-right-4"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-primary tracking-tight">{event.type}</span>
                        <span className="text-[9px] text-muted-foreground tabular-nums">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Separator className="max-w-7xl mx-auto bg-border/50" />

      {/* Event Cards Section */}
      <section className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Event Generation Modules</h2>
          <p className="text-muted-foreground text-sm">Select a module to simulate specific user behavior patterns.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <UserDemoCard onEventTracked={() => addEvent("user_auth")} />
          <ProductDemoCard onEventTracked={() => addEvent("product_telemetry")} />
          <CheckoutDemoCard onEventTracked={() => addEvent("checkout_flow")} />
          <OrderDemoCard onEventTracked={() => addEvent("order_lifecycle")} />
        </div>
      </section>

      {/* Documentation Footer */}
      <footer className="max-w-xl mx-auto text-center pt-12 pb-24 space-y-6">
        <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Need to dive deeper? Explore the comprehensive documentation 
            to understand advanced tracking capabilities, server-side events, 
            and data enrichment APIs.
          </p>
          <Button variant="link" asChild className="text-primary font-bold">
            <a href="https://nexus-analytics.vercel.app/docs">VIEW FULL DOCUMENTATION →</a>
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground/40 font-mono tracking-tighter">
          NEXUS ANALYTICS SDK v1.2.3 • ENGINE: NEXT.JS 16 • MODE: SANDBOX
        </p>
      </footer>
    </div>
  );
}

export default function SdkTestPage() {
  return (
    <NexusProvider>
      <SdkTestContent />
    </NexusProvider>
  );
}
