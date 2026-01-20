# Pulse - Quick Reference Guide

## Project URLs
- **Local Dev**: http://localhost:3000
- **Landing Page**: `/`
- **Dashboard**: `/dashboard` (requires login)
- **API Base**: `/api`

## File Locations

### Pages & Routes
| Feature | File Path |
|---------|-----------|
| Landing Page | `/app/page.tsx` |
| Dashboard | `/app/dashboard/page.tsx` |
| Login | `/app/auth/login/page.tsx` |
| Register | `/app/auth/register/page.tsx` |
| Email Verify | `/app/auth/verify-email/page.tsx` |
| Projects | `/app/dashboard/projects/page.tsx` |
| Analytics Hub | `/app/dashboard/analytics/page.tsx` |
| Events | `/app/dashboard/analytics/events/page.tsx` |
| Users | `/app/dashboard/analytics/users/page.tsx` |
| Funnels | `/app/dashboard/analytics/funnels/page.tsx` |
| Retention | `/app/dashboard/analytics/retention/page.tsx` |
| SDK Health | `/app/dashboard/analytics/sdk-health/page.tsx` |
| Alerts | `/app/dashboard/alerts/page.tsx` |
| Billing | `/app/dashboard/billing/page.tsx` |
| Settings | `/app/dashboard/settings/page.tsx` |
| Docs | `/app/dashboard/docs/page.tsx` |

### API Routes
| Endpoint | Method | File Path |
|----------|--------|-----------|
| Register | POST | `/app/api/auth/register/route.ts` |
| Login | POST | `/app/api/auth/login/route.ts` |
| Verify Email | POST | `/app/api/auth/verify-email/route.ts` |
| Logout | POST | `/app/api/auth/logout/route.ts` |
| Session | GET | `/app/api/auth/session/route.ts` |
| Ingest Events | POST | `/app/api/events/ingest/route.ts` |
| Projects | GET/POST | `/app/api/projects/route.ts` |
| API Keys | GET/POST | `/app/api/projects/[projectId]/api-keys/route.ts` |
| Stripe Checkout | POST | `/app/api/billing/create-checkout/route.ts` |
| Subscription | GET/PATCH | `/app/api/billing/subscription/route.ts` |
| Webhooks | POST | `/app/api/billing/webhooks/route.ts` |

## Database Collections

