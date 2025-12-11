import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes check
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isMyEstimatesRoute = request.nextUrl.pathname.startsWith("/my-estimates");
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");

  // Require auth for admin and my-estimates routes
  if ((isAdminRoute || isMyEstimatesRoute) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Check if admin route requires admin role
  if (isAdminRoute && user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      // Non-admin trying to access admin - redirect to their estimates
      const url = request.nextUrl.clone();
      url.pathname = "/my-estimates";
      return NextResponse.redirect(url);
    }
  }

  if (isAuthRoute && user) {
    // Already logged in - check role and redirect accordingly
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const url = request.nextUrl.clone();
    url.pathname = profile?.role === 'admin' ? "/admin" : "/my-estimates";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
