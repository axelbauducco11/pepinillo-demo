import { Product } from '@/types/product'

export const PRODUCTS: Product[] = [
  // PRINCIPALES
  { id: 'pr-01', name: 'Plato del día', description: 'Varía según la temporada', category: 'principales', price: 2800, emoji: '🍽️' },
  { id: 'pr-02', name: 'Milanesa napolitana', description: 'Con jamón, queso y tomate', category: 'principales', price: 3200, emoji: '🥩' },
  { id: 'pr-03', name: 'Pasta al pomodoro', description: 'Tallarines con salsa de tomate fresco', category: 'principales', price: 2400, emoji: '🍝' },
  { id: 'pr-04', name: 'Pollo al limón', description: 'Con papas rústicas y ensalada', category: 'principales', price: 3000, emoji: '🍗' },
  // ENTRADAS
  { id: 'en-01', name: 'Empanadas x6', description: 'Carne, jamón y queso, o caprese', category: 'entradas', price: 1800, emoji: '🥟' },
  { id: 'en-02', name: 'Tabla de fiambres', description: 'Quesos, salames y pan casero', category: 'entradas', price: 2200, emoji: '🧀' },
  { id: 'en-03', name: 'Provoleta', description: 'Con pimientos asados', category: 'entradas', price: 1500, emoji: '🫕' },
  { id: 'en-04', name: 'Ensalada mixta', description: 'Lechuga, tomate, zanahoria y cebolla', category: 'entradas', price: 1200, emoji: '🥗' },
  // BEBIDAS
  { id: 'be-01', name: 'Agua mineral 500ml', description: 'Con o sin gas', category: 'bebidas', price: 600, emoji: '💧' },
  { id: 'be-02', name: 'Gaseosa 500ml', description: 'Coca-Cola, Sprite o Fanta', category: 'bebidas', price: 800, emoji: '🥤' },
  { id: 'be-03', name: 'Cerveza artesanal', description: 'Rubia, negra o roja — 500ml', category: 'bebidas', price: 1400, emoji: '🍺' },
  { id: 'be-04', name: 'Vino de la casa', description: 'Copa de tinto o blanco', category: 'bebidas', price: 1200, emoji: '🍷' },
  // POSTRES
  { id: 'po-01', name: 'Tiramisú', description: 'Receta original italiana', category: 'postres', price: 1600, emoji: '🍰' },
  { id: 'po-02', name: 'Helado artesanal', description: 'Dos bochas a elección', category: 'postres', price: 1100, emoji: '🍨' },
  { id: 'po-03', name: 'Brownie con helado', description: 'Tibio con helado de crema', category: 'postres', price: 1400, emoji: '🍫' },
  { id: 'po-04', name: 'Flan casero', description: 'Con dulce de leche y crema', category: 'postres', price: 1000, emoji: '🍮' },
]

export const CATEGORY_LABELS: Record<string, string> = {
  principales: 'Principales',
  entradas: 'Entradas',
  bebidas: 'Bebidas',
  postres: 'Postres',
}

export const CATEGORY_EMOJIS: Record<string, string> = {
  principales: '🍽️',
  entradas: '🥟',
  bebidas: '🥤',
  postres: '🍰',
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter(p => p.category === category)
}
