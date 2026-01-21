/**
 * HTTP transport for sending events to Nexus server
 */

import type { ITransport, SerializedEvent, ILogger } from "../types";

const DEFAULT_ENDPOINT = "https://nexus-anal.vercel.app/api/events/ingest";
const MAX_RETRIES = 3;

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

export class HttpTransport implements ITransport {
  private endpoint: string;
  private retryConfig: RetryConfig;
  private logger: ILogger;

  constructor(
    logger: ILogger,
    endpoint?: string,
    maxRetries: number = MAX_RETRIES
  ) {
    this.endpoint = endpoint || DEFAULT_ENDPOINT;
    this.logger = logger;
    this.retryConfig = {
      maxRetries,
      baseDelay: 1000,
      maxDelay: 30000,
    };
  }

  /**
   * Send events with retry logic
   */
  async send(
    events: SerializedEvent[],
    signature: string,
    timestamp: number
  ): Promise<void> {
    return this.sendWithRetry(events, signature, timestamp, 0);
  }

  /**
   * Send events with exponential backoff retry
   */
  private async sendWithRetry(
    events: SerializedEvent[],
    signature: string,
    timestamp: number,
    attemptCount: number
  ): Promise<void> {
    try {
      await this.sendRequest(events, signature, timestamp);
      this.logger.info("Events sent successfully", { count: events.length });
    } catch (error) {
      if (attemptCount < this.retryConfig.maxRetries) {
        const delay = this.calculateBackoffDelay(attemptCount);
        this.logger.warn(
          `Send failed, retrying in ${delay}ms (attempt ${attemptCount + 1})`,
          error
        );

        await this.sleep(delay);
        return this.sendWithRetry(
          events,
          signature,
          timestamp,
          attemptCount + 1
        );
      }

      this.logger.error("Failed to send events after max retries", error);
      throw error;
    }
  }

  /**
   * Send HTTP request
   */
  private async sendRequest(
    events: SerializedEvent[],
    signature: string,
    timestamp: number
  ): Promise<void> {
    if (typeof fetch === "undefined") {
      throw new Error(
        "[Nexus SDK] fetch is not available. If you are using Node.js < 18, please provide a fetch polyfill (e.g., node-fetch)."
      );
    }

    const body = JSON.stringify({ events });

    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Signature": signature,
        "X-Timestamp": timestamp.toString(),
      },
      body,
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${response.statusText} - ${await response.text()}`
      );
    }
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateBackoffDelay(attemptCount: number): number {
    const delay = this.retryConfig.baseDelay * Math.pow(2, attemptCount);
    return Math.min(delay, this.retryConfig.maxDelay);
  }

  /**
   * Sleep utility for delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
