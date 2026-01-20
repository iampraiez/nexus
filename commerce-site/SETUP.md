# Full-Stack Ecommerce Application - Setup Guide

This is a complete full-stack ecommerce application built with Next.js, MongoDB, and NextAuth.

## Prerequisites

- Node.js 18+ 
- MongoDB database (local or cloud)
- NextAuth secret key

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize the database:**
   ```bash
   node scripts/init-db.js
   ```
   
   This creates:
   - Database collections (users, products, orders, cart)
   - Indexes for optimized queries
   - Admin user: `admin@example.com` / `admin123`
   - Sample products

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Customer: http://localhost:3000/products
   - Admin: http://localhost:3000/admin/dashboard
   - Login: http://localhost:3000/auth/login

## Demo Credentials

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**Create Customer Account:**
- Go to `/auth/register` to create a new account

## Features

### Customer Features
- Browse products with search and filtering
- View product details
- Add items to shopping cart (persisted in localStorage)
- Demo checkout with simulated payments
- View order history
- Track order status
- Customer profile

### Admin Features
- Dashboard with sales analytics
- Product management (CRUD operations)
- View all orders from customers
- Update order status
- Low stock alerts
- Revenue analytics

## Database Schema

### Collections

**users**
- _id (ObjectId)
- email (string, unique)
- name (string)
- passwordHash (string)
- role (string: "admin" | "customer")
- createdAt (date)

**products**
- _id (ObjectId)
- name (string)
- price (number)
- description (string)
- category (string)
- image (string)
- stock (number)
- createdAt (date)

**orders**
- _id (ObjectId)
- userId (ObjectId)
- userEmail (string)
- items (array)
  - name (string)
  - price (number)
  - quantity (number)
  - image (string)
- total (number)
- status (string: "pending" | "paid" | "shipped" | "delivered" | "cancelled")
- createdAt (date)
- updatedAt (date)

**cart**
- _id (ObjectId)
- userId (ObjectId, unique)
- items (array)
  - _id (ObjectId)
  - name (string)
  - price (number)
  - image (string)
  - quantity (number)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Products (Customer)
- `GET /api/products` - List products with search/filter
- `GET /api/products/[id]` - Get product details

### Products (Admin)
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product

### Orders (Customer)
- `GET /api/orders` - Get user's orders
- `GET /api/orders/[id]` - Get order details
- `POST /api/checkout` - Create checkout session

### Orders (Admin)
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/orders/[id]` - Get order details
- `PUT /api/admin/orders/[id]` - Update order status

### Dashboard
- `GET /api/admin/dashboard` - Get dashboard analytics

### Webhooks


## Project Structure

```
├── app/
│   ├── api/                 # API routes
│   ├── auth/               # Authentication pages
│   ├── admin/              # Admin pages
│   ├── products/           # Product pages
│   ├── orders/             # Order pages
│   ├── checkout/           # Checkout pages
│   ├── profile/            # Profile page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── product-card.tsx    # Product card component
│   └── product-form.tsx    # Product form component
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── db.ts               # MongoDB connection
│   └── cart.ts             # Cart utilities
├── scripts/
│   └── init-db.js          # Database initialization
└── middleware.ts           # Route protection middleware
```

## Deployment

1. **Environment Variables:**
   Add all `.env.local` variables to your deployment platform

2. **Database:**
   Use a managed MongoDB service (MongoDB Atlas, etc.)

3. **Deployment Platforms:**
   - Vercel (recommended)
   - AWS
   - Heroku
   - DigitalOcean

## Troubleshooting

**MongoDB Connection Error:**
- Verify `MONGODB_URI` is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database name is correct

**NextAuth Issues:**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear cookies and try again



## Additional Notes

- Cart is stored in browser localStorage for unauthenticated users
- Payment processing is simulated (Demo Mode)
- Order status updates happen automatically (e.g., auto-delivery)
- All admin routes require authentication and admin role
- Protected routes use middleware and server-side session checks

## Support

For issues or questions, refer to the documentation for:
- [Next.js](https://nextjs.org/docs)
- [NextAuth](https://next-auth.js.org)
- [MongoDB](https://docs.mongodb.com)
