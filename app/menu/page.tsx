'use client'
import { useState } from 'react'
import { MenuSection } from '@/components/cliente/MenuSection'
import { CartDrawer } from '@/components/cliente/CartDrawer'

export default function MenuPage() {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <>
      <MenuSection onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
