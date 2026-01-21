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

  constructor(
    onFlush: (events: SerializedEvent[]) => Promise<void>,
    logger: ILogger,
    batchSize: number = 10,
    flushInterval: number = 2000
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
    if (this.queue.length === 0) {
      return;
    }

    this.stopFlushTimer();

    const events = [...this.queue];
    this.queue = [];

    this.logger.debug("Flushing events", { count: events.length });

    try {
      await this.onFlush(events);
    } catch (error) {
      // Re-queue events on failure
      this.queue.unshift(...events);
      this.logger.error("Failed to flush events", error);
      this.startFlushTimer();
    }
  }

  /**
   * Get current queue size
   */
  getSize(): number {
    return this.queue.length;
  }

  /**
   * Check if queue has events
   */
  hasEvents(): boolean {
    return this.queue.length > 0;
  }

  /**
   * Clear all events
   */
  clear(): void {
    this.queue = [];
    this.stopFlushTimer();
  }

  private startFlushTimer(): void {
    if (this.flushTimer) {
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
