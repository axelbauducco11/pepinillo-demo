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
