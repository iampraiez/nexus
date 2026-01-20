# Pulse - Development Guide

## Development Environment Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Initial Setup

1. Clone and install:
\`\`\`bash
git clone https://github.com/your-org/pulse.git
cd pulse
npm install
\`\`\`

2. Create development environment file:
\`\`\`bash
cp .env.example .env.local
\`\`\`

3. Configure local environment variables:
\`\`\`env
# MongoDB (local)
MONGODB_URI=mongodb://localhost:27017/pulse

# Development keys (use fake values for local development)
JWT_SECRET=dev-secret-key-change-in-production
SESSION_ENCRYPTION_KEY=dev-key-32-characters-long-here
STRIPE_SECRET_KEY=sk_test_local_development
SENDGRID_API_KEY=SG_test_key_local
\`\`\`

4. Start development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure Guide

### `/app` - Next.js App Router
Contains all pages and API routes organized by feature.

\`\`\`
app/
├── api/                    # API endpoints (route handlers)
│   ├── auth/              # Auth endpoints (/api/auth/*)
│   ├── events/            # Event tracking (/api/events/*)
│   ├── projects/          # Project CRUD (/api/projects/*)
│   └── billing/           # Stripe integration (/api/billing/*)
├── auth/                  # Auth pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── verify-email/      # Email verification
├── dashboard/             # Protected dashboard pages
│   ├── layout.tsx         # Dashboard wrapper
│   ├── page.tsx           # Overview page
│   ├── projects/          # Project management
│   ├── analytics/         # Analytics dashboards
│   ├── billing/           # Billing page
│   ├── alerts/            # Alert configuration
│   ├── settings/          # Account settings
│   └── docs/              # Documentation pages
├── page.tsx               # Landing page (/)
└── layout.tsx             # Root layout
\`\`\`

### `/lib` - Utilities and Business Logic

\`\`\`
lib/
├── db.ts                  # MongoDB connection and utilities
├── auth.ts                # Authentication utilities
├── crypto.ts              # Password hashing, encryption
├── types.ts               # TypeScript type definitions
├── validation.ts          # Input validation functions
├── api-response.ts        # Standardized API responses
└── stripe.ts              # Stripe integration utilities
\`\`\`

### `/components` - Reusable React Components

\`\`\`
components/
├── ui/                    # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ... (other UI components)
├── app-logo.tsx           # Custom app logo
└── ... (feature-specific components)
\`\`\`

### `/public` - Static Assets and SDK

\`\`\`
public/
├── sdk/                   # JavaScript SDK
│   ├── analytics.ts       # SDK implementation
│   ├── example.html       # Usage example
│   └── README.md          # SDK documentation
├── icon.svg               # App icon
└── ... (other static files)
\`\`\`

### `/scripts` - Database and Utility Scripts

\`\`\`
scripts/
└── init-db.ts             # Initialize database collections and indexes
\`\`\`

## Code Style and Standards

### TypeScript
- Always use TypeScript for type safety
- Define interfaces for data structures
- Use strict mode in tsconfig.json

### Component Structure
\`\`\`typescript
// Always use 'use client' for client components
'use client';

import { useState } from 'react';
import type { ComponentProps } from 'react';

interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export function MyComponent({ title, onClick }: MyComponentProps) {
  const [state, setState] = useState<string>('');
  
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onClick}>Click me</button>
    </div>
  );
}
\`\`\`

### API Route Structure
\`\`\`typescript
import { NextRequest, NextResponse } from 'next/server';
import { validateInput } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateInput(body, schema);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      );
    }

    // Process request
    const result = await processRequest(body);

    // Return response
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
\`\`\`

### Naming Conventions
- Files: kebab-case (`my-component.tsx`)
- Components: PascalCase (`MyComponent`)
- Variables/functions: camelCase (`myVariable`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- Types/Interfaces: PascalCase (`UserType`)

## Common Development Tasks

### Adding a New API Endpoint

1. Create route file:
\`\`\`typescript
// app/api/feature/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Implementation
  return NextResponse.json({ data: {} });
}
\`\`\`

2. Add validation schema:
\`\`\`typescript
// lib/validation.ts - add to schemas
export const featureSchema = {
  // Define validation rules
};
\`\`\`

3. Test the endpoint:
\`\`\`bash
curl http://localhost:3000/api/feature
\`\`\`

### Adding a New Database Model

1. Define type in `/lib/types.ts`:
\`\`\`typescript
export interface MyModel {
  _id?: ObjectId;
  name: string;
  createdAt: Date;
}
\`\`\`

2. Create index in `/scripts/init-db.ts`:
\`\`\`typescript
await db.collection('mymodels').createIndex({ name: 1 });
\`\`\`

3. Add helper functions in `/lib/db.ts`:
\`\`\`typescript
export async function createMyModel(data: MyModel) {
  const db = await getDb();
  return db.collection('mymodels').insertOne(data);
}
\`\`\`

### Adding a New Dashboard Page

1. Create the page component:
\`\`\`typescript
// app/dashboard/feature/page.tsx
'use client';

export default function FeaturePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Feature</h1>
      {/* Page content */}
    </div>
  );
}
\`\`\`

2. Add navigation item in `/app/dashboard/layout.tsx`

3. Create API endpoints as needed

## Database Management

### Connecting to MongoDB

Using MongoDB Compass:
1. Copy `MONGODB_URI` from `.env.local`
2. Open MongoDB Compass
3. Paste connection string
4. Browse collections

### Running Database Migrations

\`\`\`bash
# Initialize all collections and indexes
npm run db:init

# Or run manually
npx ts-node scripts/init-db.ts
\`\`\`

### Common MongoDB Commands

\`\`\`typescript
// In your code
const db = await getDb();

// Insert
await db.collection('users').insertOne({ name: 'John' });

// Query
const user = await db.collection('users').findOne({ _id: id });

// Update
await db.collection('users').updateOne({ _id: id }, { $set: { name: 'Jane' } });

// Delete
await db.collection('users').deleteOne({ _id: id });
\`\`\`

## Testing

### Manual Testing Checklist

- [ ] User registration works
- [ ] Email verification works
- [ ] Login/logout flow works
- [ ] Protected routes require auth
- [ ] API keys can be created
- [ ] Events are properly ingested
- [ ] Analytics display correct data
- [ ] Stripe integration works (use test keys)
- [ ] Settings pages work
- [ ] Alerts can be created

### Testing with cURL

\`\`\`bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password","company_name":"Test"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Create project
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{"name":"My Project"}'
\`\`\`

## Debugging

### Enable Debug Logging
Add console.log statements with `[v0]` prefix:
\`\`\`typescript
console.log('[v0] Debug message:', variable);
\`\`\`

### Check MongoDB
\`\`\`typescript
// Log database operations
const db = await getDb();
const collections = await db.listCollections().toArray();
console.log('[v0] Collections:', collections);
\`\`\`

### Browser DevTools
- F12 to open developer tools
- Network tab to inspect API calls
- Console to check for errors
- Application tab to view cookies/storage

## Performance Optimization

### Database Optimization
- Use indexes for frequently queried fields
- Use projection to fetch only needed fields
- Implement pagination for large datasets

### Frontend Optimization
- Code split with dynamic imports
- Optimize images with next/image
- Implement virtual scrolling for large lists
- Use SWR for client-side data caching

### API Optimization
- Implement caching with headers
- Use compression
- Implement rate limiting
- Consider pagination

## Common Issues and Solutions

### MongoDB Connection Error
**Problem**: `MongoError: connect ECONNREFUSED 127.0.0.1:27017`
**Solution**: Ensure MongoDB is running or update `MONGODB_URI`

### JWT/Session Error
**Problem**: `Error: JWT secret not found`
**Solution**: Ensure `JWT_SECRET` is set in `.env.local`

### API Key Error
**Problem**: `Invalid API key`
**Solution**: Verify API key format and check it exists in database

### CORS Error
**Problem**: `Access to XMLHttpRequest blocked by CORS`
**Solution**: Ensure API is returning proper CORS headers

## Git Workflow

\`\`\`bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push and create PR
git push origin feature/my-feature
\`\`\`

## Next Steps

1. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
2. Read [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for architecture overview
3. Check SDK documentation in `/public/sdk/README.md`
4. Explore the codebase to understand the structure
