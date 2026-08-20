import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

export type UserRole = 'admin' | 'owner'

interface MockUser {
  email: string
  passwordHash: string
  role: UserRole
}

// TODO: Replace with real database users
const MOCK_USERS: MockUser[] = [
  {
    email: 'admin@demo.com',
    // admin123
    passwordHash: '$2b$10$qQw7ucjq7eyM33s4Tt.fleBShvOfWnj853NvDWFU0K9Ovxl69B78y',
    role: 'admin',
  },
  {
    email: 'dueno@demo.com',
    // dueno123
    passwordHash: '$2b$10$WvAouAk2jiFfMmQ4Zw2NAufReqN5UNMT18Jh85IbetIt5Duff90KC',
    role: 'owner',
  },
]

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET not set')
  return new TextEncoder().encode(secret)
}

export interface JwtPayload {
  sub: string
  role: UserRole
}

export async function signJWT(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getJwtSecret())
}

export async function verifyJWT(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return { sub: payload.sub as string, role: payload.role as UserRole }
  } catch {
    return null
  }
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<UserRole | null> {
  const user = MOCK_USERS.find(u => u.email === email.toLowerCase())
  if (!user) return null
  const valid = await bcrypt.compare(password, user.passwordHash)
  return valid ? user.role : null
}

export function sanitizeInput(input: string): string {
  return input.trim().slice(0, 255).replace(/[<>'"]/g, '')
}
