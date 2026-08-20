interface AttemptRecord {
  count: number
  firstAttempt: number
}

const attempts = new Map<string, AttemptRecord>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 10 * 60 * 1000 // 10 minutos

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = attempts.get(ip)

  if (!record || now - record.firstAttempt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAttempt: now })
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 }
  }

  if (record.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: MAX_ATTEMPTS - record.count }
}

export function resetRateLimit(ip: string): void {
  attempts.delete(ip)
}

// Limpiar entradas viejas cada hora
setInterval(() => {
  const now = Date.now()
  Array.from(attempts.entries()).forEach(([ip, record]) => {
    if (now - record.firstAttempt > WINDOW_MS) attempts.delete(ip)
  })
}, 60 * 60 * 1000).unref()
