import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ['/login', '/register']

export default async function middleware(request: NextRequest){
    const { pathname } = request.nextUrl
    const token = request.cookies.get('access_token') as { value: string } | undefined
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

    if(!token && !isPublicRoute){
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if(token && isPublicRoute){
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|public).*)",
  ],
};