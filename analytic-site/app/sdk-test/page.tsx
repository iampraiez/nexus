"use client";

import { useState, useCallback } from "react";
import { NexusProvider, useNexus } from "./NexusProvider";
import { useToast } from "@/hooks/use-toast";
import UserDemoCard from "./components/UserDemoCard";
import ProductDemoCard from "./components/ProductDemoCard";
import CheckoutDemoCard from "./components/CheckoutDemoCard";
import OrderDemoCard from "./components/OrderDemoCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
  ShieldCheck,
  AlertCircle,
  Wifi,
  WifiOff,
  Trash2,
} from "lucide-react";

interface EventLog {
  id: string;
  type: string;
  timestamp: number;
}

function SdkTestContent() {
  const { isInitialized, sessionId, error, flush, config, updateConfig } =
    useNexus();
  const [events, setEvents] = useState<EventLog[]>([]);
  const { toast } = useToast();
  const [localApiKey, setLocalApiKey] = useState(config.apiKey);
  const [localProjectId, setLocalProjectId] = useState(config.projectId);
  const [isFlushing, setIsFlushing] = useState(false);

  const handleUpdateConfig = () => {
    if (!localApiKey.trim() || !localProjectId.trim()) {
      toast({
        title: "Missing credentials",
        description: "Please enter both an API Key and Project ID.",
        variant: "destructive",
      });
      return;
    }
    updateConfig(localApiKey.trim(), localProjectId.trim());
    toast({
      title: "Connecting…",
      description: "Reinitializing SDK with new credentials.",
    });
  };

  const handleFlush = async () => {
    setIsFlushing(true);
    await flush();
    setIsFlushing(false);
    toast({ title: "Buffer flushed", description: `${events.length} events sent.` });
  };

  const addEvent = useCallback((type: string) => {
    setEvents((prev) =>
      [{ id: `${Date.now()}-${Math.random()}`, type, timestamp: Date.now() }, ...prev].slice(0, 30)
    );
  }, []);

  const isKilled = error?.toLowerCase().includes("disabled");
  const statusColor = isInitialized
    ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"
    : isKilled
    ? "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]"
    : error
    ? "bg-destructive"
    : "bg-amber-500";

  const statusLabel = isInitialized
    ? "ACTIVE"
    : isKilled
    ? "TERMINATED"
    : error
    ? "ERROR"
    : "OFFLINE";

  const statusBadgeClass = isInitialized
    ? "bg-emerald-500/10 text-emerald-500 border-none"
    : isKilled || error
    ? "bg-destructive/10 text-destructive border-none"
    : "text-amber-500 border-amber-500/30";

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 space-y-10">
      {/* Header */}
      <section className="max-w-3xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
          <Rocket className="w-3.5 h-3.5" />
          <span className="text-xs font-bold tracking-widest uppercase">
            Nexus SDK Sandbox
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-linear-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
          Interactive Event Sandbox
        </h1>
        <p className="text-muted-foreground text-base max-w-xl mx-auto">
          Connect your project, fire real analytics events, and watch the live
          stream in real-time.
        </p>
      </section>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Connection Hub */}
        <Card className="lg:col-span-1 border-border/50 bg-card/40 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
              <Zap className="w-4 h-4" />
              CONNECTION HUB
            </CardTitle>
            <CardDescription className="text-[11px]">
              Enter your Nexus credentials to connect
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* API Key */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground/60 px-1">
                API Key
              </label>
              <div className="relative group">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  value={localApiKey}
                  onChange={(e) => setLocalApiKey(e.target.value)}
                  className="w-full bg-background/40 border border-border/50 rounded-lg py-2 pl-9 pr-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground/30"
                  placeholder="pk_live_..."
                />
              </div>
            </div>

            {/* Project ID */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground/60 px-1">
                Project ID
              </label>
              <div className="relative group">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={localProjectId}
                  onChange={(e) => setLocalProjectId(e.target.value)}
                  className="w-full bg-background/40 border border-border/50 rounded-lg py-2 pl-9 pr-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground/30"
                  placeholder="proj_..."
                />
              </div>
            </div>

            <Button
              onClick={handleUpdateConfig}
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs font-bold border-primary/20 hover:bg-primary/10 hover:text-primary transition-all active:scale-[0.98]"
            >
              {isInitialized ? (
                <><Wifi className="mr-2 w-3.5 h-3.5" /> Reconnect</>
              ) : (
                <><WifiOff className="mr-2 w-3.5 h-3.5" /> Connect SDK</>
              )}
            </Button>

            <p className="text-[10px] text-muted-foreground/50 leading-tight text-center">
              No project?{" "}
              <a href="/dashboard/projects" className="text-primary hover:underline font-medium">
                Create one to get your API key →
              </a>
            </p>

            <Separator className="bg-border/30" />

            {/* Status Row */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-background/20 border border-border/40">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
                <span className="text-[10px] font-bold text-muted-foreground">Status</span>
              </div>
              <Badge variant="outline" className={`h-5 text-[9px] px-2 font-black ${statusBadgeClass}`}>
                {statusLabel}
              </Badge>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-2.5 rounded-lg bg-destructive/5 border border-destructive/20 flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
                <span className="text-[10px] font-medium text-destructive leading-tight">
                  {error}
                </span>
              </div>
            )}

            {/* Session ID */}
            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground/50">
                  Session ID
                </span>
                {sessionId && (
                  <span className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold">
                    LIVE
                  </span>
                )}
              </div>
              <div className="p-2 rounded-lg bg-black/40 font-mono text-[9px] break-all border border-primary/5 text-primary/70 min-h-8 flex items-center justify-center">
                {sessionId || (
                  <span className="text-muted-foreground/25 italic">
                    Not connected
                  </span>
                )}
              </div>
            </div>

            {/* Flush Button */}
            <Button
              onClick={handleFlush}
              variant="default"
              size="sm"
              disabled={!isInitialized || isFlushing}
              className="w-full h-9 font-bold disabled:opacity-40 disabled:grayscale transition-all"
            >
              <Upload className="mr-2 h-3.5 w-3.5" />
              {isFlushing ? "Flushing…" : "Flush Event Buffer"}
            </Button>
          </CardContent>
        </Card>

        {/* Live Event Feed */}
        <Card className="lg:col-span-2 border-border/50 bg-card/40 backdrop-blur-xl flex flex-col" style={{ minHeight: "420px" }}>
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                LIVE EVENT STREAM
              </CardTitle>
              <CardDescription className="text-[11px] mt-0.5">
                Events captured this session
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 pt-0.5">
              {events.length > 0 && (
                <>
                  <Badge variant="outline" className="text-[10px] border-primary/30 text-primary h-5">
                    {events.length}
                  </Badge>
                  <button
                    onClick={() => setEvents([])}
                    className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                    title="Clear events"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden pt-2">
            <ScrollArea className="h-full">
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
                  <div className="p-4 rounded-full bg-secondary/50">
                    <Activity className="w-7 h-7 text-muted-foreground/30" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      No events yet
                    </p>
                    <p className="text-xs text-muted-foreground/40 mt-1">
                      {isInitialized
                        ? "Use the modules below to fire events"
                        : "Connect the SDK first, then fire events below"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 pr-3 pb-3">
                  {events.map((event, i) => (
                    <div
                      key={event.id}
                      className="px-3 py-2.5 rounded-lg bg-background/40 border border-border/40 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2"
                      style={{ animationDelay: `${Math.min(i * 30, 200)}ms` }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                        <span className="text-xs font-bold text-primary truncate tracking-tight">
                          {event.type}
                        </span>
                      </div>
                      <span className="text-[9px] text-muted-foreground/50 tabular-nums shrink-0">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Separator className="max-w-7xl mx-auto bg-border/30" />

      {/* Event Generation Modules */}
      <section className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold tracking-tight">Event Modules</h2>
          <p className="text-muted-foreground text-sm">
            {isInitialized
              ? "SDK is connected — fire events below"
              : "Connect the SDK above to enable event tracking"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <UserDemoCard onEventTracked={(type) => addEvent(type)} />
          <ProductDemoCard onEventTracked={(type) => addEvent(type)} />
          <CheckoutDemoCard onEventTracked={(type) => addEvent(type)} />
          <OrderDemoCard onEventTracked={(type) => addEvent(type)} />
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-xl mx-auto text-center pb-16 space-y-4">
        <div className="p-5 rounded-2xl bg-secondary/30 border border-border/50 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Need advanced event schemas, server-side tracking, or data enrichment APIs?
          </p>
          <Button variant="link" asChild className="text-primary font-bold h-auto p-0">
            <a href="https://nexus-anal.vercel.app/docs" target="_blank">
              VIEW FULL DOCUMENTATION →
            </a>
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground/30 font-mono">
          NEXUS SDK v1.2.4 • SANDBOX MODE
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
