# Commerce Brain

A full-stack e-commerce application built with Next.js, featuring user authentication, product management, shopping cart, demo checkout, and an admin dashboard.

## 🚀 Features

- **User Authentication**: Secure login/registration with NextAuth
- **Nexus Analytics**: Integrated with `nexus-avail` SDK for real-time user behavior tracking
- **Product Management**: Browse, search, and view detailed product information
- **Shopping Cart**: Add/remove items, persistent cart storage
- **Demo Checkout**: Integrated simulated payment processing with random success/failure and delivery fees
- **Order Management**: Track orders and order history
- **Admin Dashboard**: Manage products, orders, and users
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **MongoDB**: NoSQL database for scalable data storage

## 🛠 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Next.js API routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Payments**: Demo Mode (Simulated)
- **State Management**: React hooks, Context API

## 📋 Prerequisites

- Node.js 18+
- MongoDB database (local or cloud like MongoDB Atlas)
- npm or pnpm package manager

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd commerce_brain
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/commerce_brain?retryWrites=true&w=majority

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here

   # Nexus Analytics
   NEXT_PUBLIC_NEXUS_API_KEY=your_nexus_api_key
   NEXT_PUBLIC_NEXUS_PROJECT_ID=your_nexus_project_id
   NEXT_PUBLIC_NEXUS_ENVIRONMENT=development
   ```

4. **Initialize the database:**
   ```bash
   node scripts/init-db.js
   ```
   This creates the necessary collections, indexes, and sample data including an admin user.

## 🚀 Usage

1. **Start the development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

2. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Admin Access:**
   - Email: `admin@example.com`
   - Password: `admin123`

## 📜 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 📁 Project Structure

```
commerce_brain/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout flow
│   ├── orders/            # Order management
│   └── products/          # Product pages
├── components/            # Reusable React components
│   ├── ui/               # UI components (Radix UI)
│   └── ...               # Custom components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── public/               # Static assets
├── scripts/              # Database initialization scripts
└── styles/               # Global styles
```

## 🔐 Authentication

The app uses NextAuth.js with multiple providers. Currently configured for credentials-based authentication with MongoDB storage.

## 💳 Payment Integration

The application uses a **Demo Mode** for checkout to simulate a real-world experience without requiring actual payment processing. Features include:
- Random delivery fee calculation ($5 - $30)
- Simulated payment processing with a 75% success rate
- Automatic order status updates (e.g., auto-delivery after 30 seconds)
- Order confirmation and history tracking

## 📊 Admin Features

- Product CRUD operations
- Order management and tracking
- User management
- Analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
