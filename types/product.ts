export type ProductCategory = 'principales' | 'entradas' | 'bebidas' | 'postres'

export interface Product {
  id: string
  name: string
  description?: string
  category: ProductCategory
  price: number
  emoji?: string
  imageUrl?: string   // base64 o URL — cargada desde el panel admin
}

export interface CartItem extends Product {
  quantity: number
}
