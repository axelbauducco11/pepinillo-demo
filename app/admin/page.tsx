'use client'
import { useState, useEffect } from 'react'
import { MOCK_ORDERS, generateMockOrder } from '@/data/mock/orders'
import { Order, OrderStatus } from '@/types/order'
import { ComandaCard } from '@/components/admin/ComandaCard'
import { Bell } from 'lucide-react'

const STATUS_ORDER: OrderStatus[] = ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO']

export default function ComandasPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [notification, setNotification] = useState(false)

  function addSimulatedOrder() {
    setOrders(prev => [generateMockOrder(), ...prev])
    setNotification(true)
    if ('vibrate' in navigator) navigator.vibrate([200, 100, 200])
    setTimeout(() => setNotification(false), 3000)
  }

  function advanceOrder(orderId: string) {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order
        const idx = STATUS_ORDER.indexOf(order.status)
        if (idx === STATUS_ORDER.length - 1) return order
        return { ...order, status: STATUS_ORDER[idx + 1] }
      })
    )
  }

  // TODO: Replace with WebSocket or SSE for real-time orders from the backend
  useEffect(() => {
    const interval = setInterval(addSimulatedOrder, 45000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const grouped = {
    PENDIENTE: orders.filter(o => o.status === 'PENDIENTE'),
    CONFIRMADO: orders.filter(o => o.status === 'CONFIRMADO'),
    EN_PREPARACION: orders.filter(o => o.status === 'EN_PREPARACION'),
    LISTO: orders.filter(o => o.status === 'LISTO'),
  }

  return (
    <div className="py-4">
      {notification && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-white font-semibold shadow-lg flex items-center gap-2"
          style={{ background: 'var(--dr-primary)' }}
        >
          <Bell size={16} /> ¡Nuevo pedido recibido!
        </div>
      )}

      <div className="flex items-center justify-between mb-6 pt-4">
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--dr-primary)' }}>
          Comandas
        </h1>
        <button
          onClick={addSimulatedOrder}
          className="text-sm px-4 py-2 rounded-lg font-medium text-white"
          style={{ background: 'var(--dr-primary)' }}
        >
          + Simular pedido
        </button>
      </div>

      {/* Mobile: vertical list */}
      <div className="space-y-6 md:hidden">
        {STATUS_ORDER.map(status =>
          grouped[status].length > 0 ? (
            <div key={status}>
              <h2
                className="font-semibold text-sm mb-2 px-1"
                style={{ color: 'var(--dr-muted)' }}
              >
                {status.replace('_', ' ')} ({grouped[status].length})
              </h2>
              <div className="space-y-3">
                {grouped[status].map(order => (
                  <ComandaCard key={order.id} order={order} onAdvance={advanceOrder} />
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* Desktop: kanban columns */}
      <div className="hidden md:grid grid-cols-4 gap-4">
        {STATUS_ORDER.map(status => (
          <div key={status}>
            <h2
              className="font-semibold text-sm mb-3 text-center px-2 py-1 rounded-lg"
              style={{ background: 'var(--dr-border)', color: 'var(--dr-text)' }}
            >
              {status.replace('_', ' ')} ({grouped[status].length})
            </h2>
            <div className="space-y-3">
              {grouped[status].map(order => (
                <ComandaCard key={order.id} order={order} onAdvance={advanceOrder} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
