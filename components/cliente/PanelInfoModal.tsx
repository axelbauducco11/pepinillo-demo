'use client'
import { useRouter } from 'next/navigation'
import { X, ArrowRight } from 'lucide-react'

type PanelType = 'admin' | 'owner'

const PANEL_INFO = {
  admin: {
    emoji: '👨‍🍳',
    title: 'Panel de Administración',
    subtitle: 'La pantalla del encargado del local',
    color: 'var(--dr-primary)',
    description: 'Todo lo que necesita el equipo de trabajo para gestionar el día a día del restaurante en tiempo real.',
    features: [
      { icon: '📋', text: 'Comandas en tiempo real — vista kanban con estados (Pendiente → Listo)' },
      { icon: '🔔', text: 'Nuevo pedido cada 45 segundos simulado automáticamente' },
      { icon: '🍽️', text: 'Gestión de productos — agregar, editar, cargar foto, eliminar' },
      { icon: '📦', text: 'Control de stock con alertas de stock bajo' },
      { icon: '🛒', text: 'Órdenes de compra con exportación a Excel' },
    ],
    credential: 'admin@demo.com / admin123',
    cta: 'Ver panel de admin',
  },
  owner: {
    emoji: '📊',
    title: 'Dashboard del Dueño',
    subtitle: 'La pantalla del propietario del negocio',
    color: '#6A1B9A',
    description: 'Una visión completa del negocio con métricas, gráficos y herramientas financieras para tomar decisiones.',
    features: [
      { icon: '💰', text: 'KPIs en tiempo real — ventas, pedidos, ticket promedio y margen bruto' },
      { icon: '📈', text: 'Gráficos de ventas por día y pedidos por horario pico' },
      { icon: '🏆', text: 'Rentabilidad por producto — margen, unidades vendidas, ganancia' },
      { icon: '💸', text: 'Control de gastos editable con cálculo de ganancia neta' },
      { icon: '👥', text: 'Nómina del equipo con importación/exportación desde Excel' },
    ],
    credential: 'dueno@demo.com / dueno123',
    cta: 'Ver dashboard del dueño',
  },
}

interface Props {
  panel: PanelType
  onClose: () => void
}

export function PanelInfoModal({ panel, onClose }: Props) {
  const router = useRouter()
  const info = PANEL_INFO[panel]

  function handleEnter() {
    onClose()
    router.push('/login')
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
        style={{ background: 'var(--dr-surface)' }}
      >
        {/* Header con color del panel */}
        <div
          className="px-6 pt-6 pb-5 relative"
          style={{ background: info.color }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label="Cerrar"
          >
            <X size={16} color="white" />
          </button>

          <div className="text-4xl mb-3">{info.emoji}</div>
          <h2 className="font-display text-xl font-bold text-white mb-1">{info.title}</h2>
          <p className="text-sm text-white/80">{info.subtitle}</p>
        </div>

        {/* Contenido */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--dr-muted)' }}>
            {info.description}
          </p>

          {/* Features */}
          <ul className="space-y-2.5">
            {info.features.map((f, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="text-base flex-shrink-0 mt-0.5">{f.icon}</span>
                <span style={{ color: 'var(--dr-text)' }}>{f.text}</span>
              </li>
            ))}
          </ul>

          {/* Credenciales */}
          <div
            className="rounded-xl px-4 py-3 text-xs"
            style={{ background: 'var(--dr-bg)', color: 'var(--dr-muted)' }}
          >
            <span className="font-semibold">Credencial de acceso: </span>
            <span className="font-mono">{info.credential}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border text-sm font-medium"
            style={{ borderColor: 'var(--dr-border)', color: 'var(--dr-muted)' }}
          >
            Volver al menú
          </button>
          <button
            onClick={handleEnter}
            className="flex-1 py-3 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
            style={{ background: info.color }}
          >
            {info.cta} <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
