/**
 * EXAMPLE MIDDLEWARE FILES
 *
 * Copy the appropriate example to your app's middleware.ts file
 */

// ============================================
// EXAMPLE 1: Estimator App (Customer Access)
// ============================================
// File: estimator/middleware.ts

import { type NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/middleware-helpers';

export async function middleware(request: NextRequest) {
  // For the estimator app, we just need users to be authenticated
  // They'll all be 'customer' role by default
  const result = await requireAuth(request);

  // If redirected, return the redirect response
  if (result instanceof Response) {
    return result;
  }

  // User is authenticated, allow access
  return result.response;
}

export const config = {
  matcher: [
    '/estimate:path*',
    '/my-estimates:path*',
    '/api/generate-estimate:path*',
    '/api/refine-estimate:path*',
    '/api/save-estimate:path*',
    '/api/save-user-estimate:path*',
  ],
};

// ============================================
// EXAMPLE 2: Internal Tools App (Internal/Admin Only)
// ============================================
// File: internal-tools/middleware.ts (for future internal apps)

/*
import { type NextRequest } from 'next/server';
import { requireInternal } from '@/lib/auth/middleware-helpers';

export async function middleware(request: NextRequest) {
  // Require internal or admin role
  const result = await requireInternal(request);

  // If redirected, return the redirect response
  if (result instanceof Response) {
    return result;
  }

  // User has internal access, allow
  return result.response;
}

export const config = {
  // Protect all routes in this app
  matcher: [
    '/((?!api/health|auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
*/

// ============================================
// EXAMPLE 3: Admin App (Admin Only)
// ============================================
// File: admin-app/middleware.ts (for future admin apps)

/*
import { type NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth/middleware-helpers';

export async function middleware(request: NextRequest) {
  // Require admin role only
  const result = await requireAdmin(request);

  // If redirected, return the redirect response
  if (result instanceof Response) {
    return result;
  }

  // User is admin, allow access
  return result.response;
}

export const config = {
  // Protect all routes except auth
  matcher: [
    '/((?!api/health|auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
*/

// ============================================
// EXAMPLE 4: Mixed Access App
// ============================================
// File: mixed-app/middleware.ts (different routes need different roles)

/*
import { type NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth/middleware-helpers';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes - require admin role
  if (pathname.startsWith('/admin')) {
    return requireRole(request, 'admin');
  }

  // Internal routes - require internal or admin role
  if (pathname.startsWith('/internal')) {
    return requireRole(request, ['internal', 'admin']);
  }

  // Regular routes - just require authentication
  const result = await requireAuth(request);
  if (result instanceof Response) return result;

  return result.response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/internal/:path*',
    '/dashboard/:path*',
  ],
};
*/
