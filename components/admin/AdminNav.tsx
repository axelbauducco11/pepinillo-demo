'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ClipboardList, Package, BarChart2, ShoppingBag, LogOut } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const NAV_ITEMS = [
  { href: '/admin', label: 'Comandas', icon: ClipboardList },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/stock', label: 'Stock', icon: BarChart2 },
  { href: '/admin/compras', label: 'Compras', icon: ShoppingBag },
]

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { businessName } = useTheme()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <>
      {/* Desktop top bar */}
      <header
        className="hidden md:flex items-center justify-between px-6 py-3 border-b"
        style={{ background: 'var(--dr-primary)', borderColor: 'rgba(255,255,255,0.15)' }}
      >
        <span className="font-display text-lg font-bold text-white">
          Admin — {businessName}
        </span>
        <nav className="flex gap-1">
          {NAV_ITEMS.map(item => {
            const active =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
                  color: 'white',
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white"
        >
          <LogOut size={16} /> Salir
        </button>
      </header>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t grid"
        style={{
          background: 'var(--dr-surface)',
          borderColor: 'var(--dr-border)',
          gridTemplateColumns: `repeat(${NAV_ITEMS.length + 1}, 1fr)`,
        }}
      >
        {NAV_ITEMS.map(item => {
          const active =
            item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center py-2 gap-0.5 text-xs font-medium"
              style={{ color: active ? 'var(--dr-primary)' : 'var(--dr-muted)' }}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          )
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center py-2 gap-0.5 text-xs font-medium"
          style={{ color: 'var(--dr-muted)' }}
        >
          <LogOut size={20} />
          Salir
        </button>
      </nav>
    </>
  )
}
