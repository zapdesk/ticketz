import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of paths that don't require authentication
const PUBLIC_PATHS = ['/login'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for route groups (paths starting with parentheses)
  if (pathname.startsWith('/(')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token');

  // Check if the path is public
  const isPublicPath = PUBLIC_PATHS.some(path => 
    pathname === path || pathname === path + '/'
  );

  // Handle public paths
  if (isPublicPath) {
    // If user is already authenticated and tries to access login,
    // redirect to dashboard
    if (token && pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Check if user is authenticated for protected routes
  if (!token) {
    // Redirect to login page with return URL
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - Static files
    // - Internal Next.js routes
    // - Route groups (paths starting with parentheses)
    '/((?!api|_next|.*\\.|\\(.*\\)).*)'
  ]
}; 