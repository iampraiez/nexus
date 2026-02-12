"use client";

import { useEffect, useState, useCallback } from "react";
import { Nexus } from "nexus-avail";
import { env } from "@/config/env";
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

const API_KEY = env.NEXT_PUBLIC_NEXUS_API_KEY;
const PROJECT_ID = env.NEXT_PUBLIC_NEXUS_PROJECT_ID;

export function useNexus(): NexusHook {
  const [status, setStatus] = useState<{
    initialized: boolean;
    session: string | null;
  }>({
    initialized: false,
    session: null,
  });

  useEffect(() => {
    let mounted = true;
    try {
      Nexus.init({
        apiKey: API_KEY,
        projectId: PROJECT_ID,
        environment: "development",
        batchSize: 5,
        flushInterval: 3000,
      });

      if (mounted) {
        setStatus({
          initialized: true,
          session: Nexus.getSessionId(),
        });
        console.log("[Demo] Nexus SDK initialized");
      }
    } catch (error) {
      console.error("[Demo] Failed to initialize Nexus SDK:", error);
    }

    return () => {
      mounted = false;
      Nexus.destroy();
    };
  }, []);

  const track = useCallback(
    <T extends EventType>(
      eventType: T,
      data: Omit<EventSchemas[T], "timestamp" | "sessionId">,
    ) => {
      if (!status.initialized) {
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
    [status.initialized],
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
    isInitialized: status.initialized,
    sessionId: status.session,
    track,
    flush,
  };
}
