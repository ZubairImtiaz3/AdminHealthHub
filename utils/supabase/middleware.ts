import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { format, startOfDay, startOfMonth, endOfMonth } from 'date-fns';

const today = startOfDay(new Date());
const fromDate = format(startOfMonth(today), 'yyyy-MM-dd');
const toDate = format(endOfMonth(today), 'yyyy-MM-dd');

const adminRoutes = [
  '/dashboard',
  '/dashboard/patients',
  '/dashboard/reports',
  '/dashboard/profile'
];

const superadminRoutes = ['/dashboard/admins', '/dashboard/add-admin'];

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

  if (request.nextUrl.pathname.startsWith('/dashboard') && user.error) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (
    request.nextUrl.pathname.endsWith('/') &&
    user.error === null &&
    role?.role === 'admin'
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

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
    role?.role === 'admin' &&
    !adminRoutes.includes(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } else if (
    role?.role === 'superadmin' &&
    !superadminRoutes.includes(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL('/dashboard/admins', request.url));
  }

  return response;
}
