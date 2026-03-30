/**
 * Event queue for batching and managing events
 */

import type { SerializedEvent } from "../types";
import type { ILogger } from "../types";

export class EventQueue {
  private queue: SerializedEvent[] = [];
  private batchSize: number;
  private flushInterval: number;
  private flushTimer: NodeJS.Timeout | null = null;
  private onFlush: (events: SerializedEvent[]) => Promise<void>;
  private logger: ILogger;
  private isStopped: boolean = false;

  constructor(
    onFlush: (events: SerializedEvent[]) => Promise<void>,
    logger: ILogger,
    batchSize: number = 10,
    flushInterval: number = 30000
  ) {
    this.onFlush = onFlush;
    this.logger = logger;
    this.batchSize = batchSize;
    this.flushInterval = flushInterval;
  }

  /**
   * Add event to queue
   */
  enqueue(event: SerializedEvent): void {
    if (this.isStopped) {
      this.logger.warn("EventQueue is stopped. Event discarded.");
      return;
    }

    this.queue.push(event);
    this.logger.debug("Event queued", {
      type: event.type,
      queueSize: this.queue.length,
    });

    if (this.queue.length >= this.batchSize) {
      this.flush();
    } else if (!this.flushTimer) {
      this.startFlushTimer();
    }
  }

  /**
   * Flush all events in queue
   */
  async flush(): Promise<void> {
    if (this.isStopped || this.queue.length === 0) {
      return;
    }

    this.stopFlushTimer();

    const events = [...this.queue];
    this.queue = [];

    this.logger.debug("Flushing events", { count: events.length });

    try {
      await this.onFlush(events);
    } catch (error) {
      // Only re-queue and restart timer if we haven't been stopped
      if (!this.isStopped) {
        this.queue.unshift(...events);
        this.logger.error("Failed to flush events", error);
        this.startFlushTimer();
      } else {
        this.logger.warn("EventQueue stopped during flush — discarding events.");
      }
    }
  }

  /**
   * Get current queue size
   */
  getSize(): number {
    return this.queue.length;
  }

  /**
   * Get all pending events
   */
  getEvents(): SerializedEvent[] {
    return [...this.queue];
  }

  /**
   * Check if queue has events
   */
  hasEvents(): boolean {
    return this.queue.length > 0;
  }

  /**
   * Clear all events without stopping the queue
   */
  clear(): void {
    this.queue = [];
    this.stopFlushTimer();
  }

  /**
   * Permanently stop all operations. Cannot be restarted.
   * Used by the auto-kill circuit breaker.
   */
  stop(): void {
    this.isStopped = true;
    this.queue = [];
    this.stopFlushTimer();
    this.logger.info("EventQueue permanently stopped.");
  }

  private startFlushTimer(): void {
    if (this.isStopped || this.flushTimer) {
      return;
    }

    this.flushTimer = setTimeout(() => {
      this.flush();
    }, this.flushInterval);
  }

  private stopFlushTimer(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }
}
