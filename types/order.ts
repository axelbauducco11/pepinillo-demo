export type OrderStatus = 'PENDIENTE' | 'CONFIRMADO' | 'EN_PREPARACION' | 'LISTO'
export type OrderModalidad = 'retiro' | 'envio'
export type PaymentMethod = 'Efectivo' | 'Transferencia'

export interface OrderItem {
  name: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  number: string
  customerName: string
  phone: string
  modalidad: OrderModalidad
  address?: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: Date
}

export interface ClientOrder {
  customerName: string
  phone: string
  modalidad: OrderModalidad
  address?: string
  paymentMethod: PaymentMethod
  notes?: string
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
}
