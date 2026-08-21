'use client'
import { useState, useRef } from 'react'
import { KPICard } from '@/components/owner/KPICard'
import { SalesChart } from '@/components/owner/SalesChart'
import { CategoryPieChart } from '@/components/owner/CategoryPieChart'
import { HorarioPicoChart } from '@/components/owner/HorarioPicoChart'
import { MOCK_STAFF } from '@/data/mock/staff'
import { StaffMember } from '@/types/staff'
import {
  exportFinancialReport,
  exportStaffReport,
  parseStaffFromExcel,
} from '@/lib/excel'
import { Download, Upload } from 'lucide-react'

type Period = 'dia' | 'semana' | 'mes'
type Tab = 'resumen' | 'rentabilidad' | 'gastos' | 'nomina' | 'reportes'

const TABS: { id: Tab; label: string }[] = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'rentabilidad', label: 'Rentabilidad' },
  { id: 'gastos', label: 'Gastos' },
  { id: 'nomina', label: 'Nómina' },
  { id: 'reportes', label: 'Reportes' },
]

const KPI_DATA: Record<Period, { ventas: number; pedidos: number; ticket: number; margen: number }> =
  {
    dia: { ventas: 48000, pedidos: 14, ticket: 3428, margen: 38 },
    semana: { ventas: 320000, pedidos: 93, ticket: 3440, margen: 40 },
    mes: { ventas: 1280000, pedidos: 371, ticket: 3450, margen: 41 },
  }

const TOP_PRODUCTO: Record<Period, { nombre: string; sizeLabel: string; unidades: number; emoji: string }> =
  {
    dia: { nombre: 'Cheeseburger', sizeLabel: 'Doble', unidades: 6, emoji: '🍔' },
    semana: { nombre: 'Cheeseburger', sizeLabel: 'Doble', unidades: 34, emoji: '🍔' },
    mes: { nombre: 'Megapepinillo', sizeLabel: 'Doble', unidades: 142, emoji: '🥒' },
  }

const RENTABILIDAD = [
  { name: 'Milanesa napolitana', precio: 3200, costo: 1100, margen: 66, unidades: 85, ganancia: 178500 },
  { name: 'Pollo al limón', precio: 3000, costo: 1050, margen: 65, unidades: 72, ganancia: 140400 },
  { name: 'Pasta al pomodoro', precio: 2400, costo: 700, margen: 71, unidades: 68, ganancia: 115600 },
  { name: 'Plato del día', precio: 2800, costo: 950, margen: 66, unidades: 61, ganancia: 112700 },
  { name: 'Empanadas x6', precio: 1800, costo: 600, margen: 67, unidades: 120, ganancia: 144000 },
  { name: 'Tabla de fiambres', precio: 2200, costo: 900, margen: 59, unidades: 45, ganancia: 58500 },
  { name: 'Cerveza artesanal', precio: 1400, costo: 500, margen: 64, unidades: 95, ganancia: 85500 },
  { name: 'Vino de la casa', precio: 1200, costo: 420, margen: 65, unidades: 78, ganancia: 60840 },
]

