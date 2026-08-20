import { jwtVerify } from 'jose'
import type { JwtPayload } from './auth'

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET not set')
  return new TextEncoder().encode(secret)
}

export async function verifyJWTEdge(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return { sub: payload.sub as string, role: payload.role as JwtPayload['role'] }
  } catch {
    return null
  }
}
