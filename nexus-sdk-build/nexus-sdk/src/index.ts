/**
 * Nexus Analytics SDK - Main Entry Point
 */

export { Nexus } from "./core/NexusSDK";
export type {
  NexusConfig,
  EventType,
  EventSchemas,
  SerializedEvent,
  IStorage,
  ITransport,
  ILogger,
} from "./types";

// Export classes for advanced usage
export { EventTracker } from "./core/EventTracker";
export { Logger } from "./core/Logger";
export { SecurityManager } from "./core/Security";
export { EventQueue } from "./core/EventQueue";
export { HttpTransport } from "./transport/HttpTransport";
export { StorageFactory } from "./storage/StorageFactory";
export { BrowserStorage } from "./storage/BrowserStorage";
export { NodeStorage } from "./storage/NodeStorage";
