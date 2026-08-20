# Demo Pepinillo Burger Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clone the working `demo-restaurante` app into a new `pepinillo-demo` repo and adapt it into a Pepinillo Burger ordering demo (real menu with size variants, Pepinillo branding/colors, real address/hours).

**Architecture:** Copy the entire `demo-restaurante` source tree as a starting point (same Next.js 14 App Router / TS / Tailwind / shadcn stack, same admin/owner/auth/theme-panel machinery — none of that changes). Then apply targeted deltas: a new brand palette, real product data with size variants grouped in the UI, and Pepinillo-specific copy in the Hero. Cart/checkout/admin/owner code paths are untouched — size variants are modeled as distinct `Product` rows sharing a `groupId`, so `CartContext`/`CartDrawer`/order flow work with zero changes.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, jose, bcryptjs, recharts, xlsx, Jest + Testing Library.

---

### Task 1: Copy base project into pepinillo-demo

**Files:**
- Create: everything under `C:\Users\Axel\Projects\pepinillo-demo\` (copied from `demo-restaurante`)

- [ ] **Step 1: Copy source tree, excluding git/build/deps artifacts**

```bash
cd "C:\Users\Axel\Projects"
for item in app components contexts data lib public types __tests__ \
            .eslintrc.json .gitignore components.json jest.config.ts \
            next.config.mjs next-env.d.ts postcss.config.mjs \
            tailwind.config.ts tsconfig.json package.json package-lock.json; do
  cp -r "demo-restaurante/$item" "pepinillo-demo/$item"
done
```

Expected: `pepinillo-demo` now has the full `demo-restaurante` structure (verify
with `ls pepinillo-demo`), but keeps its own `.git` and its own
`docs/superpowers/` (already there from the spec step — do not overwrite).

- [ ] **Step 2: Install dependencies**

Run: `cd "C:\Users\Axel\Projects\pepinillo-demo" && npm install`
Expected: installs without errors, creates `node_modules/` and refreshes `package-lock.json`.

- [ ] **Step 3: Commit the baseline copy**

```bash
cd "C:\Users\Axel\Projects\pepinillo-demo"
git add -A
git commit -m "chore: baseline copy from demo-restaurante"
```

---

### Task 2: Rename project and set JWT secret

**Files:**
- Modify: `package.json:1-3`
- Create: `.env.local`

- [ ] **Step 1: Rename in package.json**

In `package.json`, change:
```json
"name": "demo-restaurante",
```
to:
```json
"name": "pepinillo-demo",
```

- [ ] **Step 2: Create .env.local with a fresh secret**

```
JWT_SECRET=pepinillo-demo-super-secret-jwt-key-2026-production-ready
```

Confirm `.env.local` is already listed in `.gitignore` (it is, inherited from
demo-restaurante) — run `git check-ignore .env.local` and expect it to print
the path (meaning it's ignored).

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: rename package to pepinillo-demo"
```

(`.env.local` is gitignored, nothing to add there.)

---

### Task 3: Add Pepinillo brand palette

**Files:**
- Modify: `lib/theme-palettes.ts:11` (insert new entry into `PALETTES`), `lib/theme-palettes.ts:158` (`DEFAULT_PALETTE_ID`)

- [ ] **Step 1: Insert the palette**

Add this object as a new entry at the start of the `PALETTES` array (before
`rojo-clasico`), keeping every existing entry unchanged:

```typescript
  {
    id: 'pepinillo-verde',
    name: 'Pepinillo Verde',
    description: 'Hamburguesería Pepinillo',
    emoji: '🥒',
    defaultBg: '/backgrounds/pepinillo-verde.png',
    vars: {
      '--dr-primary': '#1B4332',
      '--dr-primary-dark': '#0F2A1F',
      '--dr-bg': '#F7F3E8',
      '--dr-surface': '#FFFFFF',
      '--dr-accent': '#52B788',
      '--dr-text': '#1B2A1F',
      '--dr-muted': '#4A6355',
      '--dr-success': '#2E7D32',
      '--dr-border': '#DCD4BE',
    },
  },
```

- [ ] **Step 2: Set it as default**

