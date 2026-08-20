import { buildWhatsAppMessage, buildWhatsAppUrl } from '../lib/whatsapp'
import { ClientOrder } from '../types/order'

const baseOrder: ClientOrder = {
  customerName: 'Juan Pérez',
  phone: '381-123-4567',
  modalidad: 'retiro',
  paymentMethod: 'Efectivo',
  items: [
    { name: 'Milanesa napolitana', quantity: 2, price: 3200 },
    { name: 'Empanadas x6', quantity: 1, price: 1800 },
  ],
  total: 8200,
}

describe('buildWhatsAppMessage', () => {
  it('incluye el nombre del cliente', () => {
    expect(buildWhatsAppMessage(baseOrder)).toContain('Juan Pérez')
  })

  it('incluye el total formateado', () => {
    expect(buildWhatsAppMessage(baseOrder)).toContain('8.200')
  })

  it('NO incluye dirección en pedido de retiro', () => {
    expect(buildWhatsAppMessage(baseOrder)).not.toContain('Dirección')
  })

  it('incluye dirección en pedido de envío', () => {
    const order: ClientOrder = { ...baseOrder, modalidad: 'envio', address: 'Calle Falsa 123' }
    expect(buildWhatsAppMessage(order)).toContain('Calle Falsa 123')
  })

  it('lista items con cantidades', () => {
    const msg = buildWhatsAppMessage(baseOrder)
    expect(msg).toContain('2x Milanesa napolitana')
    expect(msg).toContain('1x Empanadas x6')
  })

  it('muestra precio parcial por item', () => {
    expect(buildWhatsAppMessage(baseOrder)).toContain('6.400') // 2 * 3200
  })

  it('menciona Retiro en sucursal', () => {
    expect(buildWhatsAppMessage(baseOrder)).toContain('Retiro en sucursal')
  })

  it('menciona Envío a domicilio', () => {
    const order: ClientOrder = { ...baseOrder, modalidad: 'envio', address: 'Av. Test 1' }
    expect(buildWhatsAppMessage(order)).toContain('Envío a domicilio')
  })

  it('incluye notas si las hay', () => {
    const order: ClientOrder = { ...baseOrder, notes: 'Sin cebolla' }
    expect(buildWhatsAppMessage(order)).toContain('Sin cebolla')
  })

  it('NO incluye línea de notas si están vacías', () => {
    expect(buildWhatsAppMessage(baseOrder)).not.toContain('Notas:')
  })

  it('incluye nombre del negocio personalizado', () => {
    expect(buildWhatsAppMessage(baseOrder, 'Restaurante Test')).toContain('Restaurante Test')
  })

  it('usa nombre genérico si no se pasa businessName', () => {
    expect(buildWhatsAppMessage(baseOrder)).toContain('Tu Restaurante')
  })
})

describe('buildWhatsAppUrl', () => {
  it('genera URL de wa.me con el número correcto', () => {
    const url = buildWhatsAppUrl(baseOrder, '5491123456789')
    expect(url).toMatch(/^https:\/\/wa\.me\/5491123456789\?text=/)
  })

  it('limpia el número de caracteres no numéricos', () => {
    const url = buildWhatsAppUrl(baseOrder, '+54-911-2345-6789')
    expect(url).toContain('wa.me/5491123456789')
  })

  it('mensaje está URL-encoded', () => {
    const url = buildWhatsAppUrl(baseOrder, '5491123456789')
    expect(url).toContain('%')
  })
})
