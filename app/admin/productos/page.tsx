'use client'
import { useState } from 'react'
import { PRODUCTS, CATEGORY_LABELS } from '@/data/mock/products'
import { Product, ProductCategory } from '@/types/product'
import { ProductoModal } from '@/components/admin/ProductoModal'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'

const CATEGORIES: ProductCategory[] = ['hamburguesas', 'papas-combos', 'bebidas']

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS)
  const [editing, setEditing] = useState<Product | null | 'new'>(null)
  const [search, setSearch] = useState('')

  function saveProduct(data: Omit<Product, 'id'> & { id?: string }) {
    if (data.id) {
      setProducts(prev => prev.map(p => (p.id === data.id ? ({ ...p, ...data } as Product) : p)))
    } else {
      setProducts(prev => [...prev, { ...data, id: `p-${Date.now()}` }])
    }
  }

  function deleteProduct(id: string) {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="py-4 max-w-2xl">
      <div className="flex items-center justify-between mb-4 pt-2">
        <h1
          className="font-display text-2xl font-bold"
          style={{ color: 'var(--dr-primary)' }}
        >
          Productos
        </h1>
        <button
          onClick={() => setEditing('new')}
          className="flex items-center gap-1 text-sm px-4 py-2 rounded-lg font-medium text-white"
          style={{ background: 'var(--dr-primary)' }}
        >
          <Plus size={16} /> Agregar
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--dr-muted)' }}
        />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm"
          style={{
            borderColor: 'var(--dr-border)',
            color: 'var(--dr-text)',
            background: 'var(--dr-surface)',
          }}
        />
      </div>

      {/* Product list by category */}
      {CATEGORIES.map(cat => {
        const items = filtered.filter(p => p.category === cat)
        if (items.length === 0) return null
        return (
          <div key={cat} className="mb-6">
            <h2
              className="font-semibold text-sm mb-2 px-1"
              style={{ color: 'var(--dr-muted)' }}
            >
              {CATEGORY_LABELS[cat]}
            </h2>
            <div className="space-y-2">
              {items.map(p => (
                <div
                  key={p.id}
                  className="rounded-xl p-3 flex items-center gap-3 shadow-sm"
                  style={{ background: 'var(--dr-surface)' }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden"
                    style={{ background: 'var(--dr-bg)' }}
                  >
                    {p.imageUrl
                      ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      : (p.emoji || '🍽️')
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: 'var(--dr-text)' }}>
                      {p.name}
                    </p>
                    {p.description && (
                      <p className="text-xs truncate" style={{ color: 'var(--dr-muted)' }}>
                        {p.description}
                      </p>
                    )}
                    <p className="text-sm font-medium" style={{ color: 'var(--dr-primary)' }}>
                      ${p.price.toLocaleString('es-AR')}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditing(p)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label={`Editar ${p.name}`}
                  >
                    <Pencil size={15} style={{ color: 'var(--dr-muted)' }} />
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    aria-label={`Eliminar ${p.name}`}
                  >
                    <Trash2 size={15} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {editing !== null && (
        <ProductoModal
          product={editing === 'new' ? undefined : editing}
          onSave={saveProduct}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
