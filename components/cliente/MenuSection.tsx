'use client'
import { useState } from 'react'
import { CATEGORY_LABELS, CATEGORY_EMOJIS, getProductGroups, ProductGroup } from '@/data/mock/products'
import { ProductCategory, Product } from '@/types/product'
import { useCart } from '@/contexts/CartContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Minus, Plus, ShoppingCart, LayoutDashboard, BarChart2 } from 'lucide-react'
import { PanelInfoModal } from './PanelInfoModal'
import { DevFooter } from '@/components/landing/DevFooter'

const CATEGORIES: ProductCategory[] = ['hamburguesas', 'papas-combos', 'bebidas']

type ModalPanel = 'admin' | 'owner' | null

interface Props {
  onCartOpen: () => void
}

export function MenuSection({ onCartOpen }: Props) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('hamburguesas')
  const [panelModal, setPanelModal] = useState<ModalPanel>(null)
  const { addItem, setQuantity, getQuantity, items } = useCart()
  const { heroBg } = useTheme()
  const groups = getProductGroups(activeCategory)
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  // Tamaño elegido por grupo (solo aplica a grupos con más de 1 variante)
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({})

  function variantFor(group: ProductGroup): Product {
    if (group.variants.length === 1) return group.variants[0]
    const chosenId = selectedSize[group.key]
    return group.variants.find(v => v.id === chosenId) ?? group.variants[0]
  }

  return (
    <div
      className="min-h-screen pb-28"
      style={{
        backgroundImage: `linear-gradient(rgba(247,243,232,0.4), rgba(247,243,232,0.4)), url('${heroBg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Sticky header */}
      <header
        className="sticky top-0 z-30 border-b shadow-sm"
        style={{ background: 'var(--dr-primary)', borderColor: 'rgba(0,0,0,0.1)' }}
      >
        {/* Fila principal: título + botones demo + carrito */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 max-w-2xl mx-auto gap-2">
          <h1 className="font-display text-xl font-bold text-white flex-shrink-0">Menú</h1>

          {/* Botones de demo — modo prueba */}
          <div className="flex items-center gap-1.5 flex-1 justify-center">
            <button
              onClick={() => setPanelModal('admin')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-colors text-white border border-white/30 bg-white/15 hover:bg-white/25"
            >
              <LayoutDashboard size={12} />
              Admin
            </button>
            <button
              onClick={() => setPanelModal('owner')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-colors text-white border border-white/30 bg-white/15 hover:bg-white/25"
            >
              <BarChart2 size={12} />
              Dueño
            </button>
          </div>

          {/* Carrito */}
          <button
            onClick={onCartOpen}
            className="relative w-10 h-10 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0"
            aria-label="Ver carrito"
          >
            <ShoppingCart size={20} color="white" />
            {totalItems > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ background: 'var(--dr-surface)', color: 'var(--dr-primary)' }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 px-4 pb-3 max-w-2xl mx-auto overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all"
              style={{
                background: activeCategory === cat ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                color: activeCategory === cat ? 'var(--dr-primary)' : 'white',
              }}
            >
              <span>{CATEGORY_EMOJIS[cat]}</span>
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </header>

      {/* Product list */}
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        {groups.map(group => {
          const product = variantFor(group)
          const qty = getQuantity(product.id)
          return (
            <div
              key={group.key}
              className="rounded-2xl p-4 flex flex-col gap-3 shadow-sm"
              style={{ background: 'var(--dr-surface)' }}
            >
              <div className="flex items-center gap-4">
                {/* Foto o emoji placeholder */}
                <div
                  className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl overflow-hidden"
                  style={{ background: 'var(--dr-bg)' }}
                >
                  {group.imageUrl
                    ? <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover" />
                    : (group.emoji || '🍔')
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: 'var(--dr-text)' }}>
                    {group.name}
                  </p>
                  {group.description && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--dr-muted)' }}>
                      {group.description}
                    </p>
                  )}
                  <p className="text-base font-bold mt-1" style={{ color: 'var(--dr-primary)' }}>
                    ${product.price.toLocaleString('es-AR')}
                  </p>
                </div>

                {/* Quantity controls */}
                {qty > 0 ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setQuantity(product.id, qty - 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      style={{ background: 'var(--dr-bg)', color: 'var(--dr-primary)' }}
                      aria-label={`Quitar ${group.name}`}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-5 text-center font-bold text-sm" style={{ color: 'var(--dr-text)' }}>
                      {qty}
                    </span>
                    <button
                      onClick={() => addItem(product)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors"
                      style={{ background: 'var(--dr-primary)' }}
                      aria-label={`Agregar ${group.name}`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addItem(product)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                    style={{ background: 'var(--dr-primary)' }}
                    aria-label={`Agregar ${group.name}`}
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>

              {/* Selector de tamaño — solo si el grupo tiene más de una variante */}
              {group.variants.length > 1 && (
                <div className="flex gap-1.5 flex-wrap">
                  {group.variants.map(variant => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedSize(s => ({ ...s, [group.key]: variant.id }))}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                      style={{
                        background: product.id === variant.id ? 'var(--dr-primary)' : 'var(--dr-bg)',
                        color: product.id === variant.id ? 'white' : 'var(--dr-text)',
                      }}
                    >
                      {variant.sizeLabel}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Dev credit */}
      <DevFooter />

      {/* Modal de info del panel */}
      {panelModal && (
        <PanelInfoModal
          panel={panelModal}
          onClose={() => setPanelModal(null)}
        />
      )}
    </div>
  )
}
