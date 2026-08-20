'use client'
import { useState, useRef, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Palette, X, Upload, ImageIcon, RefreshCw } from 'lucide-react'

const LS_POS = 'dr_panel_btn_pos'

export function ThemePanel() {
  const {
    palette, setPalette, businessName, setBusinessName,
    logoUrl, setLogoUrl, palettes,
    heroBg, isCustomHeroBg, setCustomHeroBg,
  } = useTheme()

  const [open, setOpen] = useState(false)
  const logoRef = useRef<HTMLInputElement>(null)
  const bgRef = useRef<HTMLInputElement>(null)

  // ── Posición arrastrable ──────────────────────────────────────────────
  const [pos, setPos] = useState({ x: -1, y: -1 })   // -1 = no inicializado
  const [dragging, setDragging] = useState(false)
  const [didDrag, setDidDrag] = useState(false)
  const dragOrigin = useRef<{ px: number; py: number; bx: number; by: number } | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(LS_POS)
    if (saved) {
      try { setPos(JSON.parse(saved)) } catch { setDefaultPos() }
    } else {
      setDefaultPos()
    }
  }, [])

  function setDefaultPos() {
    setPos({ x: window.innerWidth - 68, y: window.innerHeight - 68 })
  }

  function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value))
  }

  function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragOrigin.current = { px: e.clientX, py: e.clientY, bx: pos.x, by: pos.y }
    setDragging(true)
    setDidDrag(false)
  }

  function handlePointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!dragOrigin.current) return
    const dx = e.clientX - dragOrigin.current.px
    const dy = e.clientY - dragOrigin.current.py
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) setDidDrag(true)
    setPos({
      x: clamp(dragOrigin.current.bx + dx, 16, window.innerWidth  - 64),
      y: clamp(dragOrigin.current.by + dy, 16, window.innerHeight - 64),
    })
  }

  function handlePointerUp() {
    if (dragOrigin.current) {
      localStorage.setItem(LS_POS, JSON.stringify(pos))
    }
    dragOrigin.current = null
    setDragging(false)
  }

  function handleClick() {
    if (!didDrag) setOpen(true)
  }
  // ─────────────────────────────────────────────────────────────────────

  const initials = businessName.trim()
    ? businessName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'MR'

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setLogoUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function handleBgUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no puede superar 5MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = ev => setCustomHeroBg(ev.target?.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // No renderizar el botón hasta que tengamos la posición real (evita flash SSR)
  if (pos.x === -1) return null

  return (
    <>
      {/* ── Botón flotante arrastrable ── */}
      <button
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
        className="fixed z-50 w-12 h-12 rounded-full shadow-xl flex items-center justify-center select-none touch-none"
        style={{
          left: pos.x,
          top: pos.y,
          background: 'var(--dr-primary)',
          cursor: dragging ? 'grabbing' : 'grab',
          transition: dragging ? 'none' : 'box-shadow 0.2s',
          boxShadow: dragging
            ? '0 8px 30px rgba(0,0,0,0.25)'
            : '0 4px 14px rgba(0,0,0,0.2)',
        }}
        title="Personalizar (arrastrá para mover)"
        aria-label="Abrir panel de personalización"
      >
        <Palette size={20} color="white" />
        {/* Pequeño indicador de que es arrastrable */}
        <span
          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white flex items-center justify-center text-[8px] font-bold shadow"
          style={{ color: 'var(--dr-primary)', lineHeight: 1 }}
          aria-hidden
        >
          ✥
        </span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <aside
        className="fixed top-0 right-0 h-full w-80 z-50 shadow-2xl flex flex-col"
        style={{
          background: 'var(--dr-surface)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: 'var(--dr-border)' }}>
          <div>
            <h2 className="font-display text-lg font-bold" style={{ color: 'var(--dr-primary)' }}>
              Personalizar
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--dr-muted)' }}>Cambios en tiempo real</p>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Cerrar panel">
            <X size={20} style={{ color: 'var(--dr-muted)' }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* ── Nombre del negocio ── */}
          <section>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dr-text)' }}>
              Nombre del negocio
            </label>
            <input
              type="text"
              value={businessName}
              onChange={e => setBusinessName(e.target.value.slice(0, 40))}
              placeholder="Mi Restaurante"
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
              style={{ borderColor: 'var(--dr-border)', color: 'var(--dr-text)', background: 'var(--dr-bg)' }}
            />
          </section>

          {/* ── Logo ── */}
          <section>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dr-text)' }}>
              Logo (opcional)
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ background: 'var(--dr-primary)' }}
              >
                {logoUrl
                  ? <img src={logoUrl} alt="logo" className="w-full h-full object-cover" />
                  : <span className="text-white text-lg font-bold font-display">{initials}</span>
                }
              </div>
              <div className="flex flex-col gap-1.5">
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                <button
                  onClick={() => logoRef.current?.click()}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border font-medium"
                  style={{ borderColor: 'var(--dr-border)', color: 'var(--dr-muted)' }}
                >
                  <Upload size={12} /> {logoUrl ? 'Cambiar logo' : 'Subir logo'}
                </button>
                {logoUrl && (
                  <button onClick={() => setLogoUrl(null)} className="text-xs px-3 py-1 rounded-lg" style={{ color: '#C62828' }}>
                    Quitar logo
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* ── Fondo de pantalla de inicio ── */}
          <section>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--dr-text)' }}>
              Fondo de pantalla de inicio
            </label>

            <div
              className="w-full h-24 rounded-xl mb-3 overflow-hidden relative"
              style={{ background: 'var(--dr-primary)' }}
            >
              <div
                className="absolute inset-0"
                style={{ backgroundImage: `url('${heroBg}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute bottom-2 left-2 text-white text-xs font-medium drop-shadow">
                {isCustomHeroBg ? '📁 Foto personalizada' : `${palette.emoji} ${palette.name}`}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <input ref={bgRef} type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
              <button
                onClick={() => bgRef.current?.click()}
                className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg border font-medium w-full justify-center"
                style={{ borderColor: 'var(--dr-border)', color: 'var(--dr-text)' }}
              >
                <ImageIcon size={13} />
                {isCustomHeroBg ? 'Cambiar mi foto' : 'Subir mi propia foto'}
              </button>
              {isCustomHeroBg && (
                <button
                  onClick={() => setCustomHeroBg(null)}
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg border font-medium w-full justify-center"
                  style={{ borderColor: 'var(--dr-border)', color: 'var(--dr-muted)' }}
                >
                  <RefreshCw size={12} /> Volver al fondo de la paleta
                </button>
              )}
              <p className="text-xs" style={{ color: 'var(--dr-muted)' }}>
                {isCustomHeroBg
                  ? 'Usando tu foto. Podés volver al fondo de la paleta en cualquier momento.'
                  : 'Cada paleta tiene su propio fondo. Podés subir el tuyo.'}
              </p>
            </div>
          </section>

          {/* ── Paleta de colores ── */}
          <section>
            <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--dr-text)' }}>
              Paleta de colores
            </label>
            <div className="space-y-2">
              {palettes.map(p => {
                const isSelected = palette.id === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setPalette(p)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all text-left"
                    style={{
                      borderColor: isSelected ? p.vars['--dr-primary'] : 'var(--dr-border)',
                      background: isSelected ? p.vars['--dr-bg'] : 'var(--dr-surface)',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden relative"
                      style={{ background: p.vars['--dr-primary'] }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{ backgroundImage: `url('${p.defaultBg}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-sm bg-black/20">
                        {p.emoji}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: p.vars['--dr-text'] }}>{p.name}</p>
                      <p className="text-xs" style={{ color: p.vars['--dr-muted'] }}>{p.description}</p>
                    </div>
                    {isSelected && (
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: p.vars['--dr-primary'] }} />
                    )}
                  </button>
                )
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t text-xs text-center" style={{ borderColor: 'var(--dr-border)', color: 'var(--dr-muted)' }}>
          Arrastrá el botón 🎨 para reubicarlo en la pantalla.
        </div>
      </aside>
    </>
  )
}
