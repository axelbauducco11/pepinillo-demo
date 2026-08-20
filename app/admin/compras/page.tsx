'use client'
import { useState } from 'react'
import { MOCK_STOCK } from '@/data/mock/stock'
import { PurchaseItem } from '@/types/stock'
import { exportPurchaseOrder } from '@/lib/excel'
import { Plus, Trash2, Download } from 'lucide-react'

export default function ComprasPage() {
  const [items, setItems] = useState<PurchaseItem[]>([])
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    estimatedPrice: '',
  })
  const today = new Date().toISOString().slice(0, 10)

  function addFromStock(stock: (typeof MOCK_STOCK)[0]) {
    if (items.find(i => i.id === stock.id)) return
    setItems(prev => [
      ...prev,
      { id: stock.id, name: stock.name, quantity: 1, unit: stock.unit, estimatedPrice: 0 },
    ])
  }

  function addCustom() {
    if (!newItem.name.trim() || !newItem.quantity) return
    setItems(prev => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: newItem.name.trim(),
        quantity: Number(newItem.quantity),
        unit: newItem.unit,
        estimatedPrice: Number(newItem.estimatedPrice || 0),
      },
    ])
    setNewItem({ name: '', quantity: '', unit: 'kg', estimatedPrice: '' })
  }

  function updateItem(
    id: string,
    field: keyof PurchaseItem,
    value: number | string
  ) {
    setItems(prev =>
      prev.map(i =>
        i.id === id ? { ...i, [field]: typeof value === 'string' ? value : Number(value) } : i
      )
    )
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const total = items.reduce((sum, i) => sum + i.quantity * i.estimatedPrice, 0)

  return (
    <div className="py-4 max-w-3xl">
      <div className="flex items-center justify-between mb-4 pt-2">
        <h1
          className="font-display text-2xl font-bold"
          style={{ color: 'var(--dr-primary)' }}
        >
          Compras
        </h1>
        <button
          onClick={() => exportPurchaseOrder(items, today)}
          disabled={items.length === 0}
          className="flex items-center gap-1 text-sm px-4 py-2 rounded-lg font-medium text-white disabled:opacity-40"
          style={{ background: 'var(--dr-success)' }}
        >
          <Download size={15} /> Exportar Excel
        </button>
      </div>

      {/* Add from stock */}
      <div
        className="rounded-xl shadow-sm p-4 mb-4"
        style={{ background: 'var(--dr-surface)' }}
      >
        <h2 className="font-semibold text-sm mb-3" style={{ color: 'var(--dr-muted)' }}>
          Agregar desde stock
        </h2>
        <div className="flex flex-wrap gap-2">
          {MOCK_STOCK.map(s => (
            <button
              key={s.id}
              onClick={() => addFromStock(s)}
              disabled={!!items.find(i => i.id === s.id)}
              className="px-3 py-1 rounded-lg text-xs font-medium border transition-colors disabled:opacity-40"
              style={{
                borderColor: 'var(--dr-border)',
                color: 'var(--dr-text)',
                background: 'var(--dr-bg)',
              }}
            >
              + {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items list */}
      {items.length > 0 && (
        <div
          className="rounded-xl shadow-sm overflow-x-auto mb-4"
          style={{ background: 'var(--dr-surface)' }}
        >
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--dr-border)' }}>
                {['Insumo', 'Cantidad', 'Unidad', 'Precio est. ($)', 'Subtotal', ''].map(h => (
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
              {items.map(item => (
                <tr
                  key={item.id}
                  className="border-b last:border-0"
                  style={{ borderColor: 'var(--dr-border)' }}
                >
                  <td className="p-3 font-medium" style={{ color: 'var(--dr-text)' }}>
                    {item.name}
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={item.quantity}
                      min={0}
                      onChange={e => updateItem(item.id, 'quantity', e.target.value)}
                      className="w-16 border rounded px-2 py-1 text-sm"
                      style={{ borderColor: 'var(--dr-border)' }}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      value={item.unit}
                      onChange={e => updateItem(item.id, 'unit', e.target.value)}
                      className="w-16 border rounded px-2 py-1 text-sm"
                      style={{ borderColor: 'var(--dr-border)' }}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={item.estimatedPrice}
                      min={0}
                      onChange={e => updateItem(item.id, 'estimatedPrice', e.target.value)}
                      className="w-24 border rounded px-2 py-1 text-sm"
                      style={{ borderColor: 'var(--dr-border)' }}
                    />
                  </td>
                  <td className="p-3 font-medium" style={{ color: 'var(--dr-primary)' }}>
                    ${(item.quantity * item.estimatedPrice).toLocaleString('es-AR')}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 hover:bg-red-50 rounded"
                      aria-label={`Quitar ${item.name}`}
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr style={{ background: 'var(--dr-bg)' }}>
                <td
                  colSpan={4}
                  className="p-3 font-bold text-right"
                  style={{ color: 'var(--dr-text)' }}
                >
                  TOTAL
                </td>
                <td
                  colSpan={2}
                  className="p-3 font-bold text-lg"
                  style={{ color: 'var(--dr-primary)' }}
                >
                  ${total.toLocaleString('es-AR')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Add custom item */}
      <div
        className="rounded-xl shadow-sm p-4"
        style={{ background: 'var(--dr-surface)' }}
      >
        <h2 className="font-semibold text-sm mb-3" style={{ color: 'var(--dr-text)' }}>
          Agregar ítem personalizado
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
            className="px-3 py-2 rounded-lg border text-sm"
            style={{ borderColor: 'var(--dr-border)', background: 'var(--dr-bg)' }}
          />
          <input
            value={newItem.unit}
            onChange={e => setNewItem(p => ({ ...p, unit: e.target.value }))}
            placeholder="Unidad"
            className="px-3 py-2 rounded-lg border text-sm"
            style={{ borderColor: 'var(--dr-border)', background: 'var(--dr-bg)' }}
          />
          <input
            value={newItem.estimatedPrice}
            onChange={e => setNewItem(p => ({ ...p, estimatedPrice: e.target.value }))}
            placeholder="Precio estimado ($)"
            type="number"
            className="px-3 py-2 rounded-lg border text-sm col-span-2"
            style={{ borderColor: 'var(--dr-border)', background: 'var(--dr-bg)' }}
          />
        </div>
        <button
          onClick={addCustom}
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
