# Nexus Analytics SDK - Complete Project

A production-ready TypeScript SDK for the Nexus analytics platform with proper OOP architecture, modular design, and comprehensive documentation.

## 📦 What's Included

### 1. **nexus-avail** - Standalone npm Package

A fully-featured analytics SDK featuring:

- ✅ Type-safe event tracking with schema validation
- ✅ Automatic event batching (configurable)
- ✅ Offline persistence (IndexedDB in browser, filesystem in Node.js)
- ✅ Exponential backoff retry logic
- ✅ HMAC-SHA256 request signing
- ✅ Browser and Node.js support
- ✅ ESM and CommonJS outputs
- ✅ Zero external dependencies

**10 Supported Event Types:**
`user_signup`, `user_login`, `product_viewed`, `product_added_to_cart`, `product_removed_from_cart`, `checkout_started`, `checkout_completed`, `order_created`, `order_cancelled`, `payment_failed`

### 2. **nexus-avail-demo** - Interactive Next.js Application

An interactive demonstration showcasing:

- Real-time event tracking with live logs
- All event types demonstrated
- Responsive UI with modern design
- Form inputs for all event configurations
- SDK status monitoring
- Manual event flushing

### 3. **Comprehensive Documentation**

- 📖 API Reference (API.md)
- 📋 Event Schema Guide (EVENTS.md)
- 🏗️ Architecture Overview (ARCHITECTURE.md)
- 📚 Project Structure Guide (PROJECT_STRUCTURE.md)
- 🚀 Quick Start Guide (QUICK_START.md)
- 📄 Implementation Summary (IMPLEMENTATION_SUMMARY.md)

---

## 🚀 Quick Start

### 1. Build the SDK

```bash
cd nexus-avail
npm install
npm run build
```

### 2. Run the Demo

```bash
cd ../nexus-avail-demo
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Install in Your Project

```bash
npm install nexus-avail
```

```typescript
import { Nexus } from "nexus-avail";

Nexus.init({
  apiKey: "your-api-key",
  projectId: "your-project-id",
  environment: "production",
});

