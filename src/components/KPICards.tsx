import { formatMinutesAsHMRounded, minutesToTimeRounded } from '../utils/date'
import type { KPI } from '../types'

interface KPICardsProps {
  kpi: KPI | undefined
  days: 7 | 14 | 30
  setDays: (d: 7 | 14 | 30) => void
}

interface Card {
  label: string
  badge: string
  value: string
  unit: string
}

export function KPICards({ kpi, days, setDays }: KPICardsProps) {
  const cards: Card[] | null = kpi && kpi.avgTst !== null ? [
    {
      label: 'Sleep time',
      badge: 'AVG',
      value: formatMinutesAsHMRounded(kpi.avgTst!).replace('h ', 'h\u00A0'),
      unit: '',
    },
    {
      label: 'Wake time',
      badge: 'AVG',
      value: minutesToTimeRounded(kpi.avgWakeTime!),
      unit: '',
    },
    {
      label: 'Wake spread',
      badge: '±AVG',
      value: kpi.wakeConsistency !== null ? `${kpi.wakeConsistency}` : '—',
      unit: kpi.wakeConsistency !== null ? 'M' : '',
    },
    {
      label: 'Sleep gap',
      badge: 'VS TARGET',
      value: kpi.sleepGap !== null
        ? kpi.sleepGap >= -10 && kpi.sleepGap <= 10
          ? '✓'
          : `${kpi.sleepGap > 0 ? '+' : ''}${Math.abs(kpi.sleepGap)}`
        : '—',
      unit: kpi.sleepGap !== null
        ? kpi.sleepGap >= -10 && kpi.sleepGap <= 10
          ? 'On target'
          : kpi.sleepGap > 10 ? 'M over' : 'M deficit'
        : '',
    },
  ] : null

  return (
    <section>
      {/* Header with period toggle */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Overview</span>
          <h2 className="font-headline text-xl font-light tracking-tight text-tertiary">Trends</h2>
        </div>
        <div className="flex gap-1 bg-surface-container-low p-1 rounded-lg">
          {([7, 14, 30] as const).map((d) => (
            <button key={d} onClick={() => setDays(d)}
              className={`px-3 py-1 rounded-md font-label text-[10px] uppercase tracking-[0.1em] transition-all ${
                d === days ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >{d}d</button>
          ))}
        </div>
      </div>
      {/* Cards grid */}
      {cards ? (
        <div className="grid grid-cols-2 gap-3">
          {cards.map((card) => (
            <div key={card.label} className="p-5 bg-surface-container rounded-xl flex flex-col justify-between h-28">
              <div className="flex items-center justify-between">
                <span className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">{card.label}</span>
                <span className="font-label text-[8px] uppercase tracking-[0.1em] text-primary">{card.badge}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-headline text-3xl font-extralight text-tertiary">{card.value}</span>
                {card.unit && <span className="font-label text-xs text-primary">{card.unit}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 bg-surface-container rounded-xl text-center">
          <span className="font-body text-sm text-on-surface-variant">Log your first night to see trends</span>
        </div>
      )}
    </section>
  )
}
