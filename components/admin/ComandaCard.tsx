'use client'
import { Order, OrderStatus } from '@/types/order'
import { ChevronRight, Clock } from 'lucide-react'

const STATUS_STYLES: Record<OrderStatus, { bg: string; label: string }> = {
  PENDIENTE: { bg: '#FFF3E0', label: 'Pendiente' },
  CONFIRMADO: { bg: '#E3F2FD', label: 'Confirmado' },
  EN_PREPARACION: { bg: '#FFF9C4', label: 'En preparación' },
  LISTO: { bg: '#E8F5E9', label: 'Listo ✓' },
}

function timeAgo(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000)
  if (mins < 1) return 'Ahora'
  if (mins < 60) return `${mins} min`
  return `${Math.floor(mins / 60)}h`
}

interface Props {
  order: Order
  onAdvance: (id: string) => void
}

export function ComandaCard({ order, onAdvance }: Props) {
  const { bg, label } = STATUS_STYLES[order.status]
  const canAdvance = order.status !== 'LISTO'

  return (
    <div
      className="rounded-2xl shadow-sm overflow-hidden"
      style={{ background: 'var(--dr-surface)', border: `2px solid ${bg}` }}
    >
      <div className="px-4 pt-3 pb-2">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="font-display font-bold text-base"
            style={{ color: 'var(--dr-text)' }}
          >
            {order.number}
          </span>
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: 'var(--dr-muted)' }}
          >
            <Clock size={12} /> {timeAgo(order.createdAt)}
          </span>
        </div>

        {/* Client */}
        <p className="font-semibold text-sm" style={{ color: 'var(--dr-text)' }}>
          {order.customerName}
        </p>
        <p className="text-xs" style={{ color: 'var(--dr-muted)' }}>
          {order.modalidad === 'envio' ? `📍 ${order.address}` : '🏠 Retiro en local'}
        </p>

        {/* Items */}
        <div className="mt-2 space-y-0.5">
          {order.items.map((item, i) => (
            <p key={i} className="text-sm" style={{ color: 'var(--dr-text)' }}>
              {item.quantity}× {item.name}
            </p>
          ))}
        </div>

        {/* Total */}
        <p className="text-sm font-bold mt-2" style={{ color: 'var(--dr-primary)' }}>
          ${order.total.toLocaleString('es-AR')}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2" style={{ background: bg }}>
        <span className="text-xs font-semibold" style={{ color: 'var(--dr-text)' }}>
          {label}
        </span>
        {canAdvance && (
          <button
            onClick={() => onAdvance(order.id)}
            className="flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-lg text-white"
            style={{ background: 'var(--dr-primary)' }}
          >
            Avanzar <ChevronRight size={12} />
          </button>
        )}
      </div>
    </div>
  )
}
