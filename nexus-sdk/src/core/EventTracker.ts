/**
 * Core event tracker class
 */

import type {
  NexusConfig,
  EventType,
  EventSchemas,
  SerializedEvent,
  IStorage,
  ITransport,
  ILogger,
} from "../types";
import { EventQueue } from "./EventQueue";
import { SecurityManager } from "./Security";
import { Logger } from "./Logger";
import { HttpTransport } from "../transport/HttpTransport";
import { SDK_VERSION } from "../version";

const OFFLINE_EVENTS_KEY = "nexus_offline_events";

export class EventTracker {
  private config: NexusConfig;
  private queue: EventQueue;
  private storage: IStorage;
  private transport: ITransport;
  private logger: ILogger;
  private sessionId: string;
  private userId: string | null = null;
  private isOnline: boolean = true;
  private consecutiveUnauthorizedErrors: number = 0;
  private readonly MAX_UNAUTHORIZED_ERRORS = 3;

  constructor(
    config: NexusConfig,
    storage: IStorage,
    logger?: ILogger,
    transport?: ITransport
  ) {
    this.config = {
      batchSize: 20,
      flushInterval: 30000,
      maxRetries: 3,
      ...config,
    };

    // Validation
    if (!SecurityManager.validateApiKey(this.config.apiKey)) {
      throw new Error("Invalid API key provided");
    }
    if (!SecurityManager.validateProjectId(this.config.projectId)) {
      throw new Error("Invalid project ID provided");
    }

    this.storage = storage;
    this.logger = logger || new Logger(this.config.environment === "development");
    this.transport =
      transport ||
      new HttpTransport(
        this.logger,
        this.config.endpoint,
        this.config.maxRetries
      );

    const existingSession = this.getCookie("nx_session_id");
    if (existingSession) {
      this.sessionId = existingSession;
    } else {
      this.sessionId = this.generateSessionId();
      this.setCookie("nx_session_id", this.sessionId, 1); // 1 day limit
    }

    const existingUserId = this.getCookie("nx_user_id");
    if (existingUserId) {
      this.userId = existingUserId;
    }

    this.queue = new EventQueue(
      this.flushEvents.bind(this),
      this.logger,
      this.config.batchSize,
      this.config.flushInterval
    );

    this.setupOfflineDetection();
    this.restoreOfflineEvents();
    this.trackSessionStart();
  }

  /**
   * Set the user ID for subsequent events
   */
  setUserId(userId: string): void {
    this.userId = userId;
    this.setCookie("nx_user_id", userId, 365); // 1 year persistence
    this.logger.info(`User identified: ${userId}`);
  }

  /**
   * Track an event with type safety
   */
  track<T extends EventType>(
    eventType: T,
    data: Omit<EventSchemas[T], "timestamp" | "sessionId">
  ): void {
    try {
      const startTime = performance.now();
      
      const event: SerializedEvent = {
        type: eventType,
        data: {
          ...data,
          sessionId: this.sessionId,
          userId: this.userId || (data as any).userId,
          timestamp: Date.now(),
        },
        timestamp: Date.now(),
        sdkVersion: SDK_VERSION,
        latency: Math.round(performance.now() - startTime)
      };

      this.logger.debug("Tracking event", { type: eventType });
      this.queue.enqueue(event);
    } catch (error) {
      this.logger.error(`Error tracking event "${eventType}"`, error);
    }
  }

