"use client";

import { useEffect, useState, useCallback } from "react";
import { Nexus } from "nexus-avail";
import type { EventType, EventSchemas } from "nexus-avail";

interface NexusHook {
  isInitialized: boolean;
  sessionId: string | null;
  track: <T extends EventType>(
    eventType: T,
    data: Omit<EventSchemas[T], "timestamp" | "sessionId">,
  ) => void;
  flush: () => Promise<void>;
}

const API_KEY = process.env.NEXT_PUBLIC_NEXUS_API_KEY || "demo-key";
const PROJECT_ID = process.env.NEXT_PUBLIC_NEXUS_PROJECT_ID || "demo-project";

export function useNexus(): NexusHook {
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    try {
      Nexus.init({
        apiKey: API_KEY,
        projectId: PROJECT_ID,
        environment: "development",
        batchSize: 5,
        flushInterval: 3000,
      });

      setIsInitialized(true);
      setSessionId(Nexus.getSessionId());

      console.log("[Demo] Nexus SDK initialized");
    } catch (error) {
      console.error("[Demo] Failed to initialize Nexus SDK:", error);
    }

    return () => {
      Nexus.destroy();
    };
  }, []);

  const track = useCallback(
    <T extends EventType>(
      eventType: T,
      data: Omit<EventSchemas[T], "timestamp" | "sessionId">,
    ) => {
      if (!isInitialized) {
        console.warn("[Demo] SDK not initialized");
        return;
      }

      try {
        Nexus.track(eventType, data);
        console.log("[Demo] Event tracked:", { eventType, data });
      } catch (error) {
        console.error("[Demo] Failed to track event:", error);
      }
    },
    [isInitialized],
  );

  const flush = useCallback(async () => {
    try {
      await Nexus.flush();
      console.log("[Demo] Events flushed");
    } catch (error) {
      console.error("[Demo] Failed to flush events:", error);
    }
  }, []);

  return {
    isInitialized,
    sessionId,
    track,
    flush,
  };
}
