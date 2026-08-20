import { OwnerNav } from '@/components/owner/OwnerNav'
import { ReactNode } from 'react'

export default function OwnerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--dr-bg)' }}>
      <OwnerNav />
      <main className="max-w-6xl mx-auto px-4 py-4">{children}</main>
    </div>
  )
}
