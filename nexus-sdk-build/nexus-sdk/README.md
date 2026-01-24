# nexus-avail

Production-ready TypeScript SDK for the Nexus analytics platform. Track user events with type-safe schemas, automatic batching, offline support, and secure transmission.

## Features

- **Type-Safe Event Tracking**: Full TypeScript support with schema validation for all event types
- **Event Batching**: Automatically batches events and sends them every 2 seconds or when batch size hits 10
- **Offline Support**: Stores events in IndexedDB (browser) or filesystem (Node.js) when offline
- **Retry Logic**: Exponential backoff with configurable retry attempts
- **Security**: HMAC-SHA256 request signing with timestamp validation
- **Dual Environment**: Works seamlessly in both browser and Node.js environments
- **ESM & CommonJS**: Supports both module systems

## 🚀 Quick Start

### 1. Install

```bash
pnpm add nexus-avail
```

### 2. Getting an API Key

Before you can track events, you need to create a project and generate an API key:
1.  Sign up at [Nexus Analytics](https://nexus-anal.vercel.app/)
2.  Create a new project in the dashboard
3.  Go to **Settings > API Keys** to find your `apiKey` and `projectId`

### 3. Usage

### Browser

```typescript
import { Nexus } from "nexus-avail";

// 1. Initialize
Nexus.init({
  apiKey: "your-api-key", // Found in Settings > API Keys
  projectId: "your-project-id",
  environment: "production",
});

// Track events
Nexus.track("user_signup", {
  email: "user@example.com",
  source: "landing-page",
});

Nexus.track("product_viewed", {
  productId: "prod-123",
  productName: "Awesome Product",
  category: "Electronics",
});

// Manually flush pending events
await Nexus.flush();

// Cleanup when unloading
window.addEventListener("beforeunload", () => {
  Nexus.destroy();
});
```

### Node.js

```typescript
import { Nexus } from "nexus-avail";

// 1. Initialize
Nexus.init({
  apiKey: "your-api-key", // Found in Settings > API Keys
  projectId: "your-project-id",
  environment: "production",
});

// Track events
Nexus.track("order_created", {
  orderId: "order-456",
  userId: "user-789",
  amount: 99.99,
  currency: "USD",
  items: [
    { productId: "prod-123", qty: 2 },
    { productId: "prod-456", qty: 1 },
  ],
});

// Ensure events are sent before shutdown
process.on("exit", async () => {
  await Nexus.flush();
  await Nexus.destroy();
});
```

## Configuration

```typescript
interface NexusConfig {
  apiKey: string; // Your Nexus API key
  projectId: string; // Your Nexus project ID
  environment: "development" | "production"; // Environment
  batchSize?: number; // Default: 10
  flushInterval?: number; // Default: 2000 (ms)
  maxRetries?: number; // Default: 3
  endpoint?: string; // Custom API endpoint
}
```

## Supported Events

### user_signup

```typescript
Nexus.track("user_signup", {
  email: "user@example.com",
  source?: "landing-page",
});
```

### user_login

```typescript
Nexus.track("user_login", {
  email: "user@example.com",
});
```

### product_viewed

```typescript
Nexus.track("product_viewed", {
  productId: "prod-123",
  productName?: "Product Name",
  category?: "Electronics",
});
```

### product_added_to_cart

```typescript
Nexus.track("product_added_to_cart", {
  productId: "prod-123",
  quantity: 2,
  price?: 99.99,
});
```

### product_removed_from_cart

```typescript
Nexus.track("product_removed_from_cart", {
  productId: "prod-123",
  quantity: 1,
});
```

### checkout_started

```typescript
Nexus.track("checkout_started", {
  cartValue: 299.97,
  itemCount: 3,
});
```

### checkout_completed

```typescript
Nexus.track("checkout_completed", {
  orderId: "order-456",
  cartValue: 299.97,
});
```

### order_created

```typescript
Nexus.track("order_created", {
  orderId: "order-456",
  userId: "user-789",
  amount: 299.97,
  currency: "USD",
  items: [
    { productId: "prod-123", qty: 2 },
    { productId: "prod-456", qty: 1 },
  ],
});
```

### order_cancelled

```typescript
Nexus.track("order_cancelled", {
  orderId: "order-456",
  reason?: "Customer request",
});
```

### payment_failed

```typescript
Nexus.track("payment_failed", {
  orderId: "order-456",
  error: "Card declined",
});
```

## Advanced Usage

### Using EventTracker Directly

For more control, you can use the `EventTracker` class directly:

```typescript
import { EventTracker, Logger, StorageFactory } from "nexus-avail";

const storage = StorageFactory.create();
const logger = new Logger(true); // development mode

const tracker = new EventTracker(
  {
    apiKey: "your-api-key",
    projectId: "your-project-id",
    environment: "production",
    batchSize: 20,
    flushInterval: 5000,
  },
  storage,
  logger,
);

tracker.track("user_login", {
  email: "user@example.com",
});

await tracker.flush();
```

### Custom Transport

Implement your own transport layer:

```typescript
import { EventTracker, Logger, StorageFactory } from "nexus-avail";
import type { ITransport, SerializedEvent } from "nexus-avail";

class CustomTransport implements ITransport {
  async send(
    events: SerializedEvent[],
    signature: string,
    timestamp: number,
  ): Promise<void> {
    // Your custom implementation
  }
}

const storage = StorageFactory.create();
const logger = new Logger(false);
const transport = new CustomTransport();

const tracker = new EventTracker(
  {
    apiKey: "your-api-key",
    projectId: "your-project-id",
    environment: "production",
  },
  storage,
  logger,
  transport,
);
```

### Custom Storage

Implement your own storage backend:

```typescript
import { EventTracker } from "nexus-avail";
import type { IStorage } from "nexus-avail";

class CustomStorage implements IStorage {
  async get(key: string): Promise<string | null> {
    // Your implementation
    return null;
  }

  async set(key: string, value: string): Promise<void> {
    // Your implementation
  }

  async remove(key: string): Promise<void> {
    // Your implementation
  }

  async clear(): Promise<void> {
    // Your implementation
  }
}

const storage = new CustomStorage();
const tracker = new EventTracker(
  {
    apiKey: "your-api-key",
    projectId: "your-project-id",
    environment: "production",
  },
  storage,
);
```

## Offline Mode

Events are automatically saved when the SDK detects offline status:

- **Browser**: Events are stored in IndexedDB
- **Node.js**: Events are stored in `.nexus_cache` directory

When the connection is restored, events are automatically synced:

```typescript
// Browser automatically detects online/offline events
// No additional code needed!

// In Node.js, manage this manually:
process.on("error", async () => {
  await Nexus.flush(); // Send pending events on disconnect
});
```

## Security

The SDK uses HMAC-SHA256 to sign all requests:

1. Events are serialized to JSON
2. Signature is created using: `HMAC-SHA256(json_data, api_key)`
3. Signature and timestamp are sent in request headers

All communication should use HTTPS in production.

## Error Handling

```typescript
import { Nexus } from "nexus-avail";

Nexus.init({
  apiKey: "your-api-key",
  projectId: "your-project-id",
  environment: "production",
}).catch((error) => {
  console.error("Failed to initialize Nexus SDK:", error);
});

try {
  Nexus.track("user_signup", {
    email: "user@example.com",
  });
} catch (error) {
  console.error("Failed to track event:", error);
}
```

## License

MIT

---

**Author:** [iampraiez](https://github.com/iampraiez)  
**Repository:** [commerce_brain](https://github.com/iampraiez/commerce_brain)
