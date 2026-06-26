import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { UserRole } from '@/lib/types'

const ROLE_ROUTES: Record<string, UserRole[]> = {
  '/dashboard': ['brand'],
  '/artisan': ['artisan'],
  '/auditor': ['lsm_auditor'],
}

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  if (pathname.startsWith('/passport/') || pathname === '/') {
    return NextResponse.next()
  }

  if (pathname === '/login' || pathname === '/register') {
    if (isLoggedIn) {
      const role = req.auth?.user?.role
      if (role === 'brand') return NextResponse.redirect(new URL('/dashboard', req.url))
      if (role === 'artisan') return NextResponse.redirect(new URL('/artisan', req.url))
      if (role === 'lsm_auditor') return NextResponse.redirect(new URL('/auditor', req.url))
    }
    return NextResponse.next()
  }

  if (!isLoggedIn) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const role = req.auth?.user?.role as UserRole | undefined

  for (const [route, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(route)) {
      if (!role || !allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/artisan/:path*',
    '/auditor/:path*',
    '/login',
    '/register',
  ],
}
