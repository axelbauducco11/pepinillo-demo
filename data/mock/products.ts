import { Product, ProductCategory } from '@/types/product'

// Precios ficticios (demo) — Pepinillo no publica precios en sus redes.
export const PRODUCTS: Product[] = [
  // HAMBURGUESAS — cada una con variantes de tamaño (mismo groupId)
  { id: 'hb-01-simple', groupId: 'hb-01', name: 'Cheeseburger', sizeLabel: 'Simple', description: 'Medallón 120gr., cheddar x2, cebolla brunoise, ketchup', category: 'hamburguesas', price: 8500, emoji: '🍔' },
  { id: 'hb-01-doble', groupId: 'hb-01', name: 'Cheeseburger', sizeLabel: 'Doble', description: 'Medallón 120gr., cheddar x2, cebolla brunoise, ketchup', category: 'hamburguesas', price: 11500, emoji: '🍔' },
  { id: 'hb-01-triple', groupId: 'hb-01', name: 'Cheeseburger', sizeLabel: 'Triple', description: 'Medallón 120gr., cheddar x2, cebolla brunoise, ketchup', category: 'hamburguesas', price: 14500, emoji: '🍔' },

  { id: 'hb-02-simple', groupId: 'hb-02', name: 'Clásica', sizeLabel: 'Simple', description: 'Medallón 120gr., cheddar x1, lechuga, tomate, mayonesa especial', category: 'hamburguesas', price: 8000, emoji: '🍔' },
  { id: 'hb-02-doble', groupId: 'hb-02', name: 'Clásica', sizeLabel: 'Doble', description: 'Medallón 120gr., cheddar x1, lechuga, tomate, mayonesa especial', category: 'hamburguesas', price: 11000, emoji: '🍔' },
  { id: 'hb-02-triple', groupId: 'hb-02', name: 'Clásica', sizeLabel: 'Triple', description: 'Medallón 120gr., cheddar x1, lechuga, tomate, mayonesa especial', category: 'hamburguesas', price: 14000, emoji: '🍔' },

  { id: 'hb-03-simple', groupId: 'hb-03', name: 'B.E.C.', sizeLabel: 'Simple', description: 'Medallón 120gr., queso azul, cebolla y champignon a la manteca, salsa BEC', category: 'hamburguesas', price: 9500, emoji: '🍔' },
  { id: 'hb-03-doble', groupId: 'hb-03', name: 'B.E.C.', sizeLabel: 'Doble', description: 'Medallón 120gr., queso azul, cebolla y champignon a la manteca, salsa BEC', category: 'hamburguesas', price: 12500, emoji: '🍔' },
  { id: 'hb-03-triple', groupId: 'hb-03', name: 'B.E.C.', sizeLabel: 'Triple', description: 'Medallón 120gr., queso azul, cebolla y champignon a la manteca, salsa BEC', category: 'hamburguesas', price: 15500, emoji: '🍔' },

  { id: 'hb-04-simple', groupId: 'hb-04', name: 'Jalapa', sizeLabel: 'Simple', description: 'Medallón 120gr., cheddar x2, cebolla crispy, salsa jalapa smoke', category: 'hamburguesas', price: 9000, emoji: '🍔' },
  { id: 'hb-04-doble', groupId: 'hb-04', name: 'Jalapa', sizeLabel: 'Doble', description: 'Medallón 120gr., cheddar x2, cebolla crispy, salsa jalapa smoke', category: 'hamburguesas', price: 12000, emoji: '🍔' },
  { id: 'hb-04-triple', groupId: 'hb-04', name: 'Jalapa', sizeLabel: 'Triple', description: 'Medallón 120gr., cheddar x2, cebolla crispy, salsa jalapa smoke', category: 'hamburguesas', price: 15000, emoji: '🍔' },

  { id: 'hb-05-simple', groupId: 'hb-05', name: 'Megapepinillo', sizeLabel: 'Simple', description: 'Medallón 120gr., cheddar x2, lechuga, tomate, cebolla, pepinillo, bacon, salsa pepi', category: 'hamburguesas', price: 10000, emoji: '🥒' },
  { id: 'hb-05-doble', groupId: 'hb-05', name: 'Megapepinillo', sizeLabel: 'Doble', description: 'Medallón 120gr., cheddar x2, lechuga, tomate, cebolla, pepinillo, bacon, salsa pepi', category: 'hamburguesas', price: 13000, emoji: '🥒' },
  { id: 'hb-05-triple', groupId: 'hb-05', name: 'Megapepinillo', sizeLabel: 'Triple', description: 'Medallón 120gr., cheddar x2, lechuga, tomate, cebolla, pepinillo, bacon, salsa pepi', category: 'hamburguesas', price: 16000, emoji: '🥒' },

  { id: 'hb-06-simple', groupId: 'hb-06', name: 'B.C.B.', sizeLabel: 'Simple', description: 'Medallón 120gr., cheddar x2, bacon, cebolla brunoise, mostaza, ketchup', category: 'hamburguesas', price: 9500, emoji: '🍔' },
  { id: 'hb-06-doble', groupId: 'hb-06', name: 'B.C.B.', sizeLabel: 'Doble', description: 'Medallón 120gr., cheddar x2, bacon, cebolla brunoise, mostaza, ketchup', category: 'hamburguesas', price: 12500, emoji: '🍔' },
  { id: 'hb-06-triple', groupId: 'hb-06', name: 'B.C.B.', sizeLabel: 'Triple', description: 'Medallón 120gr., cheddar x2, bacon, cebolla brunoise, mostaza, ketchup', category: 'hamburguesas', price: 15500, emoji: '🍔' },

  { id: 'hb-07-simple', groupId: 'hb-07', name: 'Swiss Burger', sizeLabel: 'Simple', description: 'Doble medallón 120gr., queso blanco, cebolla grillada, tomate, salsa spread', category: 'hamburguesas', price: 11500, emoji: '🧀' },
  { id: 'hb-07-doble', groupId: 'hb-07', name: 'Swiss Burger', sizeLabel: 'Doble', description: 'Doble medallón 120gr., queso blanco, cebolla grillada, tomate, salsa spread', category: 'hamburguesas', price: 14500, emoji: '🧀' },
  { id: 'hb-07-triple', groupId: 'hb-07', name: 'Swiss Burger', sizeLabel: 'Triple', description: 'Doble medallón 120gr., queso blanco, cebolla grillada, tomate, salsa spread', category: 'hamburguesas', price: 17500, emoji: '🧀' },

  { id: 'hb-08-simple', groupId: 'hb-08', name: 'D.C.L.', sizeLabel: 'Simple', description: 'Doble medallón 120gr., cheddar x4, cebolla brunoise, ketchup, mostaza', category: 'hamburguesas', price: 12000, emoji: '🍔' },
  { id: 'hb-08-doble', groupId: 'hb-08', name: 'D.C.L.', sizeLabel: 'Doble', description: 'Doble medallón 120gr., cheddar x4, cebolla brunoise, ketchup, mostaza', category: 'hamburguesas', price: 15000, emoji: '🍔' },
  { id: 'hb-08-triple', groupId: 'hb-08', name: 'D.C.L.', sizeLabel: 'Triple', description: 'Doble medallón 120gr., cheddar x4, cebolla brunoise, ketchup, mostaza', category: 'hamburguesas', price: 18000, emoji: '🍔' },

  { id: 'hb-09-simple', groupId: 'hb-09', name: 'Big Pepi', sizeLabel: 'Simple', description: 'Doble medallón 120gr., cheddar x4, pepinillo, cebolla brunoise, lechuga, salsa pepinillo', category: 'hamburguesas', price: 12500, emoji: '🥒' },
  { id: 'hb-09-doble', groupId: 'hb-09', name: 'Big Pepi', sizeLabel: 'Doble', description: 'Doble medallón 120gr., cheddar x4, pepinillo, cebolla brunoise, lechuga, salsa pepinillo', category: 'hamburguesas', price: 15500, emoji: '🥒' },
  { id: 'hb-09-triple', groupId: 'hb-09', name: 'Big Pepi', sizeLabel: 'Triple', description: 'Doble medallón 120gr., cheddar x4, pepinillo, cebolla brunoise, lechuga, salsa pepinillo', category: 'hamburguesas', price: 18500, emoji: '🥒' },

  { id: 'hb-10-triple', groupId: 'hb-10', name: 'Meat Tower', sizeLabel: 'Triple', description: '3 medallones 120gr., cheddar x6, bacon, salsa spread', category: 'hamburguesas', price: 19500, emoji: '🗼' },
  { id: 'hb-10-cuadruple', groupId: 'hb-10', name: 'Meat Tower', sizeLabel: 'Cuádruple', description: '4 medallones 120gr., cheddar x8, bacon, salsa spread', category: 'hamburguesas', price: 23000, emoji: '🗼' },

  // PAPAS & COMBOS — precio único, sin variantes de tamaño más allá de lo listado
  { id: 'pc-01', name: 'Papas fritas chica', description: 'Porción individual', category: 'papas-combos', price: 3500, emoji: '🍟' },
  { id: 'pc-02', name: 'Papas fritas grande', description: 'Para compartir', category: 'papas-combos', price: 5500, emoji: '🍟' },
  { id: 'pc-03', name: 'Papas fritas americanas', description: 'Con panceta, cheddar y verdeo', category: 'papas-combos', price: 7500, emoji: '🍟' },
  { id: 'pc-04', name: 'Nuggets de pollo x8', description: 'Incluye salsa a elección', category: 'papas-combos', price: 6500, emoji: '🍗' },
  { id: 'pc-05', name: 'Picker de provolone', description: 'Queso provolone rebozado y frito, incluye salsa a elección', category: 'papas-combos', price: 6000, emoji: '🧀' },
  { id: 'pc-06', name: 'Dip individual', description: 'Mayonesa, mostaza, ketchup, barbacoa, mayo especial, BEC, jalapa o mega pepinillo', category: 'papas-combos', price: 800, emoji: '🥫' },

  // BEBIDAS
  { id: 'be-01', name: 'Lata 354ml', description: 'Pepsi, Pepsi Black, Mirinda Naranja o Seven Up', category: 'bebidas', price: 2000, emoji: '🥤' },
  { id: 'be-02', name: 'Botella 1,5L', description: 'Pepsi, Pepsi Black, Mirinda Manzana, Mirinda Naranja o Seven Up', category: 'bebidas', price: 4500, emoji: '🥤' },
  { id: 'be-03', name: 'Agua 0,5L', description: 'Con gas o sin gas', category: 'bebidas', price: 1800, emoji: '💧' },
]

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  hamburguesas: 'Hamburguesas',
  'papas-combos': 'Papas & Combos',
  bebidas: 'Bebidas',
}

export const CATEGORY_EMOJIS: Record<ProductCategory, string> = {
  hamburguesas: '🍔',
  'papas-combos': '🍟',
  bebidas: '🥤',
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter(p => p.category === category)
}

export interface ProductGroup {
  /** groupId si tiene variantes, o el id del producto si es de precio único */
  key: string
  name: string
  description?: string
  emoji?: string
  imageUrl?: string
  /** Todas las variantes de tamaño (o un único elemento si no tiene tamaños) */
  variants: Product[]
}

/**
 * Agrupa los productos de una categoría por groupId (variantes de tamaño de
 * una misma burger quedan bajo un solo card en la UI). Productos sin
 * groupId se muestran como grupo de una sola variante.
 */
export function getProductGroups(category: ProductCategory): ProductGroup[] {
  const products = getProductsByCategory(category)
  const groups = new Map<string, ProductGroup>()

  for (const product of products) {
    const key = product.groupId ?? product.id
    const existing = groups.get(key)
    if (existing) {
      existing.variants.push(product)
    } else {
      groups.set(key, {
        key,
        name: product.name,
        description: product.description,
        emoji: product.emoji,
        imageUrl: product.imageUrl,
        variants: [product],
      })
    }
  }

  return Array.from(groups.values())
}
