'use client'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { ClientOrder, PaymentMethod, OrderModalidad } from '@/types/order'
import { WhatsAppDemoModal } from './WhatsAppDemoModal'
import { X, Minus, Plus, Trash2 } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: Props) {
  const { items, total, addItem, setQuantity, clearCart } = useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [modalidad, setModalidad] = useState<OrderModalidad>('retiro')
  const [address, setAddress] = useState('')
  const [payment, setPayment] = useState<PaymentMethod>('Efectivo')
  const [notes, setNotes] = useState('')
  const [waModalOpen, setWaModalOpen] = useState(false)
  const [pendingOrder, setPendingOrder] = useState<ClientOrder | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || items.length === 0) return
    if (modalidad === 'envio' && !address.trim()) return

    const order: ClientOrder = {
      customerName: name.trim(),
      phone: phone.trim(),
      modalidad,
      address: modalidad === 'envio' ? address.trim() : undefined,
      paymentMethod: payment,
      notes: notes.trim() || undefined,
      items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
      total,
    }

    setPendingOrder(order)
    setWaModalOpen(true)
  }

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-sm z-50 flex flex-col shadow-2xl"
        style={{ background: 'var(--dr-surface)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 pt-5 pb-4 border-b flex-shrink-0"
          style={{ background: 'var(--dr-surface)', borderColor: 'var(--dr-border)' }}
        >
          <h2 className="font-display text-xl font-bold" style={{ color: 'var(--dr-text)' }}>
            Tu pedido
          </h2>
          <button onClick={onClose} aria-label="Cerrar carrito">
            <X size={20} style={{ color: 'var(--dr-muted)' }} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="text-5xl mb-4">🛒</div>
            <p className="font-semibold" style={{ color: 'var(--dr-text)' }}>
              Tu carrito está vacío
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--dr-muted)' }}>
              Agregá algo del menú para empezar
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              {/* Items */}
              <div className="px-5 py-4 space-y-3 border-b" style={{ borderColor: 'var(--dr-border)' }}>
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <span className="text-xl">{item.emoji || '🍽️'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--dr-text)' }}>
                        {item.name}
                      </p>
                      <p className="text-xs font-semibold" style={{ color: 'var(--dr-primary)' }}>
                        ${(item.price * item.quantity).toLocaleString('es-AR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--dr-bg)', color: 'var(--dr-primary)' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span
                        className="w-4 text-center text-sm font-semibold"
                        style={{ color: 'var(--dr-text)' }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => addItem(item)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white"
                        style={{ background: 'var(--dr-primary)' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={clearCart}
                  className="flex items-center gap-1 text-xs mt-1"
                  style={{ color: 'var(--dr-muted)' }}
                >
                  <Trash2 size={12} /> Vaciar carrito
                </button>
              </div>

              {/* Order form */}
              <div className="px-5 py-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--dr-muted)' }}>
                    Nombre *
                  </label>
                  <input
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: 'var(--dr-border)', color: 'var(--dr-text)', background: 'var(--dr-bg)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--dr-muted)' }}>
                    Teléfono *
                  </label>
                  <input
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    type="tel"
                    placeholder="381-123-4567"
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: 'var(--dr-border)', color: 'var(--dr-text)', background: 'var(--dr-bg)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--dr-muted)' }}>
                    Modalidad
                  </label>
                  <div
                    className="flex rounded-xl overflow-hidden border"
                    style={{ borderColor: 'var(--dr-border)' }}
                  >
                    {(['retiro', 'envio'] as OrderModalidad[]).map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setModalidad(m)}
                        className="flex-1 py-2 text-sm font-medium transition-colors"
                        style={{
                          background: modalidad === m ? 'var(--dr-primary)' : 'var(--dr-surface)',
                          color: modalidad === m ? 'white' : 'var(--dr-text)',
                        }}
                      >
                        {m === 'retiro' ? '🏠 Retiro' : '🚗 Envío'}
                      </button>
                    ))}
                  </div>
                </div>

                {modalidad === 'envio' && (
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--dr-muted)' }}>
                      Dirección *
                    </label>
                    <input
                      required
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Calle y número"
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{ borderColor: 'var(--dr-border)', color: 'var(--dr-text)', background: 'var(--dr-bg)' }}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--dr-muted)' }}>
                    Forma de pago
                  </label>
                  <div
                    className="flex rounded-xl overflow-hidden border"
                    style={{ borderColor: 'var(--dr-border)' }}
                  >
                    {(['Efectivo', 'Transferencia'] as PaymentMethod[]).map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPayment(m)}
                        className="flex-1 py-2 text-sm font-medium transition-colors"
                        style={{
                          background: payment === m ? 'var(--dr-primary)' : 'var(--dr-surface)',
                          color: payment === m ? 'white' : 'var(--dr-text)',
                        }}
                      >
                        {m === 'Efectivo' ? '💵 Efectivo' : '📲 Transferencia'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--dr-muted)' }}>
                    Notas (opcional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Aclaraciones sobre tu pedido..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                    style={{ borderColor: 'var(--dr-border)', color: 'var(--dr-text)', background: 'var(--dr-bg)' }}
                  />
                </div>
              </div>
            </div>

            {/* Sticky footer */}
            <div
              className="px-5 py-4 border-t flex-shrink-0"
              style={{ background: 'var(--dr-surface)', borderColor: 'var(--dr-border)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold" style={{ color: 'var(--dr-text)' }}>
                  Total
                </span>
                <span
                  className="text-2xl font-bold font-display"
                  style={{ color: 'var(--dr-primary)' }}
                >
                  ${total.toLocaleString('es-AR')}
                </span>
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl text-white font-bold text-base shadow-md"
                style={{ background: '#25D366' }}
              >
                📲 Enviar por WhatsApp
              </button>
            </div>
          </form>
        )}
      </div>

      {/* WA Demo Modal */}
      {waModalOpen && pendingOrder && (
        <WhatsAppDemoModal
          order={pendingOrder}
          onClose={() => {
            setWaModalOpen(false)
            setPendingOrder(null)
            clearCart()
            onClose()
          }}
        />
      )}
    </>
  )
}
