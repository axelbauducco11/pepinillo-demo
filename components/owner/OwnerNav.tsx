'use client'
import { useRouter } from 'next/navigation'
import { BarChart2, LogOut } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export function OwnerNav() {
  const router = useRouter()
  const { businessName } = useTheme()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <header
      className="flex items-center justify-between px-5 py-3 border-b"
      style={{ background: 'var(--dr-primary)', borderColor: 'rgba(255,255,255,0.15)' }}
    >
      <div className="flex items-center gap-2">
        <BarChart2 size={20} color="white" />
        <span className="font-display text-lg font-bold text-white">
          Dashboard — {businessName}
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white"
      >
        <LogOut size={16} /> Salir
      </button>
    </header>
  )
}
