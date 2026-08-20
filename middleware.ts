import { NextRequest, NextResponse } from 'next/server'
import { verifyJWTEdge } from './lib/auth-edge'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('dr_session')?.value

  const isAdminPath = pathname.startsWith('/admin')
  const isOwnerPath = pathname.startsWith('/owner')

  if (!isAdminPath && !isOwnerPath) return NextResponse.next()

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const payload = await verifyJWTEdge(token)

  if (!payload) {
    const res = NextResponse.redirect(new URL('/login', req.url))
    res.cookies.delete('dr_session')
    return res
  }

  if (isAdminPath && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isOwnerPath && payload.role !== 'owner') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/owner/:path*'],
}
