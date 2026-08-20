import * as XLSX from 'xlsx'
import { PurchaseItem } from '@/types/stock'
import { StaffMember } from '@/types/staff'

// TODO: Replace BIZ_NAME with dynamic value from business settings
const BIZ_NAME = 'Demo Restaurante'

export function exportPurchaseOrder(items: PurchaseItem[], date: string): void {
  const rows: (string | number)[][] = [
    [`Orden de Compra — ${BIZ_NAME}`],
    [`Fecha: ${date}`],
    [],
    ['Insumo', 'Cantidad', 'Unidad', 'Precio Est. ($)', 'Subtotal ($)'],
    ...items.map(i => [
      i.name,
      i.quantity,
      i.unit,
      i.estimatedPrice,
      i.quantity * i.estimatedPrice,
    ]),
    [],
    ['', '', '', 'TOTAL', items.reduce((sum, i) => sum + i.quantity * i.estimatedPrice, 0)],
  ]

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(rows)
  ws['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 16 }, { wch: 16 }]
  XLSX.utils.book_append_sheet(wb, ws, 'Orden de Compra')
  XLSX.writeFile(wb, `OC-${date}.xlsx`)
}

export function exportFinancialReport(
  period: string,
  sales: number,
  expenses: number,
  orderCount: number
): void {
  const profit = sales - expenses
  const rows: (string | number)[][] = [
    [`Reporte Financiero — ${BIZ_NAME}`],
    [`Período: ${period}`],
    [],
    ['Métrica', 'Valor'],
    ['Ventas totales', sales],
    ['Gastos totales', expenses],
    ['Ganancia neta', profit],
    ['Cantidad de pedidos', orderCount],
    ['Ticket promedio', orderCount > 0 ? Math.round(sales / orderCount) : 0],
  ]

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(rows)
  ws['!cols'] = [{ wch: 22 }, { wch: 16 }]
  XLSX.utils.book_append_sheet(wb, ws, 'Reporte')
  XLSX.writeFile(wb, `Reporte-${period}.xlsx`)
}

export function exportStaffReport(staff: StaffMember[]): void {
  const rows: (string | number)[][] = [
    [`Nómina — ${BIZ_NAME}`],
    [],
    ['Nombre', 'Rol', 'Fecha de ingreso', 'Sueldo bruto ($)'],
    ...staff.map(s => [s.name, s.role, s.startDate, s.grossSalary]),
    [],
    ['', '', 'Total nómina', staff.reduce((sum, s) => sum + s.grossSalary, 0)],
  ]
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(rows)
  ws['!cols'] = [{ wch: 22 }, { wch: 22 }, { wch: 16 }, { wch: 16 }]
  XLSX.utils.book_append_sheet(wb, ws, 'Nómina')
  XLSX.writeFile(wb, `Nomina-${new Date().toISOString().slice(0, 10)}.xlsx`)
}

export function parseStaffFromExcel(file: File): Promise<Partial<StaffMember>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws)
        resolve(
          rows.map(row => ({
            name: String(row['Nombre'] ?? ''),
            role: String(row['Rol'] ?? ''),
            startDate: String(row['Fecha de Ingreso'] ?? ''),
            grossSalary: Number(row['Sueldo'] ?? 0),
          }))
        )
      } catch (err) {
        reject(err)
      }
    }
    reader.readAsArrayBuffer(file)
  })
}
