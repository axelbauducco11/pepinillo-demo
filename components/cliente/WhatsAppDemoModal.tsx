'use client'
import { useState } from 'react'
import { ClientOrder } from '@/types/order'
import { buildWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp'
import { useTheme } from '@/contexts/ThemeContext'
import { X, MessageCircle, Eye, EyeOff } from 'lucide-react'

interface Props {
  order: ClientOrder
  onClose: () => void
}

export function WhatsAppDemoModal({ order, onClose }: Props) {
  const { businessName } = useTheme()
  const [phone, setPhone] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const message = buildWhatsAppMessage(order, businessName)

  function handleProbar() {
    if (!phone.trim()) return
    const url = buildWhatsAppUrl(order, phone.trim(), businessName)
    window.open(url, '_blank')
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
        style={{ background: 'var(--dr-surface)' }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between px-5 pt-5 pb-4 border-b"
          style={{ borderColor: 'var(--dr-border)' }}
        >
          <div>
            <h2 className="font-display text-lg font-bold" style={{ color: 'var(--dr-text)' }}>
              🧪 Modo demo
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--dr-muted)' }}>
              Probá cómo te llega el pedido por WhatsApp
            </p>
          </div>
          <button onClick={onClose} aria-label="Cerrar">
            <X size={20} style={{ color: 'var(--dr-muted)' }} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Phone input */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: 'var(--dr-text)' }}
            >
              Tu número de WhatsApp
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Ej: 5491123456789"
              className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none"
              style={{
                borderColor: 'var(--dr-border)',
                color: 'var(--dr-text)',
                background: 'var(--dr-bg)',
              }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--dr-muted)' }}>
              Incluí el código de país (ej: 54 para Argentina)
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleProbar}
              disabled={!phone.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-50 transition-opacity"
              style={{ background: '#25D366' }}
            >
              <MessageCircle size={16} />
              Probar con mi número
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center justify-center gap-1 px-4 py-3 rounded-xl border text-sm font-medium transition-colors"
              style={{ borderColor: 'var(--dr-border)', color: 'var(--dr-muted)' }}
            >
              {showPreview ? <EyeOff size={15} /> : <Eye size={15} />}
              {showPreview ? 'Ocultar' : 'Ver mensaje'}
            </button>
          </div>

          {/* Message preview — styled like WhatsApp bubble */}
          {showPreview && (
            <div
              className="rounded-2xl p-4 text-sm font-mono whitespace-pre-wrap leading-relaxed text-gray-900"
              style={{
                background: '#DCF8C6',
                border: '1px solid #B2DFDB',
                maxHeight: '240px',
                overflowY: 'auto',
              }}
            >
              {message}
            </div>
          )}
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border text-sm font-medium"
            style={{ borderColor: 'var(--dr-border)', color: 'var(--dr-muted)' }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
