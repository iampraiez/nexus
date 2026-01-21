# Nexus SDK API Reference

## Nexus Singleton

The main entry point for the SDK.

### `Nexus.init(config: NexusConfig)`

Initialize the SDK with configuration.

**Parameters:**
- `config` (NexusConfig) - Configuration object

**Example:**
```typescript
Nexus.init({
  apiKey: "sk_live_xxxx",
  projectId: "proj_xxxx",
  environment: "production"
});
```

**Throws:**
- Error if API key or project ID is invalid
- Error if already initialized

---

### `Nexus.track<T extends EventType>(eventType: T, data: EventData)`

Track an event with type-safe schema validation.

**Type Parameters:**
- `T` - Event type (user_signup, product_viewed, etc.)

**Parameters:**
- `eventType` (EventType) - The type of event to track
- `data` (EventData) - Event data matching the schema

**Example:**
```typescript
Nexus.track("order_created", {
  orderId: "order-123",
  userId: "user-456",
  amount: 99.99,
  currency: "USD",
  items: [{ productId: "prod-789", qty: 1 }]
});
```

**Throws:**
- Error if SDK is not initialized
- Type error if data doesn't match schema (compile-time)

---

### `Nexus.flush(): Promise<void>`

Manually flush all pending events to the server.

**Example:**
```typescript
await Nexus.flush();
```

**Notes:**
- Events are automatically flushed every 2 seconds or when batch reaches 10 items
- Call this before shutting down to ensure delivery

---

### `Nexus.getSessionId(): string | null`

Get the current session ID.

**Returns:**
- Session ID string or null if not initialized

**Example:**
```typescript
const sessionId = Nexus.getSessionId();
console.log(`Session: ${sessionId}`);
```

---

### `Nexus.destroy(): Promise<void>`

Cleanup and destroy the SDK instance.

**Example:**
```typescript
await Nexus.destroy();
```

**Notes:**
- Flushes pending events before destruction
- Use this in cleanup handlers (beforeunload, exit)

---

## Types

### NexusConfig

```typescript
interface NexusConfig {
  apiKey: string;                              // API key for authentication
  projectId: string;                           // Project identifier
  environment: "development" | "production";   // Environment mode
  batchSize?: number;                          // Events per batch (default: 10)
  flushInterval?: number;                      // Flush interval in ms (default: 2000)
  maxRetries?: number;                         // Max retry attempts (default: 3)
  endpoint?: string;                           // Custom API endpoint
}
```

### EventType

Discriminated union of supported event types:

```typescript
type EventType =
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
```

### EventSchemas

Type-safe event data schemas:

```typescript
interface EventSchemas {
  user_signup: {
    email: string;
    source?: string;
  };
  user_login: {
    email: string;
  };
  product_viewed: {
    productId: string;
    productName?: string;
    category?: string;
  };
  // ... more event types
}
```

---

## Advanced Classes

### EventTracker

Core event tracking class.

**Constructor:**
```typescript
new EventTracker(
  config: NexusConfig,
  storage: IStorage,
  logger?: ILogger,
  transport?: ITransport
)
```

**Methods:**
- `track<T>(eventType: T, data: EventData): void`
- `flush(): Promise<void>`
- `getSessionId(): string`
- `destroy(): Promise<void>`

---

### Logger

Logging utility.

**Constructor:**
```typescript
new Logger(isDevelopment?: boolean)
```

**Methods:**
- `debug(message: string, data?: unknown): void`
- `info(message: string, data?: unknown): void`
- `warn(message: string, data?: unknown): void`
- `error(message: string, error?: unknown): void`

---

### SecurityManager

Static security utilities.

**Static Methods:**
- `createSignature(data: string, secret: string): Promise<string>`
- `validateApiKey(apiKey: string): boolean`
- `validateProjectId(projectId: string): boolean`

---

### HttpTransport

HTTP-based event transport with retry logic.

**Constructor:**
```typescript
new HttpTransport(
  logger: ILogger,
  endpoint?: string,
  maxRetries?: number
)
```

**Methods:**
- `send(events: SerializedEvent[], signature: string, timestamp: number): Promise<void>`

---

### StorageFactory

Factory for creating appropriate storage backend.

**Static Methods:**
- `create(): IStorage` - Returns BrowserStorage or NodeStorage based on environment

---

## Interfaces

### IStorage

```typescript
interface IStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}
```

### ITransport

```typescript
interface ITransport {
  send(
    events: SerializedEvent[],
    signature: string,
    timestamp: number
  ): Promise<void>;
}
```

### ILogger

```typescript
interface ILogger {
  debug(message: string, data?: unknown): void;
  info(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  error(message: string, error?: unknown): void;
}
```

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid API key provided" | API key is empty or invalid | Check your API key configuration |
| "Invalid project ID provided" | Project ID is empty or invalid | Check your project ID configuration |
| "Nexus SDK not initialized" | Attempting to track before init | Call Nexus.init() first |
| "HTTP 401: Unauthorized" | Invalid credentials | Verify API key and project ID |
| "HTTP 429: Too Many Requests" | Rate limited | Reduce event frequency |

---

## Best Practices

1. **Initialize Early**: Call `Nexus.init()` as early as possible in your application
2. **Flush Before Exit**: Always flush events before shutting down
3. **Error Handling**: Wrap tracking calls in try-catch for production apps
4. **Batch Configuration**: Adjust `batchSize` and `flushInterval` based on your needs
5. **Session Tracking**: Use `getSessionId()` to correlate events with user sessions
6. **Offline Handling**: Rely on automatic offline detection (browser) or manual flushing (Node.js)
