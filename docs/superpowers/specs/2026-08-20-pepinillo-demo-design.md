# Demo Pepinillo Burger — Diseño

## Contexto

Demo de app de pedidos para mostrarle a Pepinillo (hamburguesería, Barrio Sur,
"Sali del frasco, pedite una Pepi") antes de comprometer infraestructura real.
Sigue el patrón establecido en `demo-restaurante` (mismo autor, `Projects/demo-restaurante`):
Next.js 14 App Router + TypeScript + Tailwind + shadcn/ui, sin backend — todo en
`lib/db.ts` sobre localStorage, listo para swapear a Supabase después.

Repo nuevo: `Projects/pepinillo-demo`, git propio (aislado del repo ambiental de
`C:\Users\Axel`), deploy a Vercel.

## Origen de datos del negocio

Extraído de capturas de Instagram (`pepinillo.burger`, 11 mil seguidores) que el
usuario compartió: story "Menú" (8 de mayo) y story "Horarios" (29 de junio).

- **Nombre:** Pepinillo
- **Dirección:** Lamadrid 731, Barrio Sur, S.M.T.
- **Horario:** Martes a Domingo, 20:30–00:30
- **Logo:** wordmark cursivo "Pepinillo" en verde oscuro
- **Paleta de marca:** verde oscuro `#1B4332` sobre crema `#F7F3E8`

## Alcance: igual a demo-restaurante, con estos deltas

### 1. Paleta nueva `pepinillo-verde`

Se agrega a `lib/theme-palettes.ts` como 9na paleta (las 8 existentes se
mantienen para que el ThemePanel siga mostrando variedad al cliente), y queda
seteada como default de esta demo:

```
id: 'pepinillo-verde'
--dr-primary: #1B4332
--dr-bg: #F7F3E8
```

Ajustar tonos secundarios/hover a partir de estos dos igual que las paletas
existentes (mismo mecanismo de generación, no hardcodear valores nuevos fuera
del patrón ya usado en `theme-palettes.ts`).

### 2. Fondo del hero

Imagen real provista por el usuario (mesa de madera, plato verde con burger +
papas, salsas en bowls de cobre, servilleta verde, wordmark "Pepinillo" en la
esquina) va como `public/backgrounds/pepinillo-verde.png`.

La imagen llegó pegada en el chat, no en disco — el asistente no tiene forma
de exportarla a archivo. **Pendiente: el usuario copia el archivo al path de
arriba antes de correr el proyecto**, o lo pasa por otro medio. Hasta entonces
se usa un placeholder del mismo tono (crema/madera) para no romper el build.

### 3. Menú real (reemplaza el mock genérico)

Categoría única "Hamburguesas" con selector de tamaño por producto (no 4
productos fijos). Precios ficticios realistas (AR, 2026) — el negocio no
publica precios en sus redes.

**Hamburguesas** — cada una con Simple/Doble/Triple (Meat Tower: Triple/Cuádruple):

| # | Nombre | Descripción | Simple | Doble | Triple |
|---|---|---|---|---|---|
| 01 | Cheeseburger | Medallón 120gr., cheddar x2, cebolla brunoise, ketchup | 8500 | 11500 | 14500 |
| 02 | Clásica | Medallón 120gr., cheddar x1, lechuga, tomate, mayonesa especial | 8000 | 11000 | 14000 |
| 03 | B.E.C. | Medallón 120gr., queso azul, cebolla y champignon a la manteca, salsa BEC | 9500 | 12500 | 15500 |
| 04 | Jalapa | Medallón 120gr., cheddar x2, cebolla crispy, salsa jalapa smoke | 9000 | 12000 | 15000 |
| 05 | Megapepinillo | Medallón 120gr., cheddar x2, lechuga, tomate, cebolla, pepinillo, bacon, salsa pepi | 10000 | 13000 | 16000 |
| 06 | B.C.B. | Medallón 120gr., cheddar x2, bacon, cebolla brunoise, mostaza, ketchup | 9500 | 12500 | 15500 |
| 07 | Swiss Burger | Doble medallón 120gr., queso blanco, cebolla grillada, tomate, salsa spread | 11500 | 14500 | 17500 |
| 08 | D.C.L. | Doble medallón 120gr., cheddar x4, cebolla brunoise, ketchup, mostaza | 12000 | 15000 | 18000 |
| 09 | Big Pepi | Doble medallón 120gr., cheddar x4, pepinillo, cebolla brunoise, lechuga, salsa pepinillo | 12500 | 15500 | 18500 |
| 10 | Meat Tower | 3 med. 120gr. cheddar x6 bacon salsa spread (Triple) / 4 med. 120gr. cheddar x8 bacon salsa spread (Cuádruple) | — | — | 19500 (Triple) / 23000 (Cuádruple) |

**Papas & Combos:**
- Papas fritas — Chica $3500 / Grande $5500
- Papas fritas americanas (panceta, cheddar, verdeo) — $7500
- Dips (mayonesa, mostaza, ketchup, barbacoa, mayo especial, BEC, jalapa, mega
  pepinillo) — $800 unidad
- Pan de chipa (opcional en cualquier burger) — sin cargo extra / +$500
- Nuggets de pollo x8 (con salsa a elección) — $6500
- Picker de provolone (con salsa a elección) — $6000

**Bebidas:**
- Latas 354ml (Pepsi, Pepsi Black, Mirinda Naranja, Seven Up) — $2000
- Botella 1,5L (Pepsi, Pepsi Black, Mirinda Manzana, Mirinda Naranja, Seven Up) — $4500
- Agua 0,5L — $1800

**Postres:** no existen en el menú real de Pepinillo. Se elimina la categoría
"Postres" del template genérico (no inventar productos que el local no vende).

### 4. Carrito con variantes

`CartContext` y `types/product.ts` deben soportar tamaño como parte de la
identidad del ítem en el carrito (mismo producto, dos tamaños distintos = dos
líneas separadas). Al hacer click "Agregar" en una burger se abre selector de
tamaño (reutilizar patrón de modal/sheet ya existente en
`components/cliente`) antes de sumar al carrito.

### 5. Resto del sistema: sin cambios funcionales

Admin (kanban de comandas, simulación automática, productos, stock con
alertas, compras exportables a Excel), Owner (KPIs, gráficos, rentabilidad,
gastos, nómina Excel), ThemePanel flotante arrastrable, DemoPopup a los 1.8s,
chips Admin/Dueño con modal explicativo, auth JWT (`admin@demo.com`/`admin123`,
`dueno@demo.com`/`dueno123`, cookie `dr_session`), footer "Desarrollado por:
Axel B." (`wa.me/5493815767476`) — todo igual a `demo-restaurante`, adaptado
solo en textos/paleta/datos.

## Fuera de alcance

- Integración con el WhatsApp real de Pepinillo (`wa.link/sgweue`) — el botón
  de pedido sigue siendo el flujo demo simulado, como en el proyecto hermano.
- Fotos reales de cada producto — se usan placeholders/ilustraciones como en
  demo-restaurante hasta que el cliente confirme y pase material.

## Testing

Reusar/adaptar la suite existente (`__tests__/auth.test.ts`,
`rate-limiter.test.ts`, `theme.test.ts`, `whatsapp.test.ts`) + agregar
cobertura para el selector de tamaño/precio en el carrito.
