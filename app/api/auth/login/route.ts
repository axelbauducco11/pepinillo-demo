import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, sanitizeInput, signJWT } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limiter'

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
  const { allowed } = checkRateLimit(ip)

  if (!allowed) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Esperá 10 minutos.' },
      { status: 429 }
    )
  }

  const body = await req.json().catch(() => ({}))
  const email = sanitizeInput(String(body.email ?? ''))
  const password = String(body.password ?? '').slice(0, 128)

  const role = await authenticateUser(email, password)

  if (!role) {
    return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
  }

  const token = await signJWT({ sub: email, role })

  const res = NextResponse.json({ role })
  res.cookies.set('dr_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  })
  return res
}
