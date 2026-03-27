import { useState, useRef, useCallback } from 'react'
import { useAllSleepLogsLive, useSettingLive } from '../../hooks/reactive'
import { computeSleepMetrics } from '../../utils/sleep-math'
import { formatMinutesAsHMRounded, timeToMinutes, todayDate } from '../../utils/date'

function offsetDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function formatDateRange(endDate: string): string {
  const end = new Date(endDate + 'T12:00:00')
  const start = new Date(endDate + 'T12:00:00')
  start.setDate(start.getDate() - 6)
  const fmt = (d: Date) => `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`
  return `${fmt(start)} – ${fmt(end)}`
}

export function SleepPattern() {
  const today = todayDate()
  const [page, setPage] = useState(0) // 0 = current week, 1 = previous week, etc.
  const allLogs = useAllSleepLogsLive()

  // Sleep window from settings
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

  const normalize = (minutes: number) => {
    return minutes >= rangeStartMin ? minutes - rangeStartMin : minutes + 1440 - rangeStartMin
  }

  // Sleep window positions
  const windowStartMin = timeToMinutes(sleepWindowStart ?? '00:00')
  const windowEndMin = timeToMinutes(sleepWindowEnd ?? '06:00')
  const windowStartPct = (normalize(windowStartMin) / rangeTotal) * 100
  const windowEndPct = (normalize(windowEndMin) / rangeTotal) * 100

  // Axis ticks
  const axisTicks = generateAxisTicks(rangeStartMin, rangeTotal)

  // Current page date range
  const pageEndDate = offsetDate(today, -page * 7)
  const pageStartDate = offsetDate(pageEndDate, -6)

  // Filter logs for current page
  const pageLogs = allLogs.filter(l => l.date >= pageStartDate && l.date <= pageEndDate)

  // Can go further back?
  const oldestLog = allLogs.length > 0 ? allLogs[allLogs.length - 1].date : null
  const canGoBack = oldestLog ? oldestLog < pageStartDate : false

  // Swipe handling
  const touchStartX = useRef(0)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (dx < -50 && canGoBack) setPage(p => p + 1) // swipe left = older
    if (dx > 50 && page > 0) setPage(p => p - 1) // swipe right = newer
  }, [canGoBack, page])

  // Empty state
  if (allLogs.length === 0) {
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
            <span className="font-label text-[10px] text-on-surface-variant/60 block">{formatDateRange(pageEndDate)}</span>
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

      {/* Timeline bars — swipeable */}
      <div
        className="space-y-3 relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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

        {Array.from({ length: 7 }, (_, i) => {
          const date = offsetDate(pageEndDate, -i)
          const log = pageLogs.find(l => l.date === date)
          const dayLabel = new Date(date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' })

          if (!log) {
            return (
              <div key={date} className="space-y-1">
                <div className="flex justify-between items-end px-0.5">
                  <span className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-widest">{dayLabel}</span>
                  <span className="font-label text-xs text-on-surface-variant/20">—</span>
                </div>
                <div className="h-3.5 w-full bg-surface-container-low rounded-sm overflow-hidden relative opacity-30" />
              </div>
            )
          }

          const bedMin = timeToMinutes(log.bedtime)
          const onsetMin = timeToMinutes(log.sleepOnset)
          const wakeMin = timeToMinutes(log.wakeTime)
          const outMin = timeToMinutes(log.outOfBedTime)

          const bedPct = (normalize(bedMin) / rangeTotal) * 100
          const outPct = (normalize(outMin) / rangeTotal) * 100
          const onsetPct = (normalize(onsetMin) / rangeTotal) * 100
          const wakePct = (normalize(wakeMin) / rangeTotal) * 100

          // Awakening gap
          let awakGapStartPct: number | null = null
          let awakGapEndPct: number | null = null
          if (log.awakeningTime && log.awakeningDuration) {
            const awakMin = timeToMinutes(log.awakeningTime)
            const awakEndMin = (awakMin + log.awakeningDuration) % 1440
            awakGapStartPct = (normalize(awakMin) / rangeTotal) * 100
            awakGapEndPct = (normalize(awakEndMin) / rangeTotal) * 100
          }

          const metrics = computeSleepMetrics(log)

          return (
            <div key={date} className="space-y-1">
              <div className="flex justify-between items-end px-0.5">
                <span className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-widest">{dayLabel}</span>
                <span className="font-label text-xs text-tertiary-dim">{formatMinutesAsHMRounded(metrics.tst)}</span>
              </div>
              <div className="h-3.5 w-full bg-surface-container-low rounded-sm overflow-hidden relative"
                   style={{ opacity: log.sleepQuality < 5 ? 0.6 : log.sleepQuality < 7 ? 0.8 : 1 }}>
                {/* In-bed range */}
                <div
                  className="absolute inset-y-0 bg-secondary-container rounded-sm"
                  style={{ left: `${bedPct}%`, width: `${outPct - bedPct}%` }}
                />
                {/* Sleep segments — split by awakening gap */}
                {awakGapStartPct !== null && awakGapEndPct !== null ? (
                  <>
                    <div
                      className="absolute inset-y-0 bg-primary rounded-sm"
                      style={{ left: `${onsetPct}%`, width: `${awakGapStartPct - onsetPct}%` }}
                    />
                    <div
                      className="absolute inset-y-0 bg-primary rounded-sm"
                      style={{ left: `${awakGapEndPct}%`, width: `${wakePct - awakGapEndPct}%` }}
                    />
                  </>
                ) : (
                  <div
                    className="absolute inset-y-0 bg-primary rounded-sm"
                    style={{ left: `${onsetPct}%`, width: `${wakePct - onsetPct}%` }}
                  />
                )}
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

      {/* Page indicators */}
      {(canGoBack || page > 0) && (
        <div className="flex justify-center gap-3 mt-4 items-center">
          <button
            onClick={() => page > 0 && setPage(p => p - 1)}
            disabled={page === 0}
            className={`material-symbols-outlined text-lg ${page === 0 ? 'text-on-surface-variant/20' : 'text-primary'}`}
            aria-label="Newer week"
          >
            chevron_left
          </button>
          <span className="font-label text-[10px] text-on-surface-variant/50 uppercase tracking-wider">
            {page === 0 ? 'This week' : `${page}w ago`}
          </span>
          <button
            onClick={() => canGoBack && setPage(p => p + 1)}
            disabled={!canGoBack}
            className={`material-symbols-outlined text-lg ${!canGoBack ? 'text-on-surface-variant/20' : 'text-primary'}`}
            aria-label="Older week"
          >
            chevron_right
          </button>
        </div>
      )}
    </section>
  )
}

function generateAxisTicks(rangeStartMin: number, rangeTotal: number): { label: string; pct: number }[] {
  const ticks: { label: string; pct: number }[] = []
  const startHour = Math.floor(rangeStartMin / 60)
  const hours: number[] = []

  hours.push(startHour)

  for (let h = Math.ceil(startHour / 3) * 3; h <= startHour + Math.ceil(rangeTotal / 60); h += 3) {
    if (h !== startHour) hours.push(h)
  }

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
