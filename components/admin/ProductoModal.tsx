'use client'
import { useState, useRef } from 'react'
import { Product, ProductCategory } from '@/types/product'
import { X, Upload, Trash2 } from 'lucide-react'

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'hamburguesas', label: 'Hamburguesas' },
  { value: 'papas-combos', label: 'Papas & Combos' },
  { value: 'bebidas', label: 'Bebidas' },
]

interface Props {
  product?: Product
  onSave: (data: Omit<Product, 'id'> & { id?: string }) => void
  onClose: () => void
}

export function ProductoModal({ product, onSave, onClose }: Props) {
  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [category, setCategory] = useState<ProductCategory>(
    product?.category ?? 'hamburguesas'
  )
  const [price, setPrice] = useState(String(product?.price ?? ''))
  const [emoji, setEmoji] = useState(product?.emoji ?? '')
  const [imageUrl, setImageUrl] = useState<string | undefined>(product?.imageUrl)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // Validar tamaño (máx 2MB para demo)
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen no puede superar 2MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = ev => setImageUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function handleSave() {
    if (!name.trim() || !price) return
    onSave({
      id: product?.id,
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      price: Number(price),
      emoji: emoji || undefined,
      imageUrl: imageUrl || undefined,
    })
    onClose()
  }

  // Preview: muestra imagen si hay, sino emoji, sino placeholder
  const previewContent = imageUrl ? (
    <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
  ) : (
    <span className="text-3xl">{emoji || '🍽️'}</span>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div
        className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        style={{ background: 'var(--dr-surface)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 pt-4 pb-3 border-b flex-shrink-0"
          style={{ borderColor: 'var(--dr-border)' }}
        >
          <h2 className="font-display font-bold text-lg" style={{ color: 'var(--dr-text)' }}>
            {product ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={onClose} aria-label="Cerrar">
            <X size={18} style={{ color: 'var(--dr-muted)' }} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4 overflow-y-auto flex-1">
          {/* Image upload */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--dr-muted)' }}>
              Foto del producto
            </label>

            <div className="flex items-center gap-4">
              {/* Preview */}
              <div
                className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                style={{ background: 'var(--dr-bg)', border: `2px dashed var(--dr-border)` }}
              >
                {previewContent}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border font-medium transition-colors hover:bg-gray-50"
                  style={{ borderColor: 'var(--dr-border)', color: 'var(--dr-text)' }}
                >
                  <Upload size={13} />
                  {imageUrl ? 'Cambiar foto' : 'Subir foto'}
                </button>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl(undefined)}
                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border font-medium text-red-500 border-red-200 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} />
                    Quitar foto
                  </button>
                )}
                <p className="text-xs" style={{ color: 'var(--dr-muted)' }}>
                  JPG, PNG, WebP — máx 2MB
                </p>
              </div>
            </div>

            {/* Tip: si no hay foto, se usa el emoji */}
            {!imageUrl && (
              <p className="text-xs mt-2 italic" style={{ color: 'var(--dr-muted)' }}>
                Sin foto, se muestra el emoji como ícono.
              </p>
            )}
          </div>

          {/* Text fields */}
          {[
            { label: 'Nombre *', value: name, onChange: setName, placeholder: 'Milanesa napolitana' },
            { label: 'Descripción', value: description, onChange: setDescription, placeholder: 'Con jamón y queso' },
            { label: 'Emoji (ícono alternativo)', value: emoji, onChange: setEmoji, placeholder: '🥩' },
          ].map(({ label, value, onChange, placeholder }) => (
            <div key={label}>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--dr-muted)' }}>
                {label}
              </label>
              <input
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ borderColor: 'var(--dr-border)', color: 'var(--dr-text)', background: 'var(--dr-bg)' }}
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--dr-muted)' }}>
              Categoría
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as ProductCategory)}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{ borderColor: 'var(--dr-border)', color: 'var(--dr-text)', background: 'var(--dr-bg)' }}
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--dr-muted)' }}>
              Precio ($) *
            </label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              min={0}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{ borderColor: 'var(--dr-border)', color: 'var(--dr-text)', background: 'var(--dr-bg)' }}
            />
          </div>
        </div>

        <div className="flex gap-2 px-5 py-4 border-t flex-shrink-0" style={{ borderColor: 'var(--dr-border)' }}>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border text-sm font-medium"
            style={{ borderColor: 'var(--dr-border)', color: 'var(--dr-muted)' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || !price}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
            style={{ background: 'var(--dr-primary)' }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
