'use client'
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { PALETTES, DEFAULT_PALETTE, ThemePalette } from '@/lib/theme-palettes'

interface ThemeContextValue {
  palette: ThemePalette
  setPalette: (palette: ThemePalette) => void
  businessName: string
  setBusinessName: (name: string) => void
  logoUrl: string | null
  setLogoUrl: (url: string | null) => void
  palettes: ThemePalette[]
  /** URL del fondo del hero: base64 si es custom, ruta /backgrounds/ si es el de la paleta */
  heroBg: string
  /** true si el usuario subió una foto propia */
  isCustomHeroBg: boolean
  setCustomHeroBg: (url: string | null) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const LS_PALETTE    = 'dr_palette_id'
const LS_NAME       = 'dr_business_name'
const LS_CUSTOM_BG  = 'dr_custom_hero_bg'

function applyPalette(palette: ThemePalette) {
  Object.entries(palette.vars).forEach(([varName, value]) => {
    document.documentElement.style.setProperty(varName, value)
  })
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [palette, setPaletteState] = useState<ThemePalette>(DEFAULT_PALETTE)
  const [businessName, setBusinessNameState] = useState('Pepinillo')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [customHeroBg, setCustomHeroBgState] = useState<string | null>(null)

  // Restore from localStorage on mount
  useEffect(() => {
    const savedId      = localStorage.getItem(LS_PALETTE)
    const savedName    = localStorage.getItem(LS_NAME)
    const savedCustomBg = localStorage.getItem(LS_CUSTOM_BG)

    const initial = savedId
      ? (PALETTES.find(p => p.id === savedId) ?? DEFAULT_PALETTE)
      : DEFAULT_PALETTE

    setPaletteState(initial)
    applyPalette(initial)

    if (savedName)    setBusinessNameState(savedName)
    if (savedCustomBg) setCustomHeroBgState(savedCustomBg)
  }, [])

  const setPalette = useCallback((newPalette: ThemePalette) => {
    setPaletteState(newPalette)
    applyPalette(newPalette)
    localStorage.setItem(LS_PALETTE, newPalette.id)
    // Al cambiar paleta, si no hay bg custom, el hero ya usará el defaultBg de la paleta
  }, [])

  const setBusinessName = useCallback((name: string) => {
    setBusinessNameState(name)
    localStorage.setItem(LS_NAME, name)
  }, [])

  const setCustomHeroBg = useCallback((url: string | null) => {
    setCustomHeroBgState(url)
    if (url) {
      localStorage.setItem(LS_CUSTOM_BG, url)
    } else {
      localStorage.removeItem(LS_CUSTOM_BG)
    }
  }, [])

  // El fondo efectivo del hero: custom si lo subieron, sino el de la paleta activa
  const heroBg = customHeroBg ?? palette.defaultBg

  return (
    <ThemeContext.Provider
      value={{
        palette,
        setPalette,
        businessName,
        setBusinessName,
        logoUrl,
        setLogoUrl,
        palettes: PALETTES,
        heroBg,
        isCustomHeroBg: !!customHeroBg,
        setCustomHeroBg,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
