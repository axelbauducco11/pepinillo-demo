export interface StockItem {
  id: string
  name: string
  quantity: number
  unit: string
  minStock: number
}

export interface PurchaseItem {
  id: string
  name: string
  quantity: number
  unit: string
  estimatedPrice: number
}
