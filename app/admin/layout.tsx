'use client'
import { AdminNav } from '@/components/admin/AdminNav'
import { useTheme } from '@/contexts/ThemeContext'
import { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { heroBg } = useTheme()

  return (
    <div
      className="min-h-screen pb-20 md:pb-0"
      style={{
        backgroundImage: `linear-gradient(rgba(247,243,232,0.93), rgba(247,243,232,0.93)), url('${heroBg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <AdminNav />
      <main className="max-w-6xl mx-auto px-4">{children}</main>
    </div>
  )
}
