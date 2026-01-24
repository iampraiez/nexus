# Nexus Analytics Platform

Nexus is a high-performance, production-ready analytics platform designed for modern web applications. It provides real-time event tracking, advanced analytics dashboards, and AI-powered insights.

## 🚀 Features

- **Real-time Event Tracking**: Monitor user behavior as it happens.
- **Advanced Dashboard**: Visualize your data with beautiful, interactive charts.
- **AI Analytics**: Get strategic recommendations and deep insights powered by Gemini 2.0.
- **Project Management**: Manage multiple API projects from a single account.
- **Billing & Plans**: Flexible pricing with support for USD and NGN (Naira) payments via Stripe.
- **Usage Limits**: Built-in usage tracking with automated limits for free and pro tiers.
- **State-of-the-Art UI**: Modern, responsive design with dark mode and glassmorphism.

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Payments**: Stripe (Multi-currency support)
- **AI**: Gemini 2.0 (Google AI SDK)

## 🔧 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB URI
- Stripe Secret Key & Webhook Secret
- Google AI API Key (for Gemini)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd analytic-site
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env` file:
   ```env
   MONGODB_URI=your_mongodb_uri
   STRIPE_SECRET_KEY=your_stripe_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   GOOGLE_AI_API_KEY=your_gemini_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

## 📊 SDK Integration

Nexus provides a dedicated SDK (`nexus-avail`) for easy integration.

```typescript
import { Nexus } from "nexus-avail";

Nexus.init({
  apiKey: "your_api_key",
  projectId: "your_project_id",
  environment: "production"
});

Nexus.track("product_viewed", {
  productId: "123",
  productName: "Nexus Pro"
});
```

## 💳 Billing

Nexus supports global payments:
- **Pro Plan**: $99.00/month
- **Local Support**: ₦14,000.00/month for Nigerian users.

## 📄 License

MIT License
