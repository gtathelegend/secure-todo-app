import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const { pathname } = request.nextUrl;
  const isLogoutFlow = request.nextUrl.searchParams.get('logout') === '1';

  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  if (pathname === '/signin' && token && isLogoutFlow) {
    return NextResponse.next();
  }

  if ((pathname === '/signin' || pathname === '/signup') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/signin', '/signup'],
};
