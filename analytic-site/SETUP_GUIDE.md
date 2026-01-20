# Nexus - Setup Guide

Welcome to **Nexus**, a modern analytics platform for tracking user events and understanding user behavior.

## What's New

### Beautiful Blue Theme
Nexus now features a stunning dark-mode-only theme with a beautiful blue color palette. The design is clean, minimal, and professional.

### App Rebranding
- **Name**: Nexus Analytics
- **Icon**: Modern geometric network design representing data connections
- **Tagline**: "Your events, perfectly tracked"

### Key Features

#### 1. **SendGrid Email Integration**
Send automated emails for alerts, reports, and notifications using SendGrid.

**Setup Instructions:**
1. Get a SendGrid API key from [sendgrid.com](https://sendgrid.com)
2. Add `SENDGRID_API_KEY` to your environment variables
3. (Optional) Set `SENDGRID_FROM_EMAIL` for custom sender email
4. Go to Settings > Email to configure notification preferences

**Environment Variables:**
```
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com (optional)
```

**Using the Email API:**
```bash
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Your Alert",
    "content": "This is your alert message",
    "cta": {
      "text": "View Dashboard",
      "url": "https://yourapp.com/dashboard"
    }
  }'
```

#### 2. **Public Documentation**
Documentation is now accessible to everyone at `/docs` without requiring authentication.

#### 3. **Enhanced UI/UX**
- Rounded header that doesn't touch the edges (padding-based design)
- Improved landing page layout with better content organization
- Gradient branding with blue-to-accent color transitions
- Glassmorphism effects with backdrop blur
- Better visual hierarchy and spacing

#### 4. **GitHub Integration**
Quick links to GitHub profile (iampraiez) and portfolio (iampraiez.vercel.app) throughout the app.

## Project Structure

```
nexus/
├── app/
│   ├── layout.tsx              # Root layout (dark mode forced)
│   ├── page.tsx                # Landing page (redesigned)
│   ├── docs/                   # Public documentation
│   ├── auth/
│   │   ├── login/              # Updated with new design
│   │   ├── register/           # Updated with new design
│   │   └── verify-email/
│   ├── dashboard/              # Protected analytics dashboard
│   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   ├── settings/page.tsx   # Settings (includes email config)
│   │   ├── analytics/
│   │   ├── billing/
│   │   └── ...
│   └── api/
│       ├── auth/               # Authentication endpoints
│       ├── email/send/         # SendGrid email endpoint
│       ├── events/ingest/      # Event tracking endpoint
│       └── ...
├── lib/
│   ├── sendgrid.ts             # SendGrid utilities
│   ├── auth.ts                 # Auth helpers
│   ├── db.ts                   # Database connection
│   └── ...
├── components/
│   └── ui/                     # shadcn/ui components
├── public/
│   └── icon.svg                # New Nexus icon
└── app/globals.css             # Blue theme (dark mode only)
```

## Environment Variables

```env
# Database
DATABASE_URL=your_database_url

# Authentication
JWT_SECRET=your_jwt_secret

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@nexus-analytics.app

# Analytics
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Theme Colors

The new blue theme uses Oklahoma color space (OKLch) for better color perception:

- **Primary Blue**: `oklch(0.55 0.24 256)` - Vibrant, modern blue
- **Accent**: `oklch(0.62 0.2 270)` - Lighter blue accent
- **Background**: `oklch(0.11 0 0)` - Deep dark gray
- **Card**: `oklch(0.14 0.01 250)` - Slightly lighter for cards
- **Muted**: `oklch(0.22 0.01 250)` - For muted text

All colors are optimized for dark mode only.

## API Endpoints

### Email API
- **POST** `/api/email/send` - Send email via SendGrid
  - Requires: `to`, `subject`, `content`
  - Optional: `cta` (call-to-action button)

### Authentication
- **POST** `/api/auth/register` - Create new account
- **POST** `/api/auth/login` - Sign in
- **POST** `/api/auth/logout` - Sign out
- **GET** `/api/auth/session` - Get current session

### Events
- **POST** `/api/events/ingest` - Send tracking events

## Getting Started

1. **Clone and install:**
   ```bash
   git clone <repo>
   cd nexus
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. **Set up database:**
   ```bash
   npm run db:setup
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   ```
   http://localhost:3000
   ```

## Features

- ✅ Dark mode only (no light mode)
- ✅ Beautiful blue theme
- ✅ SendGrid email integration
- ✅ Real-time event tracking
- ✅ User analytics dashboard
- ✅ Funnel analysis
- ✅ Retention tracking
- ✅ SDK health monitoring
- ✅ Alerts and notifications
- ✅ Billing management
- ✅ Team management
- ✅ API key management
- ✅ Public documentation

## SDK Integration

To integrate the Nexus SDK in your application:

```javascript
import { Analytics } from '@nexus/analytics-sdk';

const analytics = new Analytics({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Track events
analytics.track('button_clicked', {
  button_id: 'cta-primary',
  page: 'homepage'
});

// Identify users
analytics.identify('user_123', {
  email: 'user@example.com',
  plan: 'pro'
});
```

## Support

- Documentation: `/docs`
- GitHub: https://github.com/iampraiez
- Portfolio: https://iampraiez.vercel.app

## License

MIT - See LICENSE file for details

---

**Built with love using Next.js 16, React 19, Tailwind CSS v4, and shadcn/ui**
