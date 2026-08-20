import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ThemePanel } from '@/components/theme/ThemePanel'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Demo Restaurante',
  description: 'Demo de app de pedidos para restaurantes — herramienta de ventas',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        <ThemeProvider>
          <CartProvider>
            {children}
            <ThemePanel />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
