import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default withAuth(
  async function middleware(req: NextRequest) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const { pathname } = req.nextUrl;

    const isAuthPage =
      pathname.startsWith("/auth/login") ||
      pathname.startsWith("/auth/register");

    if (isAuthPage && token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "admin") {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    const protectedRoutes = [
      "/checkout",
      "/orders",
      "/profile",
      "/cart",
      "/wishlist",
      "/account",
    ];

    const isProtectedRoute = protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/"),
    );

    if (isProtectedRoute && !token) {
      const callbackUrl = encodeURIComponent(pathname + req.nextUrl.search);
      return NextResponse.redirect(new URL(callbackUrl, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
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