Nexus.track("user_signup", {
  email: "user@example.com",
  source: "landing-page",
});
```

---

## 📚 Documentation Index

| Document                       | Purpose                       |
| ------------------------------ | ----------------------------- |
| **QUICK_START.md**             | Get started in 5 minutes      |
| **nexus-avail/README.md**      | SDK package documentation     |
| **nexus-avail/docs/API.md**    | Complete API reference        |
| **nexus-avail/docs/EVENTS.md** | Event schema reference        |
| **nexus-avail-demo/README.md** | Demo app documentation        |
| **PROJECT_STRUCTURE.md**       | Complete project architecture |
| **ARCHITECTURE.md**            | System design and data flow   |
| **IMPLEMENTATION_SUMMARY.md**  | Overview of what was built    |

---

## 🎯 Core Features

### Type Safety

```typescript
// Full TypeScript support with compile-time validation
Nexus.track("order_created", {
  orderId: "order-123", // ✓ Required
  userId: "user-456", // ✓ Required
  amount: 99.99, // ✓ Required
  currency: "USD", // ✓ Required
  items: [{ productId: "prod-789", qty: 1 }],
});
```

### Automatic Batching

```typescript
// Events are automatically batched and sent:
// - When 10 events collected (default)
// - Every 2 seconds (default)
// - Configurable batch size and interval
```

### Offline Mode

```typescript
// Browser: Stored in IndexedDB
// Node.js: Stored in .nexus_cache/
// Automatically syncs when online
```

### Security

```typescript
// All requests are HMAC-SHA256 signed
// Includes timestamp validation
// API key validation on init
```

### Error Handling

```typescript
// Exponential backoff retry logic
// Failed events saved to offline storage
// Clear error messages and logging
```

---

## 🏗️ Architecture Highlights

### SOLID Principles

- ✅ **Single Responsibility** - Each class has one reason to change
- ✅ **Open/Closed** - Open for extension, closed for modification
- ✅ **Liskov Substitution** - Interfaces properly implemented
- ✅ **Interface Segregation** - No fat interfaces
- ✅ **Dependency Injection** - Constructor injection of dependencies

### Design Patterns

- ✅ **Singleton Pattern** - Single Nexus instance
- ✅ **Factory Pattern** - Storage backend factory
- ✅ **Strategy Pattern** - Different storage/transport strategies
- ✅ **Observer Pattern** - Online/offline detection

### Modular Structure

```
nexus-avail/src/
├── core/          # Core classes (tracking, batching, logging)
├── storage/       # Storage implementations (browser, Node)
├── transport/     # Network transport with retries
└── types/         # Type definitions and interfaces
```

---

## 📊 Project Statistics

- **Total Files**: 30+
- **SDK Code**: 1000+ lines
- **Demo Code**: 900+ lines
- **Documentation**: 2700+ lines
- **Type Definitions**: 25+
- **Interfaces**: 5
- **Design Patterns**: 4
- **Zero Dependencies**: ✅

---

## 🔑 Key Classes

### NexusSDK (Singleton)

Main entry point with static methods:

- `init(config)` - Initialize SDK
- `track(event, data)` - Track events
- `flush()` - Send pending events
- `getSessionId()` - Get session ID
- `destroy()` - Cleanup

### EventTracker

Core event tracking logic:

- Event validation
- Queue management
- Offline persistence
- Session management

### EventQueue

Intelligent batching:

- Size-based flushing (10 events)
- Time-based flushing (2 seconds)
- Error recovery
- Queue management

### Storage Layer

Dual implementation:

- **BrowserStorage** - IndexedDB
- **NodeStorage** - Filesystem
- **StorageFactory** - Auto-detection

### Transport Layer

Network handling:

- **HttpTransport** - HTTP POST requests
- Exponential backoff retries
- Signature and timestamp headers
- Error handling

### Security

Cryptographic signing:

- HMAC-SHA256 (SubtleCrypto in browser)
- Node.js crypto module
- API key validation
- Timestamp generation

---

## 🎨 Demo App Features

### User Interface

- Modern gradient design
- Responsive layout (mobile/tablet/desktop)
- Real-time event logging
- SDK status monitoring
- Form inputs for all event types

### Interactive Components

- **UserDemoCard** - User signup/login
- **ProductDemoCard** - Product events
- **CheckoutDemoCard** - Checkout flow
- **OrderDemoCard** - Order management

### Development Tools

- Browser console logging
- Live JSON request preview
- Event log with timestamps
- Manual flush button
- Session ID display

---

## 📝 Event Types

### User Events

- `user_signup` - Email + source
- `user_login` - Email only

### Product Events

- `product_viewed` - Product ID, name, category
- `product_added_to_cart` - Product ID, quantity, price
- `product_removed_from_cart` - Product ID, quantity

### Checkout Events

- `checkout_started` - Cart value, item count
- `checkout_completed` - Order ID, cart value

### Order Events

- `order_created` - Order ID, user ID, amount, currency, items
- `order_cancelled` - Order ID, reason
- `payment_failed` - Order ID, error message

---

## 🛠️ Technology Stack

### SDK

- **Language**: TypeScript 5.0+
- **Runtime**: Node.js 14+ / Modern Browsers
- **Storage**: IndexedDB / Filesystem
- **Crypto**: SubtleCrypto / Node.js crypto
- **Dependencies**: None ✅

### Demo App

- **Framework**: Next.js 15.0+
- **UI**: React 19.0+
- **Styling**: Custom CSS
- **State**: React hooks
- **Language**: TypeScript 5.0+

---

## 🚢 Publishing

To publish the SDK to npm:

```bash
cd nexus-avail
npm run build
npm publish --access public
```

Users can then install:

```bash
npm install nexus-avail
```

---

## 📖 Documentation

### Getting Started

Start with **QUICK_START.md** for a 5-minute setup guide.

### Complete Reference

- **API.md** - All methods, parameters, and examples
- **EVENTS.md** - Event schemas and examples
- **PROJECT_STRUCTURE.md** - Complete architecture guide
- **ARCHITECTURE.md** - System design and data flow

### Implementation Details

- **IMPLEMENTATION_SUMMARY.md** - Overview of what was built
- Inline code comments and JSDoc throughout

---

## 🧪 Testing the SDK

### Using the Demo App

1. Run demo: `cd nexus-avail-demo && npm run dev`
2. Open http://localhost:3000
3. Track events using the UI
4. Check browser console for logs
5. Click "Flush Events" to send
6. Inspect DevTools Network tab for requests

### Browser DevTools

- **Console** - Debug logs and errors
- **Network** - HTTP requests to API
- **Application > Storage > IndexedDB** - Offline events
- **Application > Cookies** - Session tracking

### Node.js Testing

```typescript
import { Nexus } from "nexus-avail";

