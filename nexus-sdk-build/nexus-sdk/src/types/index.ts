/**
 * Core type definitions for Nexus SDK
 */

/**
 * Initialization configuration for Nexus SDK
 */
export interface NexusConfig {
  apiKey: string;
  projectId: string;
  environment: "development" | "production";
  batchSize?: number;
  flushInterval?: number;
  maxRetries?: number;
  endpoint?: string;
}

/**
 * Base event data structure
 */
export interface BaseEvent {
  timestamp?: number;
  sessionId?: string;
  userId?: string;
}

/**
 * Event type discriminator
 */
export type EventType =
  | "user_signup"
  | "user_login"
  | "product_viewed"
  | "product_added_to_cart"
  | "product_removed_from_cart"
  | "checkout_started"
  | "checkout_completed"
  | "order_created"
  | "order_cancelled"
  | "payment_failed";

/**
 * Event schema mappings for type-safe tracking
 */
export interface EventSchemas {
  user_signup: BaseEvent & {
    email: string;
    source?: string;
  };
  user_login: BaseEvent & {
    email: string;
  };
  product_viewed: BaseEvent & {
    productId: string;
    productName?: string;
    category?: string;
  };
  product_added_to_cart: BaseEvent & {
    productId: string;
    quantity: number;
    price?: number;
  };
  product_removed_from_cart: BaseEvent & {
    productId: string;
    quantity: number;
  };
  checkout_started: BaseEvent & {
    cartValue: number;
    itemCount: number;
  };
  checkout_completed: BaseEvent & {
    orderId: string;
    cartValue: number;
  };
  order_created: BaseEvent & {
    orderId: string;
    userId: string;
    amount: number;
    currency: string;
    items: Array<{
      productId: string;
      qty: number;
    }>;
  };
  order_cancelled: BaseEvent & {
    orderId: string;
    reason?: string;
  };
  payment_failed: BaseEvent & {
    orderId: string;
    error: string;
  };
}

/**
 * Serialized event for transmission
 */
export interface SerializedEvent {
  type: EventType;
  data: Record<string, unknown>;
  timestamp: number;
  sdkVersion: string;
  latency?: number; // Time taken to process event (in milliseconds)
}

/**
 * Storage interface for persistence
 */
export interface IStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

/**
 * Transport interface for network requests
 */
export interface ITransport {
  send(
    events: SerializedEvent[],
    signature: string,
    timestamp: number
  ): Promise<void>;
}

/**
 * Logger interface
 */
export interface ILogger {
  debug(message: string, data?: unknown): void;
  info(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  error(message: string, error?: unknown): void;
}
