import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { format, startOfDay, startOfMonth, endOfMonth } from 'date-fns';
import signOut from '@/actions/signOut';

const today = startOfDay(new Date());
const fromDate = format(startOfMonth(today), 'yyyy-MM-dd');
const toDate = format(endOfMonth(today), 'yyyy-MM-dd');

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
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
            ...options
          });
          response = NextResponse.next({
            request: {
              headers: request.headers
            }
          });
          response.cookies.set({
            name,
            value,
            ...options
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options
          });
          response = NextResponse.next({
            request: {
              headers: request.headers
            }
          });
          response.cookies.set({
            name,
            value: '',
            ...options
          });
        }
      }
    }
  );

  const user = await supabase.auth.getUser();

  const { data: role } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.data.user?.id)
    .single();

  // Restrict dashboard from unauthorized
  if (request.nextUrl.pathname.startsWith('/dashboard') && user.error) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Restrict login from authorized
  if (request.nextUrl.pathname.endsWith('/') && user.error === null) {
    let redirectPath = '/dashboard';
    if (role?.role === 'superadmin') {
      redirectPath = '/dashboard/admins';
    }
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  //Add range query to admin dashboard
  if (
    request.nextUrl.pathname.endsWith('/dashboard') &&
    user.error === null &&
    role?.role === 'admin'
  ) {
    const currentUrl = new URL(request.url);
    const currentFrom = currentUrl.searchParams.get('from');
    const currentTo = currentUrl.searchParams.get('to');

    // Check if from or to is missing in the URL
    if (!currentFrom || !currentTo) {
      const dashboardUrl = new URL('/dashboard', request.url);
      dashboardUrl.searchParams.set('from', fromDate);
      dashboardUrl.searchParams.set('to', toDate);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Restrict routes based on role
  if (
    role?.role === 'user' &&
    request.nextUrl.pathname.startsWith('/dashboard')
  ) {
    await signOut();
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (
    role?.role === 'admin' &&
    request.nextUrl.pathname.startsWith('/dashboard/admins')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (
    role?.role === 'superadmin' &&
    (
      request.nextUrl.pathname.endsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/dashboard/patients') ||
      request.nextUrl.pathname.startsWith('/dashboard/reports') ||
      request.nextUrl.pathname.startsWith('/dashboard/profile')
    )
  ) {
    return NextResponse.redirect(new URL('/dashboard/admins', request.url));
  }

  if (request.nextUrl.pathname === '/reset-password') {
    const token = request.nextUrl.searchParams.get('code');
    if (!token) {
      return NextResponse.redirect(new URL('/forgot-password', request.url));
    }
  }

  return response;
}
