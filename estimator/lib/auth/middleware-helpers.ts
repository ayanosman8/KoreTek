import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { UserRole } from '@/lib/database/types';

/**
 * Create a Supabase client for middleware
 */
export function createMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  return { supabase, response };
}

/**
 * Middleware helper to require authentication
 */
export async function requireAuth(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return { user, supabase, response };
}

/**
 * Middleware helper to require a specific role
 */
export async function requireRole(
  request: NextRequest,
  requiredRoles: UserRole | UserRole[]
) {
  const authResult = await requireAuth(request);

  // If redirected to login, return that response
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user, supabase, response } = authResult;

  // Fetch user profile with role
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    console.error('Error fetching user profile:', error);
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  // Admins have access to everything
  if (profile.role === 'admin') {
    return { user, profile, response };
  }

  // Check if user has required role
  if (!roles.includes(profile.role)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return { user, profile, response };
}

/**
 * Middleware helper to require internal access (internal staff or admin)
 */
export async function requireInternal(request: NextRequest) {
  return requireRole(request, ['internal', 'admin']);
}

/**
 * Middleware helper to require admin access
 */
export async function requireAdmin(request: NextRequest) {
  return requireRole(request, 'admin');
}
