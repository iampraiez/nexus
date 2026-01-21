# Nexus SDK Demo - Next.js Application

An interactive demonstration of the Nexus Analytics SDK showcasing all event types and features.

## Features

- **User Events**: Sign up and login tracking
- **Product Events**: Product views, add/remove from cart
- **Checkout Events**: Checkout initiation and completion
- **Order Events**: Order creation, cancellation, and payment failures
- **Real-time Event Log**: See tracked events as they happen
- **SDK Status**: Monitor initialization and session ID
- **Batch Flushing**: Manual event flushing to the server

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Build the Nexus SDK first:

```bash
cd ../nexus-avail
npm install
npm run build
```

2. Install demo dependencies:

```bash
cd ../nexus-avail-demo
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Configuration

Set these environment variables for production (optional):

```env
NEXT_PUBLIC_NEXUS_API_KEY=your-api-key
NEXT_PUBLIC_NEXUS_PROJECT_ID=your-project-id
```

For development, the app uses demo values that work for testing.

## Using the Demo

### 1. **SDK Status Card**

- Shows initialization status
- Displays current session ID
- Manual flush button to send pending events

### 2. **Event Log**

- Real-time view of all tracked events
- Shows event type and timestamp
- Last 20 events displayed

### 3. **User Events Card**

- Track user signups with email and source
- Track user logins with email
- Customizable signup sources

### 4. **Product Events Card**

- View products from catalog
- Track product views
- Add/remove products from cart with quantities
- Automatic price tracking

### 5. **Checkout Events Card**

- Set custom cart values and item counts
- Track checkout start with cart summary
- Track checkout completion with generated order ID

### 6. **Order Events Card**

- Create orders with custom order ID, user ID, and amount
- Track order cancellations with reasons
- Track payment failures with error messages
- Support for multiple currencies

## Browser Console

Open your browser's developer tools (F12) to see detailed logs:

```
[Demo] Nexus SDK initialized
[Demo] Event tracked: { eventType, data }
[Demo] Events flushed
```

## How the SDK Works

1. **Initialization**: On page load, the SDK is initialized with API key and project ID
2. **Event Tracking**: Each button click tracks an event through the SDK
3. **Batching**: Events are batched (default: 5 events per demo config)
4. **Flushing**: Events are sent when batch size is reached or on manual flush
5. **Offline Mode**: In browser, offline events are stored in IndexedDB
6. **Retry Logic**: Failed requests automatically retry with exponential backoff

## Architecture

```
├── app/
│   ├── page.tsx           # Main demo page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── use-nexus.ts       # Custom hook for SDK
│   └── components/
│       ├── UserDemoCard.tsx
│       ├── ProductDemoCard.tsx
│       ├── CheckoutDemoCard.tsx
│       └── OrderDemoCard.tsx
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Event Flow Example

1. User fills in email in User Events card
2. Clicks "Track user_signup"
3. SDK batches event in memory
4. After 5 events OR 3 seconds, events are flushed to server
5. Event appears in the log
6. Console shows debug information

## Advanced Testing

### Test Offline Mode

1. Open DevTools Network tab
2. Set throttling to "Offline"
3. Track some events
4. Check browser console or IndexedDB for stored events
5. Go back online - events should sync

### Test Batch Behavior

1. Track events rapidly
2. Watch the event log update in real-time
3. Manually click "Flush Events" to force send
4. Console will show "Events sent successfully"

### Test Error Handling

1. Open Network tab
2. Block requests to the API endpoint
3. Track events - they'll be stored offline
4. Reload the page - stored events will be restored

## Deployment

### Deploy to Vercel (Recommended)

```bash
vercel
```

The demo will be available at your Vercel URL.

### Deploy to Other Platforms

Ensure Node.js 18+ is available and use:

```bash
npm run build
npm start
```

## Troubleshooting

### SDK Not Initializing

- Check browser console for error messages
- Verify NEXT_PUBLIC_NEXUS_API_KEY and NEXT_PUBLIC_NEXUS_PROJECT_ID
- Check that the SDK build is up-to-date

### Events Not Appearing in Log

- Check browser console for errors
- Verify the event data matches the schema
- Check network tab for failed requests

### Offline Events Not Syncing

- Check IndexedDB in DevTools (Application > Storage > IndexedDB)
- Ensure you go online and reload the page
- Manual flush with the button should trigger sync

## Resources

- [SDK Documentation](../nexus-avail/README.md)
- [API Reference](../nexus-avail/docs/API.md)
- [Event Schema Reference](../nexus-avail/docs/EVENTS.md)

## License

MIT

---

**Author:** [iampraiez](https://github.com/iampraiez)  
**Repository:** [commerce_brain](https://github.com/iampraiez/commerce_brain)
