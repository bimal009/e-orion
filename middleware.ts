// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/signin') || 
                      req.nextUrl.pathname.startsWith('/signup');

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      // Allow unauthenticated users to access auth pages
      return null;
    }

    // For protected routes, user must be authenticated
    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/signin?from=${encodeURIComponent(from)}`, req.url)
      );
    }
  },
  {
    callbacks: {
      authorized: () => {
        // This callback is required but we handle logic in middleware function
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    // Protected routes
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
    // Auth routes (to redirect if already logged in)
    "/signin",
    "/signup",
  ]
};