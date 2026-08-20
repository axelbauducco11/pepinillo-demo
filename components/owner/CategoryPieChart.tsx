'use client'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const DATA = [
  { name: 'Principales', value: 48 },
  { name: 'Entradas', value: 22 },
  { name: 'Bebidas', value: 18 },
  { name: 'Postres', value: 12 },
]

const COLORS = [
  'var(--dr-primary)',
  'var(--dr-accent)',
  'var(--dr-success)',
  'var(--dr-muted)',
]

export function CategoryPieChart() {
  return (
    <div className="rounded-2xl p-4 shadow-sm" style={{ background: 'var(--dr-surface)' }}>
      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--dr-muted)' }}>
        Ventas por categoría
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={DATA}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            dataKey="value"
            label={({ value }) => `${value}%`}
            labelLine={false}
          >
            {DATA.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          <Tooltip formatter={(v: unknown) => [`${v}%`, '']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
