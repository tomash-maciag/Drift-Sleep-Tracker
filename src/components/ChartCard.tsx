interface ChartCardProps {
  title: string
  subLabel: string
  legendDash?: boolean
  value: string
  valueLabel: string
  children: React.ReactNode
  variant?: 'default' | 'high'
}

export function ChartCard({ title, subLabel, legendDash, value, valueLabel, children, variant = 'default' }: ChartCardProps) {
  const bg = variant === 'high' ? 'bg-surface-container-high' : 'bg-surface-container'
  return (
    <section className={`${bg} rounded-xl p-6`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="font-headline text-xl font-light tracking-tight text-tertiary">{title}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-label text-[10px] uppercase tracking-widest text-secondary">{subLabel}</span>
            {legendDash && <div className="w-4 h-0 border-t border-dashed border-primary opacity-80" />}
          </div>
        </div>
        <div className="text-right">
          <span className="font-headline text-2xl font-extralight text-tertiary">{value}</span>
          <span className="font-label text-[10px] text-on-surface-variant block uppercase tracking-widest">{valueLabel}</span>
        </div>
      </div>
      {children}
    </section>
  )
}
