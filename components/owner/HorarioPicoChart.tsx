'use client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const DATA = [
  { hora: '11h', pedidos: 3 },
  { hora: '12h', pedidos: 12 },
  { hora: '13h', pedidos: 18 },
  { hora: '14h', pedidos: 22 },
  { hora: '15h', pedidos: 10 },
  { hora: '16h', pedidos: 4 },
  { hora: '17h', pedidos: 5 },
  { hora: '18h', pedidos: 11 },
  { hora: '19h', pedidos: 20 },
  { hora: '20h', pedidos: 28 },
  { hora: '21h', pedidos: 24 },
  { hora: '22h', pedidos: 15 },
]

export function HorarioPicoChart() {
  return (
    <div className="rounded-2xl p-4 shadow-sm" style={{ background: 'var(--dr-surface)' }}>
      <p className="text-sm font-semibold mb-3" style={{ color: 'var(--dr-muted)' }}>
        Pedidos por horario (promedio)
      </p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={DATA} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--dr-border)" />
          <XAxis dataKey="hora" tick={{ fontSize: 10, fill: 'var(--dr-muted)' }} />
          <YAxis tick={{ fontSize: 10, fill: 'var(--dr-muted)' }} />
          <Tooltip formatter={(v: unknown) => [String(v), 'Pedidos']} />
          <Bar dataKey="pedidos" fill="var(--dr-accent)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
