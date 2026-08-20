'use client'

// Número de WhatsApp — formato internacional Argentina (sin +)
const WA_URL = 'https://wa.me/5493815767476'

export function DevFooter({ light = false }: { light?: boolean }) {
  return (
    <p
      className="text-center text-[11px] py-2 select-none"
      style={{ color: light ? 'rgba(255,255,255,0.45)' : 'var(--dr-muted)', opacity: 0.75 }}
    >
      Desarrollado por:{' '}
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:opacity-100 transition-opacity"
        style={{ color: light ? 'rgba(255,255,255,0.65)' : 'var(--dr-muted)' }}
      >
        Axel B.
      </a>
    </p>
  )
}
