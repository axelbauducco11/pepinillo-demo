import { AdminNav } from '@/components/admin/AdminNav'
import { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ background: 'var(--dr-bg)' }}>
      <AdminNav />
      <main className="max-w-6xl mx-auto px-4">{children}</main>
    </div>
  )
}
