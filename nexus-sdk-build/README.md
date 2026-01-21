# Nexus SDK - Comprehensive Guide

Welcome to the Nexus SDK, a production-ready TypeScript SDK for the Nexus analytics platform. This SDK is designed to work seamlessly in both Browser and Node.js environments.

**Author:** [iampraiez](https://github.com/iampraiez)  
**Repository:** [commerce_brain](https://github.com/iampraiez/commerce_brain)

## 🌐 Hosted Sites
- **Analytics Dashboard:** [nexus-anal.vercel.app](https://nexus-anal.vercel.app/)
- **E-Commerce Store:** [shop-site-thingy.vercel.app](https://shop-site-thingy.vercel.app/)
- **NPM Package:** [nexus-avail](https://www.npmjs.com/package/nexus-avail)

## 🚀 Quick Start

### Installation

```bash
npm install nexus-avail
```

### Basic Usage

```typescript
import { Nexus } from "nexus-avail";

// 1. Initialize
Nexus.init({
  apiKey: "your-api-key",
  projectId: "your-project-id",
  environment: "production",
});

// 2. Track Events
Nexus.track("user_signup", {
  email: "user@example.com",
  source: "landing-page",
});

// 3. Flush Manually (Optional)
await Nexus.flush();

// 4. Cleanup on Exit
Nexus.destroy();
```

---

## 🏗️ Architecture Overview

The Nexus SDK follows a modular architecture with a singleton entry point:

- **Nexus (Singleton)**: Main entry point for the application.
- **EventTracker**: Manages the lifecycle of events, including queueing and batching.
- **EventQueue**: Handles event buffering and flushing logic.
- **StorageFactory**: Automatically detects the environment and provides the appropriate storage (IndexedDB for Browser, Filesystem for Node.js).
- **HttpTransport**: Handles secure transmission of events with exponential backoff retry logic.
- **SecurityManager**: Manages HMAC-SHA256 signing of requests for data integrity.

---

## 📁 Project Structure

This SDK is part of the [commerce_brain](https://github.com/iampraiez/commerce_brain) monorepo.

```
nexus-sdk-build/
├── nexus-sdk/          # The core SDK package
└── nexus-sdk-demo/     # Next.js demo application
```

---

## 📚 API Reference Summary

### `Nexus.init(config: NexusConfig)`
Initializes the SDK with the provided configuration.

### `Nexus.track(eventType: EventType, data: EventData)`
Tracks an event with the specified type and data. Validated at compile-time with TypeScript.

### `Nexus.flush(): Promise<void>`
Manually flushes the event queue to the server.

### `Nexus.getSessionId(): string | null`
Returns the current session ID.

### `Nexus.destroy(): Promise<void>`
Flushes pending events and cleans up resources.

---

## 📱 Environment Support

The SDK automatically detects its environment:
- **Browser**: Uses `IndexedDB` for offline persistence and `SubtleCrypto` for signing.
- **Node.js**: Uses the filesystem for offline persistence and the `crypto` module for signing.

> [!NOTE]
> For Node.js versions < 18, a `fetch` polyfill (like `node-fetch`) is required.

---

## 📖 Detailed Documentation

For more detailed information, please refer to:
- [API Reference](file:///home/praise-olaoye/Documents/VS%20Code/e-commerce-app-build/nexus-sdk-build/nexus-sdk/docs/API.md)
- [Event Schemas](file:///home/praise-olaoye/Documents/VS%20Code/e-commerce-app-build/nexus-sdk-build/nexus-sdk/docs/EVENTS.md)
