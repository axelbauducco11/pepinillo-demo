'use client'
import { useEffect, useState } from 'react'
import { X, Sparkles } from 'lucide-react'

const SESSION_KEY = 'dr_popup_dismissed'

export function DemoPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // No mostrar si ya fue descartado en esta sesión
    if (sessionStorage.getItem(SESSION_KEY)) return

    // Aparece después de 1.8 segundos
    const timer = setTimeout(() => setVisible(true), 1800)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    setVisible(false)
    sessionStorage.setItem(SESSION_KEY, '1')
  }

  if (!visible) return null

  return (
    <>
      {/* Popup — aparece arriba del botón 🎨 (bottom-24 right-4) */}
      <div
        className="fixed bottom-24 right-4 z-50 max-w-[220px] rounded-2xl shadow-2xl p-4 animate-in"
        style={{
          background: 'white',
          border: '2px solid var(--dr-primary)',
        }}
      >
        {/* Botón cerrar */}
        <button
          onClick={dismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Cerrar"
        >
          <X size={14} style={{ color: '#999' }} />
        </button>

        {/* Ícono + título */}
        <div className="flex items-center gap-2 mb-2 pr-4">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--dr-primary)' }}
          >
            <Sparkles size={15} color="white" />
          </div>
          <p className="font-bold text-sm leading-tight" style={{ color: 'var(--dr-text)' }}>
            ¡Personalizá tu demo!
          </p>
        </div>

        {/* Descripción */}
        <p className="text-xs mb-3 leading-relaxed" style={{ color: '#666' }}>
          Cambiá colores, nombre, logo y fondo en tiempo real. Tocá el botón{' '}
          <span className="font-semibold" style={{ color: 'var(--dr-primary)' }}>🎨</span>{' '}
          de abajo.
        </p>

        {/* Flecha apuntando hacia abajo-derecha */}
        <div className="flex justify-end">
          <span className="text-xl animate-bounce">👇</span>
        </div>

        {/* Triángulo / cola del popup */}
        <div
          className="absolute -bottom-2.5 right-7 w-5 h-5 rotate-45"
          style={{ background: 'white', border: '2px solid var(--dr-primary)', borderTop: 'none', borderLeft: 'none' }}
        />
      </div>
    </>
  )
}
