export type ProductCategory = 'hamburguesas' | 'papas-combos' | 'bebidas'

export interface Product {
  id: string
  name: string
  description?: string
  category: ProductCategory
  price: number
  emoji?: string
  imageUrl?: string   // base64 o URL — cargada desde el panel admin
  /** Agrupa variantes de tamaño del mismo producto base (ej. burger simple/doble/triple). */
  groupId?: string
  /** Etiqueta de tamaño mostrada en el selector, ej. "Simple", "Doble", "Triple". */
  sizeLabel?: string
}

export interface CartItem extends Product {
  quantity: number
}
