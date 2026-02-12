"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { Nexus } from "nexus-avail";
import type { EventType, EventSchemas } from "nexus-avail";

interface NexusContextType {
  isInitialized: boolean;
  sessionId: string | null;
  error: string | null;
  config: { apiKey: string; projectId: string };
  updateConfig: (apiKey: string, projectId: string) => void;
  track: <T extends EventType>(
    eventType: T,
    data: Omit<EventSchemas[T], "timestamp" | "sessionId">,
  ) => void;
  flush: () => Promise<void>;
}

const NexusContext = createContext<NexusContextType | null>(null);

export function NexusProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<{ apiKey: string; projectId: string }>({
    apiKey: '',
    projectId: '',
  });

  const [status, setStatus] = useState<{
    initialized: boolean;
    session: string | null;
    error: string | null;
  }>({
    initialized: false,
    session: null,
    error: null,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initSDK = async () => {
      if (!config.apiKey || !config.projectId) {
        setStatus({ initialized: false, session: null, error: null });
        return;
      }

      try {
        await Nexus.destroy();
        Nexus.init({
          apiKey: config.apiKey,
          projectId: config.projectId,
          environment: "development",
          batchSize: 5,
          flushInterval: 3000,
        });

        setStatus({
          initialized: true,
          session: Nexus.getSessionId(),
          error: null,
        });
        console.log("[Nexus] SDK Provider re-initialized");
      } catch (error: any) {
        console.error("[Nexus] SDK Provider failed to initialize:", error);
        const errorMessage = error?.message?.toLowerCase().includes("unauthorized") 
          ? "Invalid API Key or Project ID" 
          : error?.message || "Failed to initialize SDK";
        
        setStatus({ 
          initialized: false, 
          session: null, 
          error: errorMessage 
        });
      }
    };

    initSDK();

    return () => {
      Nexus.destroy();
    };
  }, [config.apiKey, config.projectId]);

  const updateConfig = useCallback((apiKey: string, projectId: string) => {
    setConfig({ apiKey, projectId });
  }, []);

  const track = useCallback(
    <T extends EventType>(
      eventType: T,
      data: Omit<EventSchemas[T], "timestamp" | "sessionId">,
    ) => {
      if (!status.initialized) {
        console.warn("[Nexus] Cannot track: SDK not initialized");
        return;
      }

      try {
        Nexus.track(eventType, data);
      } catch (error) {
        console.error("[Nexus] Track failed:", error);
      }
    },
    [status.initialized],
  );

  const flush = useCallback(async () => {
    try {
      await Nexus.flush();
    } catch (error) {
      console.error("[Nexus] Flush failed:", error);
    }
  }, []);

  return (
    <NexusContext.Provider
      value={{
        isInitialized: status.initialized,
        sessionId: status.session,
        error: status.error,
        config,
        updateConfig,
        track,
        flush,
      }}
    >
      {children}
    </NexusContext.Provider>
  );
}

export function useNexus() {
  const context = useContext(NexusContext);
  if (!context) {
    throw new Error("useNexus must be used within a NexusProvider");
  }
  return context;
}