  /**
   * Manually flush pending events
   */
  async flush(): Promise<void> {
    await this.queue.flush();
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Cleanup resources
   */
  async destroy(): Promise<void> {
    await this.queue.flush();
    this.logger.info("EventTracker destroyed");
  }

  /**
   * Flush events to server
   */
  private async flushEvents(events: SerializedEvent[]): Promise<void> {
    if (!this.isOnline) {
      await this.saveOfflineEvents(events);
      return;
    }

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const data = JSON.stringify(events);
      const signature = await SecurityManager.createSignature(
        data,
        this.config.apiKey
      );

      await this.transport.send(events, signature, timestamp, this.config.apiKey);
      
      // Reset counter on successful flush
      this.consecutiveUnauthorizedErrors = 0;
    } catch (error: any) {
      // Check for unauthorized errors (401/403)
      const isUnauthorized = 
        error?.status === 401 || 
        error?.status === 403 || 
        error?.message?.toLowerCase().includes("unauthorized") ||
        error?.message?.toLowerCase().includes("invalid api key");

      if (isUnauthorized) {
        this.consecutiveUnauthorizedErrors++;
        this.logger.warn(`Unauthorized flush attempt ${this.consecutiveUnauthorizedErrors}/${this.MAX_UNAUTHORIZED_ERRORS}`);

        if (this.consecutiveUnauthorizedErrors >= this.MAX_UNAUTHORIZED_ERRORS) {
          const reason = "SDK disabled due to multiple consecutive unauthorized errors (invalid API key).";
          this.logger.error(`CRITICAL: ${reason}`);
          
          // Stop the queue
          this.queue.stop();
          
          // Notify the host application
          if (this.config.onKilled) {
            this.config.onKilled(reason);
          }
        }
      }

      // Save to offline storage
      await this.saveOfflineEvents(events);
      throw error;
    }
  }

  /**
   * Save events for offline mode
   */
  private async saveOfflineEvents(events: SerializedEvent[]): Promise<void> {
    try {
      const existing = await this.storage.get(OFFLINE_EVENTS_KEY);
      const allEvents = existing ? JSON.parse(existing) : [];
      const updated = [...allEvents, ...events];

      await this.storage.set(OFFLINE_EVENTS_KEY, JSON.stringify(updated));
      this.logger.info(`Saved ${events.length} events to offline storage`);
    } catch (error) {
      this.logger.error("Failed to save offline events", error);
    }
  }

  /**
   * Restore offline events and send them
   */
  private async restoreOfflineEvents(): Promise<void> {
    try {
      const stored = await this.storage.get(OFFLINE_EVENTS_KEY);
      if (!stored) {
        return;
      }

      const events = JSON.parse(stored) as SerializedEvent[];
      if (events.length === 0) {
        return;
      }

      this.logger.info(`Restoring ${events.length} offline events`);

      // Add to queue
      for (const event of events) {
        this.queue.enqueue(event);
      }

      // Clear offline storage
      await this.storage.remove(OFFLINE_EVENTS_KEY);
    } catch (error) {
      this.logger.warn("Failed to restore offline events", error);
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Setup online/offline detection
   */
  private setupOfflineDetection(): void {
    if (typeof window === "undefined") {
      return; // Only for browser
    }

    window.addEventListener("online", () => {
      this.isOnline = true;
      this.logger.info("Back online, syncing offline events");
      this.restoreOfflineEvents();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.logger.info("Gone offline, events will be saved locally");
    });

    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        const pendingEvents = this.queue.getEvents();
        if (pendingEvents.length > 0) {
          // Save pending events to offline storage when page is hidden/closed
          void this.saveOfflineEvents(pendingEvents);
        }
      }
    });
  }

  // ==== Cookie Helpers for Subdomain Tracking ====
  private getRootDomain(): string {
    if (typeof window === "undefined") return "";
    const parts = window.location.hostname.split(".");
    if (parts.length <= 2) return `.${window.location.hostname}`;
    return `.${parts.slice(-2).join(".")}`;
  }

  private setCookie(name: string, value: string, days: number): void {
    if (typeof document === "undefined") return;
    const d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
    document.cookie = `${name}=${value};path=/;domain=${this.getRootDomain()};expires=${d.toUTCString()}`;
  }

  private getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    if (match) return match[2];
    return null;
  }

  /**
   * Track session start event
   */
  private trackSessionStart(): void {
    const device = typeof window !== "undefined" ? window.navigator.userAgent : "node";
    this.track("session_started", {
      device,
      browser: device, // Simplified for now
      os: device, // Simplified for now
    });
  }
}
