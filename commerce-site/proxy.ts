import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Redirect authenticated users away from auth pages
    if ((pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register")) && token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Protect admin routes - only allow admins
    if (pathname.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Publicly accessible auth pages (handled in middleware function for logged-in users)
        if (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register")) {
          return true;
        }

        // All other routes in the matcher require a token
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/cart/:path*",
    "/wishlist/:path*",
    "/account/:path*",
    "/auth/login",
    "/auth/register",
  ],
};