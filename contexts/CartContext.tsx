'use client'
import { createContext, useContext, useReducer, ReactNode } from 'react'
import { CartItem, Product } from '@/types/product'

type CartAction =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; productId: string }
  | { type: 'SET_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR' }

interface CartState {
  items: CartItem[]
  total: number
}

function cartReducer(state: CartState, action: CartAction): CartState {
  let newItems: CartItem[]

  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.product.id)
      if (existing) {
        newItems = state.items.map(i =>
          i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      } else {
        newItems = [...state.items, { ...action.product, quantity: 1 }]
      }
      break
    }
    case 'REMOVE':
      newItems = state.items.filter(i => i.id !== action.productId)
      break
    case 'SET_QUANTITY':
      if (action.quantity <= 0) {
        newItems = state.items.filter(i => i.id !== action.productId)
      } else {
        newItems = state.items.map(i =>
          i.id === action.productId ? { ...i, quantity: action.quantity } : i
        )
      }
      break
    case 'CLEAR':
      newItems = []
      break
    default:
      return state
  }

  const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  return { items: newItems, total }
}

interface CartContextValue {
  items: CartItem[]
  total: number
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getQuantity: (productId: string) => number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })

  const value: CartContextValue = {
    items: state.items,
    total: state.total,
    addItem: product => dispatch({ type: 'ADD', product }),
    removeItem: productId => dispatch({ type: 'REMOVE', productId }),
    setQuantity: (productId, quantity) =>
      dispatch({ type: 'SET_QUANTITY', productId, quantity }),
    clearCart: () => dispatch({ type: 'CLEAR' }),
    getQuantity: productId =>
      state.items.find(i => i.id === productId)?.quantity ?? 0,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
