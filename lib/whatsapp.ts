import { ClientOrder } from '@/types/order'

// TODO: In production, businessName and phoneNumber come from business settings in database
export function buildWhatsAppMessage(order: ClientOrder, businessName = 'Tu Restaurante'): string {
  const itemLines = order.items
    .map(
      item =>
        `• ${item.quantity}x ${item.name} — $${(item.price * item.quantity).toLocaleString('es-AR')}`
    )
    .join('\n')

  const addressLine =
    order.modalidad === 'envio' && order.address
      ? `\n📍 Dirección: ${order.address}`
      : ''

  const notesLine = order.notes?.trim()
    ? `\n📝 Notas: ${order.notes.trim()}`
    : ''

  const modalidadLabel = order.modalidad === 'envio' ? 'Envío a domicilio' : 'Retiro en sucursal'

  return `🍽️ *NUEVO PEDIDO — ${businessName}*

👤 Cliente: ${order.customerName}
📞 Tel: ${order.phone}
📦 Modalidad: ${modalidadLabel}${addressLine}
💳 Pago: ${order.paymentMethod}${notesLine}

*Detalle del pedido:*
${itemLines}

💰 *TOTAL: $${order.total.toLocaleString('es-AR')}*`
}

export function buildWhatsAppUrl(
  order: ClientOrder,
  phoneNumber: string,
  businessName?: string
): string {
  const message = buildWhatsAppMessage(order, businessName)
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}
