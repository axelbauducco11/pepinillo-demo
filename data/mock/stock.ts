import { StockItem } from '@/types/stock'

export const MOCK_STOCK: StockItem[] = [
  { id: 'st-01', name: 'Harina 000', quantity: 25, unit: 'kg', minStock: 10 },
  { id: 'st-02', name: 'Aceite de oliva', quantity: 8, unit: 'L', minStock: 5 },
  { id: 'st-03', name: 'Tomates pelados', quantity: 40, unit: 'latas', minStock: 20 },
  { id: 'st-04', name: 'Mozarella', quantity: 15, unit: 'kg', minStock: 8 },
  { id: 'st-05', name: 'Pollo', quantity: 20, unit: 'kg', minStock: 10 },
  { id: 'st-06', name: 'Carne picada', quantity: 12, unit: 'kg', minStock: 8 },
  { id: 'st-07', name: 'Cerveza artesanal', quantity: 48, unit: 'botellas', minStock: 24 },
  { id: 'st-08', name: 'Vino tinto', quantity: 18, unit: 'botellas', minStock: 12 },
  { id: 'st-09', name: 'Gaseosas', quantity: 60, unit: 'unidades', minStock: 30 },
  { id: 'st-10', name: 'Agua mineral', quantity: 36, unit: 'unidades', minStock: 24 },
]
