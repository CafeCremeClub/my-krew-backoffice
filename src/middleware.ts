import {NextRequest, NextResponse} from 'next/server';

export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;

    const token = request.cookies.get('token')?.value;

    const hasToken = !!token;

    const publicRoutes = ['/auth/signin'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    const authRoutes = ['/auth'];
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));


    if (pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!hasToken) {
        if (!isPublicRoute) {
            return NextResponse.redirect(new URL('/auth/signin', request.url));
        }

        return NextResponse.next();
    }

    if (hasToken) {
        if (isAuthRoute) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}