Change:
```typescript
export const DEFAULT_PALETTE_ID = 'rojo-clasico'
```
to:
```typescript
export const DEFAULT_PALETTE_ID = 'pepinillo-verde'
```

Note: `DEFAULT_PALETTE = PALETTES[0]` already picks whichever palette is first
in the array — since Step 1 inserted `pepinillo-verde` at index 0, this stays
consistent automatically. Verify by reading the line directly below it.

- [ ] **Step 3: Run existing palette tests**

Run: `npm test -- theme.test.ts`
Expected: PASS — all existing assertions (unique ids, required vars, hex
format, `DEFAULT_PALETTE_ID` present) hold for the new palette without any
test changes needed.

- [ ] **Step 4: Commit**

```bash
git add lib/theme-palettes.ts
git commit -m "feat: add pepinillo-verde brand palette as default"
```

---

### Task 4: Default business name

**Files:**
- Modify: `contexts/ThemeContext.tsx:34`

- [ ] **Step 1: Change the default businessName**

Change:
```typescript
  const [businessName, setBusinessNameState] = useState('Mi Restaurante')
```
to:
```typescript
  const [businessName, setBusinessNameState] = useState('Pepinillo')
```

- [ ] **Step 2: Commit**

```bash
git add contexts/ThemeContext.tsx
git commit -m "feat: default business name to Pepinillo"
```

---

### Task 5: Extend Product type for size variants

**Files:**
- Modify: `types/product.ts`

- [ ] **Step 1: Rewrite the file**

```typescript
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
```

