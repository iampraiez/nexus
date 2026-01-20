# Pulse - Deployment Guide

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Stripe account for billing features
- SendGrid account for email verification
- Vercel account (optional, for hosting)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pulse

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_ENCRYPTION_KEY=your-32-character-encryption-key-here

# Email Service (SendGrid)
SENDGRID_API_KEY=SG.your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@pulse.app

# Stripe
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Supabase (optional, for additional features)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App URLs
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/verify-email
NEXT_PUBLIC_APP_URL=https://pulse.app
\`\`\`

## Local Development

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Set up MongoDB:
\`\`\`bash
# If using local MongoDB, ensure it's running
# For MongoDB Atlas, use the connection string in .env.local
\`\`\`

3. Initialize the database:
\`\`\`bash
npm run db:init
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

### Step 1: Connect GitHub Repository
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your repository
4. Select the repository and click "Import"

### Step 2: Configure Environment Variables
1. In Vercel project settings, go to "Environment Variables"
2. Add all variables from `.env.local`
3. Make sure `NEXT_PUBLIC_*` variables are set for both Production and Preview

### Step 3: Configure Integrations
1. **MongoDB**: Use MongoDB Atlas connection string
2. **Stripe**: Add your production API keys
3. **SendGrid**: Add your production API key

### Step 4: Deploy
1. Commit and push your changes to main branch
2. Vercel will automatically build and deploy
3. Production URL will be provided after deployment

## Database Migration

To migrate existing data or reset the database:

\`\`\`bash
# Run the initialization script
npm run db:init

# Clear collections (use with caution!)
npm run db:clear
\`\`\`

## Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test user registration and email verification
- [ ] Test Stripe webhook integration
- [ ] Test event ingestion API
- [ ] Monitor MongoDB connection and query performance
- [ ] Set up monitoring and error tracking (optional)
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Enable rate limiting for API endpoints
- [ ] Configure CORS for SDK domains

## Monitoring

### Error Tracking
Consider integrating Sentry for error tracking:
\`\`\`bash
npm install @sentry/nextjs
\`\`\`

### Performance Monitoring
Use Vercel Analytics to monitor:
- API response times
- Database query performance
- Error rates

### Health Checks
Monitor these endpoints:
- `/api/health` - Server health status
- `/api/auth/session` - Authentication service
- `/api/events/ingest` - Event ingestion service

## Troubleshooting

### MongoDB Connection Issues
- Verify connection string in `MONGODB_URI`
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are correct

### Stripe Integration Issues
- Verify API keys are correct
- Check webhook endpoint configuration
- Test webhook with Stripe CLI:
\`\`\`bash
stripe listen --forward-to localhost:3000/api/billing/webhooks
\`\`\`

### Email Verification Not Working
- Verify SendGrid API key is correct
- Check email addresses are correct
- Verify from email domain

## Scaling Considerations

### Database Optimization
- Add indexes for frequently queried fields
- Consider sharding for large datasets
- Use read replicas for reporting queries

### API Rate Limiting
- Implement rate limiting per API key
- Consider caching responses
- Use CDN for static assets

### Event Processing
- Consider message queue (e.g., Redis) for event batching
- Implement background jobs for heavy processing
- Archive old events to cold storage

## Support

For issues or questions:
1. Check the [Documentation](./docs)
2. Review error logs in Vercel
3. Check MongoDB Atlas metrics
4. Consult Stripe and SendGrid documentation
