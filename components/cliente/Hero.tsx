'use client'
import Link from 'next/link'
import { MapPin, Clock } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { DevFooter } from '@/components/landing/DevFooter'

export function Hero() {
  const { businessName, logoUrl, heroBg } = useTheme()

  const initials = businessName.trim()
    ? businessName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'PP'

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 pb-24 overflow-hidden">

      {/* Fondo de imagen — se carga si existe, sino cae al gradiente CSS */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          backgroundImage: `url('${heroBg}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        aria-hidden="true"
      />

      {/* Overlay oscuro para legibilidad del texto */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.38) 100%)' }}
        aria-hidden="true"
      />

      {/* Fallback gradiente de color (visible si la imagen no carga) */}
      <div
        className="absolute inset-0 -z-10"
        style={{ background: `linear-gradient(160deg, var(--dr-primary) 0%, var(--dr-primary-dark) 100%)` }}
        aria-hidden="true"
      />

      {/* Contenido — encima de los overlays */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Logo */}
        <div className="mb-6 drop-shadow-xl">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={businessName}
              className="w-28 h-28 rounded-full object-cover shadow-2xl ring-4 ring-white/30"
            />
          ) : (
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl font-bold font-display shadow-2xl ring-4 ring-white/30"
              style={{ background: 'var(--dr-primary)' }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Nombre */}
        <h1 className="font-display text-4xl md:text-5xl font-bold text-center mb-3 text-white drop-shadow-lg">
          {businessName || 'Mi Restaurante'}
        </h1>

        {/* Tagline */}
        <p className="text-lg text-center mb-8 max-w-xs text-white/80 drop-shadow">
          Salí del frasco, pedite una Pepi 🥒
        </p>

        {/* CTA */}
        <Link
          href="/menu"
          className="px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-transform hover:scale-105 active:scale-95 backdrop-blur-sm"
          style={{ background: 'var(--dr-primary)' }}
        >
          Ver menú
        </Link>

        {/* Info */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 text-sm text-white/75">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-white/90" />
            <span>Lamadrid 731, Barrio Sur</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-white/90" />
            <span>Mar–Dom: 20:30 – 00:30</span>
          </div>
        </div>

        {/* Dev credit */}
        <div className="mt-8">
          <DevFooter light />
        </div>
      </div>
    </main>
  )
}