This drops `postres` (not on Pepinillo's real menu) and adds `groupId`/`sizeLabel`
as optional fields — `CartItem`/`CartContext` need no other change since a
variant is just a `Product` with a distinct `id` and `price`.

- [ ] **Step 2: Commit**

```bash
git add types/product.ts
git commit -m "feat: product categories + size-variant fields"
```

---

### Task 6: Real Pepinillo menu data

**Files:**
- Modify: `data/mock/products.ts`
- Test: `__tests__/products.test.ts` (new)

- [ ] **Step 1: Write the failing test**

Create `__tests__/products.test.ts`:

```typescript
import { PRODUCTS, CATEGORY_LABELS, getProductsByCategory, getProductGroups } from '../data/mock/products'

describe('PRODUCTS', () => {
  it('no contiene la categoría postres (no existe en el menú real)', () => {
    expect(PRODUCTS.some(p => p.category === 'postres')).toBe(false)
  })

  it('cada burger con tamaños comparte un groupId y tiene sizeLabel', () => {
    const withGroup = PRODUCTS.filter(p => p.groupId)
    expect(withGroup.length).toBeGreaterThan(0)
    withGroup.forEach(p => {
      expect(p.sizeLabel).toBeTruthy()
    })
  })

  it('getProductGroups agrupa las variantes de Cheeseburger en un solo grupo con 3 tamaños', () => {
    const groups = getProductGroups('hamburguesas')
    const cheeseburger = groups.find(g => g.name === 'Cheeseburger')
    expect(cheeseburger).toBeTruthy()
    expect(cheeseburger!.variants.length).toBe(3)
    expect(cheeseburger!.variants.map(v => v.sizeLabel)).toEqual(['Simple', 'Doble', 'Triple'])
  })

  it('Meat Tower tiene 2 variantes: Triple y Cuádruple', () => {
    const groups = getProductGroups('hamburguesas')
    const meatTower = groups.find(g => g.name === 'Meat Tower')
    expect(meatTower!.variants.map(v => v.sizeLabel)).toEqual(['Triple', 'Cuádruple'])
  })

  it('bebidas y papas-combos no tienen groupId (precio único)', () => {
    const flat = [...getProductsByCategory('bebidas'), ...getProductsByCategory('papas-combos')]
    flat.forEach(p => expect(p.groupId).toBeUndefined())
  })

  it('CATEGORY_LABELS cubre las 3 categorías', () => {
    expect(Object.keys(CATEGORY_LABELS).sort()).toEqual(['bebidas', 'hamburguesas', 'papas-combos'])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- products.test.ts`
Expected: FAIL — `getProductGroups` is not exported yet, `postres` still exists.

- [ ] **Step 3: Rewrite data/mock/products.ts**

```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- products.test.ts`
Expected: PASS

- [ ] **Step 5: Run full test suite to check nothing else broke**

Run: `npm test`
Expected: PASS on all suites — `theme.test.ts` unaffected, `auth.test.ts` /
`rate-limiter.test.ts` / `whatsapp.test.ts` don't reference `PRODUCTS` so
they're unaffected by the category/shape change.

- [ ] **Step 6: Commit**

```bash
git add data/mock/products.ts __tests__/products.test.ts
git commit -m "feat: real Pepinillo menu with size variants"
```

---

### Task 7: Size-variant selector in the menu UI

**Files:**
- Modify: `components/cliente/MenuSection.tsx`

- [ ] **Step 1: Update imports and category list**

Change:
```typescript
import { PRODUCTS, CATEGORY_LABELS, CATEGORY_EMOJIS } from '@/data/mock/products'
import { ProductCategory } from '@/types/product'
```
to:
```typescript
import { CATEGORY_LABELS, CATEGORY_EMOJIS, getProductGroups, ProductGroup } from '@/data/mock/products'
import { ProductCategory, Product } from '@/types/product'
```

Change:
```typescript
const CATEGORIES: ProductCategory[] = ['principales', 'entradas', 'bebidas', 'postres']
```
to:
```typescript
const CATEGORIES: ProductCategory[] = ['hamburguesas', 'papas-combos', 'bebidas']
```

Change the initial active category:
```typescript
const [activeCategory, setActiveCategory] = useState<ProductCategory>('principales')
```
to:
```typescript
const [activeCategory, setActiveCategory] = useState<ProductCategory>('hamburguesas')
```

- [ ] **Step 2: Replace the flat product list with grouped products + a selected-size map**

Change:
```typescript
  const { addItem, setQuantity, getQuantity, items } = useCart()
  const products = PRODUCTS.filter(p => p.category === activeCategory)
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
```
to:
```typescript
  const { addItem, setQuantity, getQuantity, items } = useCart()
  const groups = getProductGroups(activeCategory)
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  // Tamaño elegido por grupo (solo aplica a grupos con más de 1 variante)
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({})

  function variantFor(group: ProductGroup): Product {
    if (group.variants.length === 1) return group.variants[0]
    const chosenId = selectedSize[group.key]
    return group.variants.find(v => v.id === chosenId) ?? group.variants[0]
  }
```

- [ ] **Step 3: Replace the product-list render block**

Change the whole `{products.map(product => { ... })}` block (everything from
`{products.map(product => {` through its closing `})}`) to iterate over
`groups` instead, adding a size-pill row when a group has more than one
variant:

```typescript
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
```

- [ ] **Step 4: Manually verify with the dev server**

Run: `npm run dev`, open `/menu`, click each category tab, click a size pill on
"Cheeseburger" and confirm the displayed price updates before adding to cart,
add two different sizes of the same burger and confirm the cart shows 2
separate lines with correct individual prices.

- [ ] **Step 5: Commit**

```bash
git add components/cliente/MenuSection.tsx
git commit -m "feat: size-variant selector in menu cards"
```

---

### Task 8: Pepinillo copy in the Hero

**Files:**
- Modify: `components/cliente/Hero.tsx:69-91`

- [ ] **Step 1: Update tagline**

Change:
```typescript
        <p className="text-lg text-center mb-8 max-w-xs text-white/80 drop-shadow">
          El mejor sabor, en tu puerta 🚀
        </p>
```
to:
```typescript
        <p className="text-lg text-center mb-8 max-w-xs text-white/80 drop-shadow">
          Salí del frasco, pedite una Pepi 🥒
        </p>
```

- [ ] **Step 2: Update address and hours**

Change:
```typescript
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-white/90" />
            <span>Av. Principal 1234, Ciudad</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-white/90" />
            <span>Lun–Dom: 12:00 – 23:00</span>
          </div>
```
to:
```typescript
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-white/90" />
            <span>Lamadrid 731, Barrio Sur</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-white/90" />
            <span>Mar–Dom: 20:30 – 00:30</span>
          </div>
```

- [ ] **Step 3: Update the initials fallback (shown only if no logo uploaded)**

Change:
```typescript
    : 'MR'
```
to:
```typescript
    : 'PP'
```

- [ ] **Step 4: Commit**

```bash
git add components/cliente/Hero.tsx
git commit -m "feat: Pepinillo copy, address and hours in Hero"
```

---

### Task 9: Hero background image

**Files:**
- Create: `public/backgrounds/pepinillo-verde.png`

- [ ] **Step 1: Check whether the user already dropped the real photo**

Run: `ls -la "C:\Users\Axel\Projects\pepinillo-demo\public\backgrounds\pepinillo-verde.png" 2>/dev/null || echo MISSING`

- [ ] **Step 2a: If MISSING, copy a placeholder from an existing palette so the build doesn't 404**

```bash
cp "C:\Users\Axel\Projects\demo-restaurante\public\backgrounds\naranja-vibrante.png" \
   "C:\Users\Axel\Projects\pepinillo-demo\public\backgrounds\pepinillo-verde.png"
```

Leave a note in the task tracker / tell the user directly: this is a
placeholder — the real photo (wood table, green plate with burger + fries,
copper sauce bowls, green napkin, "Pepinillo" wordmark) needs to be dropped
into this exact path by the user, replacing the placeholder, since it arrived
pasted in chat and there's no tool to export it to disk.

- [ ] **Step 2b: If the file is already present (user saved it), skip 2a.**

- [ ] **Step 3: Commit whatever is in place**

```bash
git add public/backgrounds/pepinillo-verde.png
git commit -m "chore: hero background for pepinillo-verde (placeholder pending real photo)"
```

---

### Task 10: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all suites PASS (`auth`, `rate-limiter`, `theme`, `whatsapp`, `products`).

- [ ] **Step 2: Type-check and build**

Run: `npm run build`
Expected: build succeeds with no TypeScript errors (this catches any leftover
reference to the removed `principales`/`entradas`/`postres` categories or to
the old flat `PRODUCTS.filter` pattern anywhere else in the codebase).

- [ ] **Step 3: If build fails on a stray reference, grep and fix**

Run: `grep -rn "principales\|entradas\|postres" app components data lib types`
Fix any remaining reference the same way Task 6/7 did, then re-run Step 2.

- [ ] **Step 4: Smoke-test the three roles manually**

Run: `npm run dev`, then in the browser:
- `/` → hero shows Pepinillo green palette, wordmark/initials, Lamadrid 731 address, Mar–Dom hours
- `/menu` → add a Doble Cheeseburger and a Simple Clásica to cart, open cart, confirm 2 lines with correct prices and total
- Complete the order form (retiro, efectivo) → confirm WhatsApp demo modal shows the right item list and total
- Click the 🎨 button → confirm "Pepinillo Verde" is the active palette, other 8 palettes still selectable
- `admin@demo.com` / `admin123` → `/admin` loads, kanban visible
- `dueno@demo.com` / `dueno123` → `/owner` loads, KPIs visible

- [ ] **Step 5: Commit if any fixes were made in this task**

```bash
git add -A
git commit -m "fix: verification pass cleanup"
```

(Skip this step if Steps 1-4 needed no code changes.)

---

### Task 11: Push to GitHub

**Files:** none (repo operation)

- [ ] **Step 1: Confirm no personal/ambient files are staged**

Run: `git -C "C:\Users\Axel\Projects\pepinillo-demo" status`
Expected: only project files tracked — no paths from `C:\Users\Axel` outside
this folder (guards against the ambient-home-repo issue).

- [ ] **Step 2: Create the GitHub repo and push (ask user for confirmation first — this is outward-facing)**

```bash
cd "C:\Users\Axel\Projects\pepinillo-demo"
gh repo create pepinillo-demo --public --source=. --remote=origin --push
```

Expected: prints the new repo URL, `origin` remote configured, `main` branch pushed.

- [ ] **Step 3: Report the repo URL and hand off to the deploy-demo-to-vercel skill for the Vercel connection step (out of scope for this plan).**
