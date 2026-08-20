'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { businessName, logoUrl } = useTheme()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const initials = businessName.trim()
    ? businessName
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'MR'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión')
        return
      }

      router.push(data.role === 'owner' ? '/owner' : '/admin')
    } catch {
      setError('Error de conexión. Intentá nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--dr-bg)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={businessName}
              className="w-16 h-16 rounded-2xl object-cover shadow-lg mb-3"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-display mb-3 shadow-lg"
              style={{ background: 'var(--dr-primary)' }}
            >
              {initials}
            </div>
          )}
          <h1
            className="font-display text-2xl font-bold text-center"
            style={{ color: 'var(--dr-text)' }}
          >
            Panel de gestión
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--dr-muted)' }}>
            {businessName}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl shadow-sm p-6 space-y-4"
          style={{ background: 'var(--dr-surface)' }}
        >
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--dr-text)' }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@demo.com"
              required
              className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none"
              style={{
                borderColor: 'var(--dr-border)',
                color: 'var(--dr-text)',
                background: 'var(--dr-bg)',
              }}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--dr-text)' }}
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2.5 rounded-xl border text-sm pr-10 focus:outline-none"
                style={{
                  borderColor: 'var(--dr-border)',
                  color: 'var(--dr-text)',
                  background: 'var(--dr-bg)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPass ? (
                  <EyeOff size={16} style={{ color: 'var(--dr-muted)' }} />
                ) : (
                  <Eye size={16} style={{ color: 'var(--dr-muted)' }} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold transition-opacity disabled:opacity-60"
            style={{ background: 'var(--dr-primary)' }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div
          className="mt-4 rounded-xl p-3 text-xs text-center"
          style={{ background: 'var(--dr-border)', color: 'var(--dr-muted)' }}
        >
          <p className="font-semibold mb-1">Credenciales demo</p>
          <p>Admin: admin@demo.com / admin123</p>
          <p>Dueño: dueno@demo.com / dueno123</p>
        </div>
      </div>
    </main>
  )
}