Nexus.init({
  apiKey: "test-key",
  projectId: "test-project",
  environment: "development",
});

// Track events
Nexus.track("order_created", {
  /* ... */
});

// Check .nexus_cache/ directory for offline files
// Flush before exit
await Nexus.flush();
```

---

## ✨ Code Quality

### Type Safety

- Strict TypeScript mode enabled
- Full type coverage
- Compile-time validation
- IntelliSense support

### Error Handling

- Input validation
- Descriptive error messages
- Graceful degradation
- Offline fallback

### Performance

- Event batching (configurable)
- Minimal memory footprint
- No external dependencies
- Async operations where needed

### Maintainability

- Single responsibility per class
- Clear naming conventions
- Comprehensive documentation
- Modular structure

---

## 🎯 What's Included in the Box

### Complete Package

✅ Production-ready code
✅ Comprehensive documentation
✅ Interactive demo application
✅ Type definitions included
✅ Build configuration
✅ Example implementations
✅ Error handling
✅ Security features

### Not Included

❌ Backend API server (that's your job)
❌ Analytics dashboard (separate project)
❌ User authentication (use your own)
❌ Third-party integrations (can be added)

---

## 🔐 Security

### Built-in Security Features

- HMAC-SHA256 request signing
- Timestamp validation to prevent replay attacks
- API key validation on initialization
- HTTPS recommended for production
- No sensitive user data stored in SDK

### Best Practices

- Keep API keys in environment variables
- Use production environment flag
- Validate events on server side
- Use HTTPS exclusively
- Rotate API keys regularly

---

## 📞 Support Resources

1. **Quick Questions** - Check QUICK_START.md
2. **API Details** - See nexus-avail/docs/API.md
3. **Event Schemas** - See nexus-avail/docs/EVENTS.md
4. **Architecture** - See ARCHITECTURE.md
5. **Setup Issues** - Check PROJECT_STRUCTURE.md
6. **Code Examples** - See demo app in nexus-avail-demo/

---

## 📋 File Manifest

```
/ (root)
├── nexus-avail/                    # SDK Package
│   ├── src/                      # TypeScript source
│   ├── dist/                     # Compiled output
│   ├── docs/                     # API & Event docs
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── nexus-avail-demo/               # Demo App
│   ├── app/                      # Next.js app
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── README.md
│
├── README.md                      # This file
├── QUICK_START.md                 # Quick start guide
├── ARCHITECTURE.md                # System architecture
├── PROJECT_STRUCTURE.md           # Project details
├── IMPLEMENTATION_SUMMARY.md      # Build summary
└── .gitignore
```

---

## 🎉 Get Started

### Step 1: Build the SDK

```bash
cd nexus-avail && npm install && npm run build
```

### Step 2: Run the Demo

```bash
cd ../nexus-avail-demo && npm install && npm run dev
```

### Step 3: Explore

Open http://localhost:3000 and start tracking events!

### Step 4: Integrate

Install in your project and follow the API docs.

---

## 📄 License

MIT - See individual packages for details.

---

## 🏆 Summary

This is a **complete, production-ready TypeScript SDK** with:

- ✅ Professional OOP architecture
- ✅ Comprehensive type safety
- ✅ Modular and extensible design
- ✅ Zero external dependencies
- ✅ Dual environment support
- ✅ Complete offline functionality
- ✅ Secure request signing
- ✅ Intelligent event batching
- ✅ Robust error handling
- ✅ Interactive demo application
- ✅ 2700+ lines of documentation
- ✅ Ready to use and publish

**Everything you need to add analytics to your application.**

---

**Built with best practices and production-ready standards** 🚀