const GASTOS_INICIALES = [
  { id: 'g1', categoria: 'Sueldos', monto: 935000 },
  { id: 'g2', categoria: 'Alquiler', monto: 150000 },
  { id: 'g3', categoria: 'Servicios', monto: 35000 },
  { id: 'g4', categoria: 'Delivery', monto: 28000 },
  { id: 'g5', categoria: 'Insumos', monto: 380000 },
  { id: 'g6', categoria: 'Marketing', monto: 15000 },
  { id: 'g7', categoria: 'Otros', monto: 18000 },
]

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('resumen')
  const [period, setPeriod] = useState<Period>('mes')
  const [gastos, setGastos] = useState(GASTOS_INICIALES)
  const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF)
  const [staffPreview, setStaffPreview] = useState<Partial<StaffMember>[] | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const kpi = KPI_DATA[period]
  const topProducto = TOP_PRODUCTO[period]
  const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0)
  const gananciaNeta = kpi.ventas - totalGastos
  const top5 = [...RENTABILIDAD].sort((a, b) => b.ganancia - a.ganancia).slice(0, 5)

  function updateGasto(id: string, monto: number) {
    setGastos(prev => prev.map(g => (g.id === id ? { ...g, monto } : g)))
  }

  function updateGastoName(id: string, categoria: string) {
    setGastos(prev => prev.map(g => (g.id === id ? { ...g, categoria } : g)))
  }

  function addGasto() {
    setGastos(prev => [
      ...prev,
      { id: `g-${Date.now()}`, categoria: 'Nueva categoría', monto: 0 },
    ])
  }

  async function handleStaffImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const parsed = await parseStaffFromExcel(file)
      setStaffPreview(parsed)
    } catch {
      alert('Error al leer el archivo. Verificá columnas: Nombre, Rol, Fecha de Ingreso, Sueldo.')
    }
    e.target.value = ''
  }

  function confirmStaffImport() {
    if (!staffPreview) return
    setStaff(
      staffPreview
        .filter(s => s.name)
        .map((s, i) => ({
          id: `st-imp-${i}`,
          name: s.name!,
          role: s.role ?? '',
          startDate: s.startDate ?? '',
          grossSalary: s.grossSalary ?? 0,
        }))
    )
    setStaffPreview(null)
  }

  const periodLabel =
    period === 'dia' ? 'Hoy' : period === 'semana' ? 'Esta semana' : 'Este mes'

  return (
    <div>
      {/* Tab bar */}
      <div className="overflow-x-auto scrollbar-hide mb-6">
        <div className="flex gap-1 min-w-max">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
              style={{
                background:
                  activeTab === tab.id ? 'var(--dr-primary)' : 'var(--dr-surface)',
                color: activeTab === tab.id ? 'white' : 'var(--dr-muted)',
                boxShadow:
                  activeTab === tab.id
                    ? '0 2px 8px rgba(0,0,0,0.2)'
                    : '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── RESUMEN ── */}
      {activeTab === 'resumen' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium" style={{ color: 'var(--dr-muted)' }}>
              Período:
            </span>
            <div
              className="flex rounded-xl overflow-hidden border"
              style={{ borderColor: 'var(--dr-border)' }}
            >
              {(['dia', 'semana', 'mes'] as Period[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className="px-4 py-1.5 text-sm font-medium transition-colors"
                  style={{
                    background: period === p ? 'var(--dr-primary)' : 'white',
                    color: period === p ? 'white' : 'var(--dr-text)',
                  }}
                >
                  {p === 'dia' ? 'Hoy' : p === 'semana' ? 'Semana' : 'Mes'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <KPICard
              label="Ventas"
              value={`$${kpi.ventas.toLocaleString('es-AR')}`}
              icon="💰"
            />
            <KPICard
              label="Pedidos"
              value={String(kpi.pedidos)}
              icon="📦"
              color="var(--dr-success)"
            />
            <KPICard
              label="Ticket promedio"
              value={`$${kpi.ticket.toLocaleString('es-AR')}`}
              icon="🎫"
              color="#1565C0"
            />
            <KPICard label="Margen bruto" value={`${kpi.margen}%`} icon="📈" color="#6A1B9A" />
            <KPICard
              label="Más pedido 🔥"
              value={`${topProducto.emoji} ${topProducto.nombre}`}
              sub={`${topProducto.sizeLabel} — ${topProducto.unidades} unidades`}
              color="#C44D00"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <SalesChart />
            </div>
            <CategoryPieChart />
          </div>
          <HorarioPicoChart />
        </div>
      )}

      {/* ── RENTABILIDAD ── */}
      {activeTab === 'rentabilidad' && (
        <div className="space-y-6">
          <h2
            className="font-display text-xl font-bold"
            style={{ color: 'var(--dr-primary)' }}
          >
            Rentabilidad por producto
          </h2>

          <div
            className="rounded-xl shadow-sm overflow-x-auto"
            style={{ background: 'var(--dr-surface)' }}
          >
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--dr-border)' }}>
                  {['Producto', 'Precio', 'Costo est.', 'Margen', 'Unidades', 'Ganancia'].map(
                    h => (
                      <th
                        key={h}
                        className="p-3 text-left font-semibold"
                        style={{ color: 'var(--dr-muted)' }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {RENTABILIDAD.map((r, i) => (
                  <tr
                    key={i}
                    className="border-b last:border-0"
                    style={{ borderColor: 'var(--dr-border)' }}
                  >
                    <td className="p-3 font-medium" style={{ color: 'var(--dr-text)' }}>
                      {r.name}
                    </td>
                    <td className="p-3">${r.precio.toLocaleString('es-AR')}</td>
                    <td className="p-3">${r.costo.toLocaleString('es-AR')}</td>
                    <td className="p-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ background: 'var(--dr-success)' }}
                      >
                        {r.margen}%
                      </span>
                    </td>
                    <td className="p-3">{r.unidades}</td>
                    <td
                      className="p-3 font-semibold"
                      style={{ color: 'var(--dr-success)' }}
                    >
                      ${r.ganancia.toLocaleString('es-AR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3
              className="font-semibold text-sm mb-3"
              style={{ color: 'var(--dr-muted)' }}
            >
              Top 5 más rentables
            </h3>
            <div className="space-y-2">
              {top5.map((r, i) => (
                <div
                  key={i}
                  className="rounded-lg p-3 flex items-center gap-3 shadow-sm"
                  style={{ background: 'var(--dr-surface)' }}
                >
                  <span
                    className="font-display text-xl font-bold w-6 text-center"
                    style={{ color: 'var(--dr-primary)' }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-sm" style={{ color: 'var(--dr-text)' }}>
                      {r.name}
                    </p>
                    <div
                      className="mt-1 h-2 rounded-full overflow-hidden"
                      style={{ background: 'var(--dr-border)' }}
                    >
                      <div
                        className="h-2 rounded-full"
                        style={{
                          background: 'var(--dr-success)',
                          width: `${(r.ganancia / top5[0].ganancia) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span
                    className="font-bold text-sm whitespace-nowrap"
                    style={{ color: 'var(--dr-success)' }}
                  >
                    ${r.ganancia.toLocaleString('es-AR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── GASTOS ── */}
      {activeTab === 'gastos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2
              className="font-display text-xl font-bold"
              style={{ color: 'var(--dr-primary)' }}
            >
              Gastos del mes
            </h2>
            <button
              onClick={addGasto}
              className="text-sm px-3 py-1.5 rounded-lg border font-medium"
              style={{ borderColor: 'var(--dr-border)', color: 'var(--dr-muted)' }}
            >
              + Agregar categoría
            </button>
          </div>

          <div
            className="rounded-xl shadow-sm overflow-hidden"
            style={{ background: 'var(--dr-surface)' }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--dr-border)' }}>
                  <th
                    className="p-3 text-left font-semibold"
                    style={{ color: 'var(--dr-muted)' }}
                  >
                    Categoría
                  </th>
                  <th
                    className="p-3 text-right font-semibold"
                    style={{ color: 'var(--dr-muted)' }}
                  >
                    Monto ($)
                  </th>
                </tr>
              </thead>
              <tbody>
                {gastos.map(g => (
                  <tr
                    key={g.id}
                    className="border-b last:border-0"
                    style={{ borderColor: 'var(--dr-border)' }}
                  >
                    <td className="p-3">
                      <input
                        value={g.categoria}
                        onChange={e => updateGastoName(g.id, e.target.value)}
                        className="border-0 bg-transparent w-full font-medium focus:outline-none"
                        style={{ color: 'var(--dr-text)' }}
                      />
                    </td>
                    <td className="p-3 text-right">
                      <input
                        type="number"
                        value={g.monto}
                        min={0}
                        onChange={e => updateGasto(g.id, Number(e.target.value))}
                        className="w-36 text-right border rounded px-2 py-1 text-sm"
                        style={{ borderColor: 'var(--dr-border)' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <KPICard
              label="Ingresos (mes)"
              value={`$${KPI_DATA.mes.ventas.toLocaleString('es-AR')}`}
              color="var(--dr-success)"
            />
            <KPICard
              label="Egresos"
              value={`$${totalGastos.toLocaleString('es-AR')}`}
              color="var(--dr-accent)"
            />
            <KPICard
              label="Ganancia neta"
              value={`$${Math.abs(gananciaNeta).toLocaleString('es-AR')}`}
              color={gananciaNeta >= 0 ? 'var(--dr-success)' : '#C62828'}
              sub={gananciaNeta < 0 ? '⚠️ Pérdida' : undefined}
            />
          </div>
        </div>
      )}

      {/* ── NÓMINA ── */}
      {activeTab === 'nomina' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2
              className="font-display text-xl font-bold"
              style={{ color: 'var(--dr-primary)' }}
            >
              Nómina de colaboradores
            </h2>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleStaffImport}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border font-medium"
                style={{ borderColor: 'var(--dr-border)', color: 'var(--dr-muted)' }}
              >
                <Upload size={14} /> Importar Excel
              </button>
              <button
                onClick={() => exportStaffReport(staff)}
                className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg font-medium text-white"
                style={{ background: 'var(--dr-success)' }}
              >
                <Download size={14} /> Exportar
              </button>
            </div>
          </div>

          {staffPreview && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="font-semibold text-sm mb-2">
                Vista previa — {staffPreview.length} registros:
              </p>
              <ul className="text-sm space-y-1 mb-3">
                {staffPreview.slice(0, 5).map((s, i) => (
                  <li key={i}>
                    {s.name} — {s.role} — ${s.grossSalary?.toLocaleString('es-AR')}
                  </li>
                ))}
                {staffPreview.length > 5 && (
                  <li className="text-gray-500">...y {staffPreview.length - 5} más</li>
                )}
              </ul>
              <div className="flex gap-2">
                <button
                  onClick={confirmStaffImport}
                  className="text-sm px-4 py-1.5 rounded-lg text-white font-medium"
                  style={{ background: 'var(--dr-success)' }}
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setStaffPreview(null)}
                  className="text-sm px-4 py-1.5 rounded-lg border font-medium"
                  style={{ borderColor: 'var(--dr-border)' }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div
            className="rounded-xl shadow-sm overflow-hidden"
            style={{ background: 'var(--dr-surface)' }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--dr-border)' }}>
                  {['Nombre', 'Rol', 'Fecha ingreso', 'Sueldo bruto'].map(h => (
                    <th
                      key={h}
                      className="p-3 text-left font-semibold"
                      style={{ color: 'var(--dr-muted)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staff.map(s => (
                  <tr
                    key={s.id}
                    className="border-b last:border-0"
                    style={{ borderColor: 'var(--dr-border)' }}
                  >
                    <td className="p-3 font-medium" style={{ color: 'var(--dr-text)' }}>
                      {s.name}
                    </td>
                    <td className="p-3" style={{ color: 'var(--dr-muted)' }}>
                      {s.role}
                    </td>
                    <td className="p-3" style={{ color: 'var(--dr-muted)' }}>
                      {s.startDate}
                    </td>
                    <td className="p-3 font-medium" style={{ color: 'var(--dr-text)' }}>
                      ${s.grossSalary.toLocaleString('es-AR')}
                    </td>
                  </tr>
                ))}
                <tr style={{ background: 'var(--dr-bg)' }}>
                  <td
                    colSpan={3}
                    className="p-3 font-bold text-right"
                    style={{ color: 'var(--dr-text)' }}
                  >
                    Total nómina
                  </td>
                  <td className="p-3 font-bold" style={{ color: 'var(--dr-primary)' }}>
                    ${staff.reduce((sum, s) => sum + s.grossSalary, 0).toLocaleString('es-AR')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── REPORTES ── */}
      {activeTab === 'reportes' && (
        <div className="space-y-6">
          <h2
            className="font-display text-xl font-bold"
            style={{ color: 'var(--dr-primary)' }}
          >
            Exportar reportes
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div
              className="rounded-xl shadow-sm p-5"
              style={{ background: 'var(--dr-surface)' }}
            >
              <h3 className="font-semibold mb-1" style={{ color: 'var(--dr-text)' }}>
                Reporte financiero
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--dr-muted)' }}>
                Ventas, gastos y ganancia neta del período seleccionado en Resumen (
                {periodLabel}).
              </p>
              <button
                onClick={() =>
                  exportFinancialReport(periodLabel, kpi.ventas, totalGastos, kpi.pedidos)
                }
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white text-sm"
                style={{ background: 'var(--dr-primary)' }}
              >
                <Download size={15} /> Descargar Excel
              </button>
            </div>

            <div
              className="rounded-xl shadow-sm p-5"
              style={{ background: 'var(--dr-surface)' }}
            >
              <h3 className="font-semibold mb-1" style={{ color: 'var(--dr-text)' }}>
                Nómina completa
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--dr-muted)' }}>
                Lista de colaboradores con roles y sueldos brutos.
              </p>
              <button
                onClick={() => exportStaffReport(staff)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white text-sm"
                style={{ background: 'var(--dr-success)' }}
              >
                <Download size={15} /> Descargar Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
