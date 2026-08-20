'use client'
import { OwnerNav } from '@/components/owner/OwnerNav'
import { useTheme } from '@/contexts/ThemeContext'
import { ReactNode } from 'react'

export default function OwnerLayout({ children }: { children: ReactNode }) {
  const { heroBg } = useTheme()

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(247,243,232,0.93), rgba(247,243,232,0.93)), url('${heroBg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <OwnerNav />
      <main className="max-w-6xl mx-auto px-4 py-4">{children}</main>
    </div>
  )
}
