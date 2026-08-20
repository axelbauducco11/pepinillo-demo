import { checkRateLimit, resetRateLimit } from '../lib/rate-limiter'

describe('checkRateLimit', () => {
  afterEach(() => resetRateLimit('test-ip'))

  it('permite la primera solicitud', () => {
    const result = checkRateLimit('test-ip')
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('bloquea tras 5 intentos', () => {
    for (let i = 0; i < 5; i++) checkRateLimit('test-ip')
    const result = checkRateLimit('test-ip')
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('resetea el límite correctamente', () => {
    for (let i = 0; i < 5; i++) checkRateLimit('test-ip')
    resetRateLimit('test-ip')
    const result = checkRateLimit('test-ip')
    expect(result.allowed).toBe(true)
  })

  it('IPs diferentes no interfieren', () => {
    for (let i = 0; i < 5; i++) checkRateLimit('ip-a')
    const result = checkRateLimit('ip-b')
    expect(result.allowed).toBe(true)
    resetRateLimit('ip-a')
    resetRateLimit('ip-b')
  })
})
