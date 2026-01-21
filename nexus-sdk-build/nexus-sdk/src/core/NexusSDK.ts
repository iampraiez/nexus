/**
 * Main Nexus SDK singleton
 */

import type { NexusConfig, EventType, EventSchemas } from "../types";
import { EventTracker } from "./EventTracker";
import { Logger } from "./Logger";
import { StorageFactory } from "../storage/StorageFactory";

class NexusSDKClass {
  private static instance: NexusSDKClass;
  private tracker: EventTracker | null = null;
  private isInitialized = false;

  /**
   * Initialize Nexus SDK
   */
  static init(config: NexusConfig): void {
    if (!NexusSDKClass.instance) {
      NexusSDKClass.instance = new NexusSDKClass();
    }

    NexusSDKClass.instance.initialize(config);
  }

  /**
   * Track an event
   */
  static track<T extends EventType>(
    eventType: T,
    data: Omit<EventSchemas[T], "timestamp" | "sessionId">
  ): void {
    NexusSDKClass.instance?.track(eventType, data);
  }

  /**
   * Flush pending events
   */
  static async flush(): Promise<void> {
    return NexusSDKClass.instance?.flush();
  }

  /**
   * Get current session ID
   */
  static getSessionId(): string | null {
    return NexusSDKClass.instance?.getSessionId() || null;
  }

  /**
   * Destroy SDK instance
   */
  static async destroy(): Promise<void> {
    await NexusSDKClass.instance?.destroy();
  }

  /**
   * Instance initialization
   */
  private initialize(config: NexusConfig): void {
    if (this.isInitialized) {
      console.warn("[Nexus SDK] Already initialized");
      return;
    }

    const storage = StorageFactory.create();
    const logger = new Logger(config.environment === "development");

    this.tracker = new EventTracker(config, storage, logger);
    this.isInitialized = true;

    logger.info("Nexus SDK initialized", {
      environment: config.environment,
      projectId: config.projectId,
    });
  }

  private track<T extends EventType>(
    eventType: T,
    data: Omit<EventSchemas[T], "timestamp" | "sessionId">
  ): void {
    if (!this.isInitialized || !this.tracker) {
      throw new Error("Nexus SDK not initialized. Call Nexus.init() first.");
    }

    this.tracker.track(eventType, data);
  }

  private async flush(): Promise<void> {
    if (!this.tracker) {
      return;
    }

    await this.tracker.flush();
  }

  private getSessionId(): string {
    if (!this.tracker) {
      throw new Error("Nexus SDK not initialized");
    }

    return this.tracker.getSessionId();
  }

  private async destroy(): Promise<void> {
    if (!this.tracker) {
      return;
    }

    await this.tracker.destroy();
    this.tracker = null;
    this.isInitialized = false;
  }
}

/**
 * Export singleton instance
 */
export const Nexus = {
  init: NexusSDKClass.init.bind(NexusSDKClass),
  track: NexusSDKClass.track.bind(NexusSDKClass),
  flush: NexusSDKClass.flush.bind(NexusSDKClass),
  getSessionId: NexusSDKClass.getSessionId.bind(NexusSDKClass),
  destroy: NexusSDKClass.destroy.bind(NexusSDKClass),
};
