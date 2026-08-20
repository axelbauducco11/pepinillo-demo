import { sanitizeInput, signJWT, verifyJWT } from '../lib/auth'

process.env.JWT_SECRET = 'test-secret-key-for-jest-at-least-32-chars-long'

describe('sanitizeInput', () => {
  it('trimea espacios', () => {
    expect(sanitizeInput('  admin@test.com  ')).toBe('admin@test.com')
  })
  it('elimina caracteres peligrosos', () => {
    expect(sanitizeInput('<script>alert(1)</script>')).toBe('scriptalert(1)/script')
  })
  it('limita a 255 caracteres', () => {
    expect(sanitizeInput('a'.repeat(300))).toHaveLength(255)
  })
})

describe('JWT round-trip', () => {
  it('firma y verifica correctamente', async () => {
    const payload = { sub: 'admin@demo.com', role: 'admin' as const }
    const token = await signJWT(payload)
    const decoded = await verifyJWT(token)
    expect(decoded?.sub).toBe('admin@demo.com')
    expect(decoded?.role).toBe('admin')
  })

  it('rechaza un token manipulado', async () => {
    const token = await signJWT({ sub: 'x@x.com', role: 'admin' })
    const tampered = token.slice(0, -5) + 'XXXXX'
    const result = await verifyJWT(tampered)
    expect(result).toBeNull()
  })

  it('rechaza un string vacío', async () => {
    const result = await verifyJWT('')
    expect(result).toBeNull()
  })
})
