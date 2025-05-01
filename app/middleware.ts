import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '../lib/auth'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const isAuth = token && verifyToken(token)

  const protectedPaths = ['/movies']

  if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path)) && !isAuth) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/movies/:path*'],
}
