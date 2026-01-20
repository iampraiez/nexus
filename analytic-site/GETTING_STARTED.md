# Pulse - Getting Started Guide

Welcome to Pulse! This guide will help you get up and running with the analytics platform.

## Quick Start (5 minutes)

### 1. Clone and Install
\`\`\`bash
git clone https://github.com/your-org/pulse.git
cd pulse
npm install
\`\`\`

### 2. Setup Environment
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with test values
\`\`\`

### 3. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

### 4. Open Application
Visit [http://localhost:3000](http://localhost:3000)

### 5. Create Account
- Go to `/auth/register`
- Enter company name, email, and password
- Verify your email with the 6-digit code
- Login and explore the dashboard

## First Steps

### 1. Create a Project
- Go to **Projects** in the dashboard
- Click "Create New Project"
- Enter project name and description
- Copy the generated API key

### 2. Start Sending Events
Using the JavaScript SDK:
\`\`\`typescript
// In your application
import { Analytics } from '@/public/sdk/analytics';

const analytics = new Analytics({
  apiKey: 'pk_live_your_key_here',
  apiUrl: 'http://localhost:3000/api/events/ingest'
});

// Track events
analytics.track('user_signup', {
  plan: 'pro',
  email: 'user@example.com'
});

analytics.identify('user_123', {
  plan: 'pro'
});
\`\`\`

### 3. View Analytics
- Go to **Analytics** → **Events**
- See real-time event data
- View charts and statistics
- Explore user behavior

## Explore Features

### Analytics Dashboards
- **Events**: Track and analyze user events
- **Users**: User growth and cohort analysis
- **Funnels**: Conversion funnel analysis
- **Retention**: User retention cohorts
- **SDK Health**: Monitor SDK performance

### Project Management
- **Projects**: Create and manage multiple apps
- **API Keys**: Generate and rotate API keys
- **Webhooks**: Custom webhook integration

### Account Management
- **Billing**: Manage subscription and usage
- **Settings**: Account and security settings
- **Alerts**: Configure notifications
- **Documentation**: API docs and examples

## Common Tasks

### Generate an API Key
1. Go to **Projects**
2. Select your project
3. Click "Generate New API Key"
4. Copy the key (starts with `pk_`)
5. Use in your SDK initialization

### Track a Custom Event
\`\`\`typescript
analytics.track('custom_event', {
  custom_field: 'value',
  number_field: 42,
  boolean_field: true
});
\`\`\`

### Identify a User
\`\`\`typescript
analytics.identify('unique_user_id', {
  email: 'user@example.com',
  name: 'John Doe',
  plan: 'premium'
});
\`\`\`

### View User's Events
1. Go to **Analytics** → **Users**
2. Find the user by ID or email
3. Click to view their events
4. Analyze their behavior

### Create a Funnel
1. Go to **Analytics** → **Funnels**
2. Click "Create Funnel"
3. Select conversion steps
4. Set time window
5. View conversion rates

### Setup Alerts
1. Go to **Alerts**
2. Click "Create Alert"
3. Select trigger (e.g., high error rate)
4. Choose notification method (email/webhook)
5. Set alert name

### Manage Team
1. Go to **Settings**
2. Go to **Team** tab
3. Click "Invite Team Member"
4. Enter team member email
5. Set role and permissions

### View API Documentation
1. Go to **Docs** in dashboard
2. Browse API endpoints
3. View SDK documentation
4. Find integration examples

## Environment Variables

### Required for Development
\`\`\`
MONGODB_URI=mongodb://localhost:27017/pulse
JWT_SECRET=dev-secret-key
SESSION_ENCRYPTION_KEY=dev-encryption-key-32-chars
\`\`\`

### Optional for Full Features
\`\`\`
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

See [.env.example](./.env.example) for all variables.

## Project Files You Should Know

### Key Directories
- `/app` - All pages and API routes
- `/lib` - Utilities and database code
- `/components` - React components
- `/public/sdk` - JavaScript SDK
- `/scripts` - Database initialization

### Important Files
- `README.md` - Project overview
- `DEPLOYMENT.md` - Production deployment
- `DEVELOPMENT.md` - Development guide
- `PROJECT_SUMMARY.md` - Architecture details
- `.env.example` - Environment template

## Testing the Platform

### Test Authentication Flow
1. Register at `/auth/register`
2. Check browser console for verification code
3. Verify email at `/auth/verify-email`
4. Login at `/auth/login`

### Test Event Tracking
1. Create a project
2. Copy the API key
3. Open `/public/sdk/example.html` in browser
4. Open browser console
5. Check the dashboard for new events

### Test Billing (with test keys)
1. Go to **Billing**
2. Use Stripe test card: `4242 4242 4242 4242`
3. Any future date and any CVC
4. Complete payment
5. Verify subscription in settings

## Available Commands

\`\`\`bash
# Development
npm run dev              # Start development server

# Production
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:init          # Initialize database collections and indexes

# Type checking
npm run type-check       # Check TypeScript types

# Linting
npm run lint             # Run ESLint
\`\`\`

## Troubleshooting

### Port Already in Use
\`\`\`bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
npm run dev
\`\`\`

### Database Connection Failed
- Ensure MongoDB is running
- Check `MONGODB_URI` format
- Verify connection string is correct

### Email Verification Not Working
- Check `/app/api/auth/register` console logs
- Verify `SENDGRID_API_KEY` is set
- Use test code from console in development

### API Key Not Working
- Ensure API key format: `pk_live_` or `pk_test_`
- Check project exists in database
- Verify key hasn't been deleted

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 16 (React 19)
- **Database**: MongoDB
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Payments**: Stripe
- **Email**: SendGrid
- **Language**: TypeScript

### Data Flow
1. Client sends events via SDK
2. SDK batches and sends to `/api/events/ingest`
3. Server validates and stores in MongoDB
4. Frontend queries `/api/analytics/*` for data
5. Dashboards display real-time analytics

### Authentication Flow
1. User registers at `/auth/register`
2. Email verification code sent
3. User verifies at `/auth/verify-email`
4. User logs in at `/auth/login`
5. Session cookie created
6. Protected pages check session

## Next Steps

1. **Read the Documentation**
   - [README.md](./README.md) - Full project documentation
   - [DEVELOPMENT.md](./DEVELOPMENT.md) - Development setup
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment

2. **Explore the Code**
   - Start with `/app/page.tsx` (landing page)
   - Check `/app/dashboard/page.tsx` (dashboard)
   - Review `/lib/db.ts` (database utilities)

3. **Integrate the SDK**
   - Add SDK to your application
   - Start tracking events
   - View analytics in real-time

4. **Setup Production**
   - Add real Stripe API keys
   - Setup SendGrid email
   - Configure MongoDB Atlas
   - Deploy to Vercel

5. **Invite Your Team**
   - Go to Settings → Team
   - Invite team members
   - Assign roles and permissions

## Support Resources

### Documentation
- API docs: `/dashboard/docs`
- SDK docs: `/public/sdk/README.md`
- Project guide: `PROJECT_SUMMARY.md`

### Development
- Development guide: `DEVELOPMENT.md`
- Deployment guide: `DEPLOYMENT.md`
- This file: `GETTING_STARTED.md`

### Getting Help
1. Check the relevant documentation file
2. Review error messages in browser console
3. Check MongoDB logs for database errors
4. Review API response in Network tab

## Tips for Success

### SDK Integration
- Start with simple page views
- Add custom events as needed
- Use `identify()` for user data
- Test with browser console logs

### Analytics
- Create funnels for key conversions
- Monitor retention over time
- Set up alerts for anomalies
- Export data for reporting

### Operations
- Regularly check billing usage
- Monitor SDK health metrics
- Review team access logs
- Update security settings

## What's Included

- ✅ Complete authentication system
- ✅ Real-time event tracking
- ✅ 5 advanced analytics dashboards
- ✅ Project and API key management
- ✅ Stripe billing integration
- ✅ Alert and webhook system
- ✅ Team and permissions management
- ✅ Comprehensive documentation
- ✅ Production-ready TypeScript code
- ✅ Mobile-responsive design

## Ready to Deploy?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions to deploy to Vercel, configure production databases, and setup Stripe.

Happy tracking with Pulse!
