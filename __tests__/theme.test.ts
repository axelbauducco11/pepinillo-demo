import { PALETTES, DEFAULT_PALETTE_ID } from '../lib/theme-palettes'

const REQUIRED_VARS = [
  '--dr-primary',
  '--dr-primary-dark',
  '--dr-bg',
  '--dr-surface',
  '--dr-accent',
  '--dr-text',
  '--dr-muted',
  '--dr-success',
  '--dr-border',
]

describe('PALETTES', () => {
  it('contiene al menos 5 paletas', () => {
    expect(PALETTES.length).toBeGreaterThanOrEqual(5)
  })

  it('cada paleta tiene los vars CSS requeridos', () => {
    PALETTES.forEach(palette => {
      REQUIRED_VARS.forEach(varName => {
        expect(palette.vars).toHaveProperty(varName)
      })
    })
  })

  it('cada paleta tiene id único', () => {
    const ids = PALETTES.map(p => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('el DEFAULT_PALETTE_ID existe en la lista', () => {
    expect(PALETTES.some(p => p.id === DEFAULT_PALETTE_ID)).toBe(true)
  })

  it('todos los valores de color tienen formato hex válido', () => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/
    PALETTES.forEach(palette => {
      Object.values(palette.vars).forEach(value => {
        expect(value).toMatch(hexRegex)
      })
    })
  })

  it('cada paleta tiene nombre, descripción y emoji', () => {
    PALETTES.forEach(palette => {
      expect(palette.name.length).toBeGreaterThan(0)
      expect(palette.description.length).toBeGreaterThan(0)
      expect(palette.emoji.length).toBeGreaterThan(0)
    })
  })
})
