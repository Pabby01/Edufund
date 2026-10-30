import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Route protection middleware for EduFund.
 * Enforces strict boundary separation between public marketing/donation pages
 * and authenticated student dashboard/management pages.
 */

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/goals/new',
  '/goals',
  '/pledges',
  '/settings',
  '/admin',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Supabase session cookie or EduFund auth marker
  const hasAuthToken =
    Boolean(request.cookies.get('sb-access-token')?.value) ||
    Boolean(request.cookies.get('edufund-auth')?.value);

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  // 1. Unauthenticated users trying to access dashboard/student pages
  if (isProtectedRoute && !hasAuthToken) {
    const signInUrl = new URL('/auth', request.url);
    signInUrl.searchParams.set('mode', 'signin');
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 2. Authenticated users navigating to /auth -> redirect to dashboard
  if (pathname === '/auth' && hasAuthToken) {
    const redirectParam = request.nextUrl.searchParams.get('redirect');
    const destination =
      redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
        ? redirectParam
        : '/dashboard';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all protected route paths and /auth, excluding:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, fonts
     */
    '/dashboard/:path*',
    '/goals/:path*',
    '/pledges/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/auth',
  ],
};

