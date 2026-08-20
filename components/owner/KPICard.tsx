interface Props {
  label: string
  value: string
  icon?: string
  color?: string
  sub?: string
}

export function KPICard({ label, value, icon, color, sub }: Props) {
  return (
    <div className="rounded-2xl p-4 shadow-sm" style={{ background: 'var(--dr-surface)' }}>
      {icon && <div className="text-2xl mb-1">{icon}</div>}
      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--dr-muted)' }}>
        {label}
      </p>
      <p
        className="text-xl font-bold font-display"
        style={{ color: color ?? 'var(--dr-primary)' }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs mt-0.5" style={{ color: 'var(--dr-muted)' }}>
          {sub}
        </p>
      )}
    </div>
  )
}