\`\`\`javascript
// MongoDB Collections
db.companies              // User companies/organizations
db.users                  // User accounts
db.projects               // Analytics projects
db.api_keys               // API keys for projects
db.events                 // Raw events
db.event_summaries        // Aggregated event data
db.user_profiles          // User metadata
db.funnels                // Funnel definitions
db.alerts                 // Alert configurations
db.subscriptions          // Stripe subscriptions
\`\`\`

## Key TypeScript Types

Location: `/lib/types.ts`

\`\`\`typescript
// Core Types
interface Company { }
interface User { }
interface Project { }
interface ApiKey { }
interface Event { }
interface UserProfile { }
interface Funnel { }
interface Alert { }
interface Subscription { }
\`\`\`

## Environment Variables Quick List

**Required:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret (min 32 chars)
- `SESSION_ENCRYPTION_KEY` - Session encryption (32 chars)

**Optional:**
- `STRIPE_SECRET_KEY` - Stripe API key
- `SENDGRID_API_KEY` - SendGrid API key
- `NEXT_PUBLIC_APP_URL` - Application URL
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key

See `.env.example` for full list.

## Common Commands

\`\`\`bash
# Development
npm run dev              # Start dev server (port 3000)
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:init          # Initialize DB collections and indexes

# Code Quality
npm run type-check       # Check TypeScript types
npm run lint             # Run ESLint

# Testing
npm test                 # Run test suite
\`\`\`

## SDK Quick Start

\`\`\`typescript
// Initialize
const analytics = new Analytics({
  apiKey: 'pk_live_xxxxx',
  apiUrl: '/api/events/ingest'
});

// Track event
analytics.track('event_name', { property: 'value' });

// Identify user
analytics.identify('user_id', { email: 'user@example.com' });

// Page view
analytics.page('/path');

// Capture error
analytics.captureError(error);

// Flush events
await analytics.flush();
\`\`\`

## API Request Examples

### Register User
\`\`\`bash
POST /api/auth/register
{
  "company_name": "Acme Inc",
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

### Login User
\`\`\`bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

### Track Events
\`\`\`bash
POST /api/events/ingest
Authorization: Bearer pk_live_xxxxx
{
  "events": [
    {
      "name": "page_view",
      "user_id": "user_123",
      "properties": { "page": "/" }
    }
  ]
}
\`\`\`

### Create Project
\`\`\`bash
POST /api/projects
{
  "name": "My Project",
  "description": "My app"
}
\`\`\`

### Generate API Key
\`\`\`bash
POST /api/projects/{projectId}/api-keys
{
  "name": "Production Key"
}
\`\`\`

## Debug Logging

Add console logs with `[v0]` prefix:
\`\`\`typescript
console.log('[v0] Debug message:', data);
\`\`\`

Logs visible in:
- Browser console (Network/Application issues)
- Server terminal (API/Database issues)
- Vercel logs (Production)

## Common Error Solutions

| Error | Solution |
|-------|----------|
| `MongoDB connection failed` | Check `MONGODB_URI`, ensure MongoDB running |
| `JWT secret not found` | Add `JWT_SECRET` to `.env.local` |
| `Invalid API key` | Verify key exists in database, correct format |
| `CORS error` | Check API CORS headers in route handler |
| `Email not verified` | Check SendGrid API key, verify code sent |
| `Port 3000 in use` | `lsof -ti:3000 \| xargs kill -9` |
| `Module not found` | Run `npm install`, check import paths |

## Documentation Files

- **README.md** - Main project documentation
- **GETTING_STARTED.md** - Quick start guide
- **DEVELOPMENT.md** - Development setup guide
- **DEPLOYMENT.md** - Production deployment guide
- **PROJECT_SUMMARY.md** - Architecture overview
- **QUICK_REFERENCE.md** - This file

## Development Workflow

\`\`\`bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes
# Edit files, test locally with npm run dev

# 3. Commit changes
git add .
git commit -m "feat: add my feature"

# 4. Push to GitHub
git push origin feature/my-feature

# 5. Create Pull Request
# GitHub will show PR creation option

# 6. Review and merge
# After approval, merge to main

# 7. Automatic deployment
# Vercel will auto-build and deploy
\`\`\`

## Useful Links

- **Next.js Docs**: https://nextjs.org/docs
- **MongoDB Docs**: https://docs.mongodb.com
- **Stripe Docs**: https://stripe.com/docs
- **Tailwind CSS**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com
- **TypeScript**: https://www.typescriptlang.org

## Performance Tips

1. **Database**: Use indexes for frequently queried fields
2. **API**: Implement caching with response headers
3. **Frontend**: Use dynamic imports for code splitting
4. **Images**: Use `next/image` for optimization
5. **Monitoring**: Check Vercel Analytics dashboard

## Security Checklist

- [ ] JWT_SECRET is strong (32+ chars)
- [ ] Session encryption key is strong (32 chars)
- [ ] CORS is properly configured
- [ ] API keys are rotated regularly
- [ ] Rate limiting is enabled
- [ ] HTTPS enforced in production
- [ ] Sensitive data is encrypted
- [ ] SQL injection protection enabled
- [ ] XSS protection enabled
- [ ] CSRF protection enabled

## Testing Checklist

- [ ] User registration works
- [ ] Email verification works
- [ ] Login/logout works
- [ ] Protected routes require auth
- [ ] API keys are generated correctly
- [ ] Events are ingested
- [ ] Analytics display data
- [ ] Stripe integration works (test mode)
- [ ] Settings are saved
- [ ] Alerts are configured

## Deployment Checklist

- [ ] All environment variables set
- [ ] MongoDB Atlas configured
- [ ] Stripe production keys added
- [ ] SendGrid production key added
- [ ] Database indexes created
- [ ] Email templates configured
- [ ] Webhook endpoints configured
- [ ] CDN configured
- [ ] SSL certificate installed
- [ ] Monitoring enabled

## Quick Fixes

### Clear Development Cache
\`\`\`bash
rm -rf .next
npm run dev
\`\`\`

### Reset Database
\`\`\`bash
# Delete all MongoDB collections and reinitialize
npm run db:init
\`\`\`

### Fix TypeScript Errors
\`\`\`bash
npm run type-check
# Review and fix errors
\`\`\`

### Check Current Branches
\`\`\`bash
git branch -a
\`\`\`

## Key Code Patterns

### Protected API Route
\`\`\`typescript
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const user = await requireAuth(request);
  // Your code here
}
\`\`\`

### Database Operation
\`\`\`typescript
const db = await getDb();
const result = await db.collection('myCollection').findOne({ _id });
\`\`\`

### Component with Data Fetching
\`\`\`typescript
'use client';
import useSWR from 'swr';

export function MyComponent() {
  const { data, loading } = useSWR('/api/data');
  // Your code here
}
\`\`\`

## Monitoring

- **Vercel Dashboard**: Project analytics and deployment logs
- **MongoDB Atlas**: Database metrics and alerts
- **Stripe Dashboard**: Payment and subscription metrics
- **Browser Console**: Client-side errors and logs

Remember: Always test locally before deploying to production!
