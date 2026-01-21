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

const OFFLINE_EVENTS_KEY = "nexus_offline_events";

export class EventTracker {
  private config: NexusConfig;
  private queue: EventQueue;
  private storage: IStorage;
  private transport: ITransport;
  private logger: ILogger;
  private sessionId: string;
  private isOnline: boolean = true;

  constructor(
    config: NexusConfig,
    storage: IStorage,
    logger?: ILogger,
    transport?: ITransport
  ) {
    this.config = {
      batchSize: 10,
      flushInterval: 2000,
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

    this.sessionId = this.generateSessionId();

    this.queue = new EventQueue(
      this.flushEvents.bind(this),
      this.logger,
      this.config.batchSize,
      this.config.flushInterval
    );

    this.setupOfflineDetection();
    this.restoreOfflineEvents();
  }

  /**
   * Track an event with type safety
   */
  track<T extends EventType>(
    eventType: T,
    data: Omit<EventSchemas[T], "timestamp" | "sessionId">
  ): void {
    try {
      const event: SerializedEvent = {
        type: eventType,
        data: {
          ...data,
          sessionId: this.sessionId,
          timestamp: Date.now(),
        },
        timestamp: Date.now(),
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

      await this.transport.send(events, signature, timestamp);
    } catch (error) {
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
  }
}
