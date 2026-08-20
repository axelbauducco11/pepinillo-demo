'use client'
import { useState } from 'react'
import { MOCK_STOCK } from '@/data/mock/stock'
import { StockItem } from '@/types/stock'
import { Plus, Trash2 } from 'lucide-react'

export default function StockPage() {
  const [stock, setStock] = useState<StockItem[]>(MOCK_STOCK)
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: 'kg', minStock: '' })

  function updateQuantity(id: string, quantity: number) {
    setStock(prev => prev.map(s => (s.id === id ? { ...s, quantity } : s)))
  }

  function deleteItem(id: string) {
    setStock(prev => prev.filter(s => s.id !== id))
  }

  function addItem() {
    if (!newItem.name.trim() || !newItem.quantity) return
    setStock(prev => [
      ...prev,
      {
        id: `st-${Date.now()}`,
        name: newItem.name.trim(),
        quantity: Number(newItem.quantity),
        unit: newItem.unit,
        minStock: Number(newItem.minStock || 0),
      },
    ])
    setNewItem({ name: '', quantity: '', unit: 'kg', minStock: '' })
  }

  return (
    <div className="py-4 max-w-2xl">
      <h1
        className="font-display text-2xl font-bold mb-4 pt-2"
        style={{ color: 'var(--dr-primary)' }}
      >
        Stock
      </h1>

      {/* Stock table */}
      <div
        className="rounded-xl shadow-sm overflow-x-auto mb-6"
        style={{ background: 'var(--dr-surface)' }}
      >
        <table className="w-full text-sm min-w-[420px]">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--dr-border)' }}>
              {['Insumo', 'Cantidad', 'Unidad', 'Mín.', ''].map(h => (
                <th
                  key={h}
                  className="p-3 text-left font-semibold"
                  style={{ color: 'var(--dr-muted)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stock.map(item => {
              const isLow = item.quantity <= item.minStock
              return (
                <tr
                  key={item.id}
                  className="border-b last:border-0"
                  style={{
                    borderColor: 'var(--dr-border)',
                    background: isLow ? '#FFF3E0' : undefined,
                  }}
                >
                  <td className="p-3 font-medium" style={{ color: 'var(--dr-text)' }}>
                    {item.name}
                    {isLow && (
                      <span className="ml-2 text-xs text-orange-600 font-semibold">
                        ⚠ Bajo
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={item.quantity}
                      min={0}
                      onChange={e => updateQuantity(item.id, Number(e.target.value))}
                      className="w-20 text-right border rounded px-2 py-1 text-sm"
                      style={{ borderColor: 'var(--dr-border)' }}
                    />
                  </td>
                  <td className="p-3" style={{ color: 'var(--dr-muted)' }}>
                    {item.unit}
                  </td>
                  <td className="p-3" style={{ color: 'var(--dr-muted)' }}>
                    {item.minStock}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-1 hover:bg-red-50 rounded transition-colors"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Add new item */}
      <div
        className="rounded-xl shadow-sm p-4"
        style={{ background: 'var(--dr-surface)' }}
      >
        <h2 className="font-semibold text-sm mb-3" style={{ color: 'var(--dr-text)' }}>
          Agregar insumo
        </h2>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            value={newItem.name}
            onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
            placeholder="Nombre"
            className="px-3 py-2 rounded-lg border text-sm col-span-2"
            style={{ borderColor: 'var(--dr-border)', background: 'var(--dr-bg)' }}
          />
          <input
            value={newItem.quantity}
            onChange={e => setNewItem(p => ({ ...p, quantity: e.target.value }))}
            placeholder="Cantidad"
            type="number"
            min={0}
            className="px-3 py-2 rounded-lg border text-sm"
            style={{ borderColor: 'var(--dr-border)', background: 'var(--dr-bg)' }}
          />
          <input
            value={newItem.unit}
            onChange={e => setNewItem(p => ({ ...p, unit: e.target.value }))}
            placeholder="Unidad (kg, L...)"
            className="px-3 py-2 rounded-lg border text-sm"
            style={{ borderColor: 'var(--dr-border)', background: 'var(--dr-bg)' }}
          />
          <input
            value={newItem.minStock}
            onChange={e => setNewItem(p => ({ ...p, minStock: e.target.value }))}
            placeholder="Stock mínimo"
            type="number"
            min={0}
            className="px-3 py-2 rounded-lg border text-sm col-span-2"
            style={{ borderColor: 'var(--dr-border)', background: 'var(--dr-bg)' }}
          />
        </div>
        <button
          onClick={addItem}
          disabled={!newItem.name.trim() || !newItem.quantity}
          className="flex items-center gap-1 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
          style={{ background: 'var(--dr-primary)' }}
        >
          <Plus size={14} /> Agregar
        </button>
      </div>
    </div>
  )
}
