import { Order } from '@/types/order'

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-001', number: '#001',
    customerName: 'Martina García', phone: '381-456-7890',
    modalidad: 'envio', address: 'Av. Belgrano 1234, piso 3',
    items: [
      { name: 'Milanesa napolitana', quantity: 2, unitPrice: 3200 },
      { name: 'Agua mineral 500ml', quantity: 2, unitPrice: 600 },
    ],
    total: 7600, status: 'PENDIENTE', createdAt: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: 'ord-002', number: '#002',
    customerName: 'Carlos Rodríguez', phone: '381-234-5678',
    modalidad: 'retiro',
    items: [
      { name: 'Empanadas x6', quantity: 1, unitPrice: 1800 },
      { name: 'Gaseosa 500ml', quantity: 2, unitPrice: 800 },
    ],
    total: 3400, status: 'CONFIRMADO', createdAt: new Date(Date.now() - 18 * 60 * 1000),
  },
  {
    id: 'ord-003', number: '#003',
    customerName: 'Ana Pérez', phone: '381-987-6543',
    modalidad: 'envio', address: 'Calle Córdoba 567',
    items: [
      { name: 'Pasta al pomodoro', quantity: 2, unitPrice: 2400 },
      { name: 'Vino de la casa', quantity: 1, unitPrice: 1200 },
    ],
    total: 6000, status: 'EN_PREPARACION', createdAt: new Date(Date.now() - 32 * 60 * 1000),
  },
  {
    id: 'ord-004', number: '#004',
    customerName: 'Luis Fernández', phone: '381-111-2222',
    modalidad: 'retiro',
    items: [
      { name: 'Pollo al limón', quantity: 1, unitPrice: 3000 },
      { name: 'Tiramisú', quantity: 2, unitPrice: 1600 },
    ],
    total: 6200, status: 'LISTO', createdAt: new Date(Date.now() - 55 * 60 * 1000),
  },
]

let orderCounter = 5

const NAMES = ['Sofía López', 'Diego Torres', 'Valeria Sosa', 'Mateo Gómez', 'Lucía Herrera']
const ITEMS = [
  { name: 'Milanesa napolitana', unitPrice: 3200 },
  { name: 'Empanadas x6', unitPrice: 1800 },
  { name: 'Pasta al pomodoro', unitPrice: 2400 },
  { name: 'Pollo al limón', unitPrice: 3000 },
  { name: 'Tabla de fiambres', unitPrice: 2200 },
]

export function generateMockOrder(): Order {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)]
  const item = ITEMS[Math.floor(Math.random() * ITEMS.length)]
  const qty = Math.ceil(Math.random() * 2)
  const num = String(orderCounter++).padStart(3, '0')
  return {
    id: `ord-${num}`, number: `#${num}`,
    customerName: name,
    phone: `381-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
    modalidad: Math.random() > 0.5 ? 'envio' : 'retiro',
    address: Math.random() > 0.5 ? 'Av. Alem 890' : undefined,
    items: [{ name: item.name, quantity: qty, unitPrice: item.unitPrice }],
    total: qty * item.unitPrice,
    status: 'PENDIENTE',
    createdAt: new Date(),
  }
}
