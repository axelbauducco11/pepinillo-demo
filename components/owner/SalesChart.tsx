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
  { dia: 'Lun', ventas: 182000 },
  { dia: 'Mar', ventas: 210000 },
  { dia: 'Mié', ventas: 195000 },
  { dia: 'Jue', ventas: 230000 },
  { dia: 'Vie', ventas: 275000 },
  { dia: 'Sáb', ventas: 312000 },
  { dia: 'Dom', ventas: 198000 },
]

export function SalesChart() {
  return (
    <div className="rounded-2xl p-4 shadow-sm" style={{ background: 'var(--dr-surface)' }}>
      <p className="text-sm font-semibold mb-3" style={{ color: 'var(--dr-muted)' }}>
        Ventas por día (semana actual)
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--dr-border)" />
          <XAxis dataKey="dia" tick={{ fontSize: 11, fill: 'var(--dr-muted)' }} />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--dr-muted)' }}
            tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(v: unknown) => [`$${Number(v).toLocaleString('es-AR')}`, 'Ventas']}
          />
          <Bar dataKey="ventas" fill="var(--dr-primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
