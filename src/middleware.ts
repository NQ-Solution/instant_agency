import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 개발 모드에서는 인증 체크 건너뛰기
  const isDev = process.env.NODE_ENV === 'development';
  const { pathname } = request.nextUrl;

  if (isDev) {
    // 개발 모드: 로그인 페이지 접근시 대시보드로 리다이렉트
    if (pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // 개발 모드: 모든 admin 페이지 접근 허용
    return NextResponse.next();
  }

  // 프로덕션 모드: 세션 쿠키 확인
  const sessionToken = request.cookies.get('authjs.session-token') ||
                       request.cookies.get('__Secure-authjs.session-token');

  // 로그인 페이지는 항상 접근 가능
  if (pathname === '/admin/login') {
    if (sessionToken) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // 다른 admin 페이지는 인증 필요
  if (pathname.startsWith('/admin') && !sessionToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
