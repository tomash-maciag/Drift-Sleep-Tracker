import { useSleepLogsLive, useSettingLive } from '../../hooks/reactive'
import { computeSleepMetrics } from '../../utils/sleep-math'
import { formatMinutesAsHMRounded, timeToMinutes, todayDate } from '../../utils/date'

function offsetDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function SleepPattern() {
  const today = todayDate()
  const sevenDaysAgo = offsetDate(today, -6)
  const logs = useSleepLogsLive(sevenDaysAgo, today)

  // Sleep window from settings (defaults)
  const sleepWindowStart = useSettingLive<string>('sleepWindowStart', '00:00')
  const sleepWindowEnd = useSettingLive<string>('sleepWindowEnd', '06:00')

  // Bar range from settings
  const barRangeStart = useSettingLive<string>('sleepBarRangeStart', '00:00')
  const barRangeEnd = useSettingLive<string>('sleepBarRangeEnd', '08:00')

  // Compute range in minutes
  const rangeStartMin = timeToMinutes(barRangeStart ?? '22:00')
  const rangeEndMin = timeToMinutes(barRangeEnd ?? '10:00')
  const rangeTotal = rangeEndMin >= rangeStartMin
    ? rangeEndMin - rangeStartMin
    : 1440 - rangeStartMin + rangeEndMin

  // Normalize a time to a position within the range (0..rangeTotal)
  const normalize = (minutes: number) => {
    return minutes >= rangeStartMin ? minutes - rangeStartMin : minutes + 1440 - rangeStartMin
  }

  // Sleep window positions as percentages
  const windowStartMin = timeToMinutes(sleepWindowStart ?? '00:00')
  const windowEndMin = timeToMinutes(sleepWindowEnd ?? '06:00')
  const windowStartPct = (normalize(windowStartMin) / rangeTotal) * 100
  const windowEndPct = (normalize(windowEndMin) / rangeTotal) * 100

  // Time axis ticks
  const axisTicks = generateAxisTicks(rangeStartMin, rangeTotal)

  // Empty state
  if (logs.length === 0) {
    return (
      <section className="bg-surface-container rounded-xl p-6">
        <div className="mb-6">
          <h2 className="font-headline text-xl font-light tracking-tight text-tertiary">Sleep Pattern</h2>
        </div>
        <div className="py-8 text-center">
          <span className="font-body text-sm text-on-surface-variant">Log your first night to see your sleep pattern</span>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-surface-container rounded-xl p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-headline text-xl font-light tracking-tight text-tertiary">Sleep Pattern</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-label text-[10px] uppercase tracking-widest text-secondary">Sleep window</span>
              <div className="w-4 h-0 border-t border-dashed border-primary opacity-80" />
            </div>
          </div>
          <div className="text-right">
            <span className="font-headline text-xl font-extralight text-tertiary block">7 Days</span>
            <div className="flex gap-4 mt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
                <span className="font-label text-[9px] uppercase tracking-wider text-on-surface-variant">In bed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="font-label text-[9px] uppercase tracking-wider text-on-surface-variant">Sleep</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline bars */}
      <div className="space-y-3 relative">
        {/* Sleep window target lines */}
        <div className="absolute pointer-events-none z-10" style={{ top: '12px', left: 0, right: 0, bottom: '4px' }}>
          <div
            className="absolute top-0 bottom-0 border-l border-dashed border-primary/80"
            style={{ left: `${windowStartPct}%` }}
          />
          <div
            className="absolute top-0 bottom-0 border-l border-dashed border-primary/80"
            style={{ left: `${windowEndPct}%` }}
          />
        </div>

        {logs.map((log) => {
          const bedMin = timeToMinutes(log.bedtime)
          const onsetMin = timeToMinutes(log.sleepOnset)
          const wakeMin = timeToMinutes(log.wakeTime)
          const outMin = timeToMinutes(log.outOfBedTime)

          const bedPct = (normalize(bedMin) / rangeTotal) * 100
          const outPct = (normalize(outMin) / rangeTotal) * 100
          const onsetPct = (normalize(onsetMin) / rangeTotal) * 100
          const wakePct = (normalize(wakeMin) / rangeTotal) * 100

          const metrics = computeSleepMetrics(log)
          const dayLabel = new Date(log.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' })

          return (
            <div key={log.date} className="space-y-1">
              <div className="flex justify-between items-end px-0.5">
                <span className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-widest">{dayLabel}</span>
                <span className="font-label text-xs text-tertiary-dim">{formatMinutesAsHMRounded(metrics.tst)}</span>
              </div>
              <div className="h-3.5 w-full bg-surface-container-low rounded-full overflow-hidden relative"
                   style={{ opacity: log.sleepQuality < 5 ? 0.6 : log.sleepQuality < 7 ? 0.8 : 1 }}>
                <div
                  className="absolute inset-y-0 bg-secondary-container rounded-full"
                  style={{ left: `${bedPct}%`, width: `${outPct - bedPct}%` }}
                />
                <div
                  className="absolute inset-y-0 bg-primary rounded-full"
                  style={{ left: `${onsetPct}%`, width: `${wakePct - onsetPct}%` }}
                />
              </div>
            </div>
          )
        })}

        {/* Time axis */}
        <div className="relative mt-2 h-3">
          {axisTicks.map((t) => (
            <span
              key={t.label}
              className="absolute font-label text-[9px] text-on-surface-variant/30 -translate-x-1/2"
              style={{ left: `${t.pct}%` }}
            >
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function generateAxisTicks(rangeStartMin: number, rangeTotal: number): { label: string; pct: number }[] {
  const ticks: { label: string; pct: number }[] = []
  // Generate ticks every 3 hours, plus start and end
  const startHour = Math.floor(rangeStartMin / 60)
  const hours: number[] = []

  // Start tick
  hours.push(startHour)

  // Every 3 hours within range
  for (let h = Math.ceil(startHour / 3) * 3; h <= startHour + Math.ceil(rangeTotal / 60); h += 3) {
    if (h !== startHour) hours.push(h)
  }

  // End tick
  const endHour = startHour + Math.ceil(rangeTotal / 60)
  if (!hours.includes(endHour)) hours.push(endHour)

  for (const h of hours) {
    const wrapped = ((h % 24) + 24) % 24
    const label = `${String(wrapped).padStart(2, '0')}:00`
    const minutesFromStart = (h - startHour) * 60
    const pct = (minutesFromStart / rangeTotal) * 100
    if (pct >= 0 && pct <= 100) {
      ticks.push({ label, pct })
    }
  }

  return ticks
}
