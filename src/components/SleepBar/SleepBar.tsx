import { useRef, useMemo, useCallback } from 'react'
import { timeToMinutes, minutesToTime } from '../../utils/date'
import { computeSleepMetrics } from '../../utils/sleep-math'
import { formatMinutesAsHMRounded } from '../../utils/date'
import { usePointerDrag } from './usePointerDrag'

interface SleepBarProps {
  bedtime: string      // HH:MM
  sleepOnset: string   // HH:MM
  wakeTime: string     // HH:MM
  outOfBedTime: string // HH:MM
  rangeStart: string   // HH:MM from settings (default '22:00')
  rangeEnd: string     // HH:MM from settings (default '10:00')
  onChange: (values: { bedtime: string; sleepOnset: string; wakeTime: string; outOfBedTime: string }) => void
}

/** Normalize a time in minutes relative to the range start, wrapping past midnight */
function normalizeMinutes(timeMin: number, rangeStartMin: number): number {
  let norm = timeMin - rangeStartMin
  if (norm < 0) norm += 1440
  return norm
}

/** Compute the total range in minutes (wrapping past midnight) */
function computeRangeTotal(rangeStartMin: number, rangeEndMin: number): number {
  let total = rangeEndMin - rangeStartMin
  if (total <= 0) total += 1440
  return total
}

export function SleepBar({ bedtime, sleepOnset, wakeTime, outOfBedTime, rangeStart, rangeEnd, onChange }: SleepBarProps) {
  const barRef = useRef<HTMLDivElement>(null)

  const rangeStartMin = timeToMinutes(rangeStart)
  const rangeEndMin = timeToMinutes(rangeEnd)
  const rangeTotalMin = computeRangeTotal(rangeStartMin, rangeEndMin)

  // Normalized positions as percentages
  const positions = useMemo(() => {
    const bedNorm = normalizeMinutes(timeToMinutes(bedtime), rangeStartMin)
    const onsetNorm = normalizeMinutes(timeToMinutes(sleepOnset), rangeStartMin)
    const wakeNorm = normalizeMinutes(timeToMinutes(wakeTime), rangeStartMin)
    const outNorm = normalizeMinutes(timeToMinutes(outOfBedTime), rangeStartMin)

    return {
      bedPct: (bedNorm / rangeTotalMin) * 100,
      onsetPct: (onsetNorm / rangeTotalMin) * 100,
      wakePct: (wakeNorm / rangeTotalMin) * 100,
      outPct: (outNorm / rangeTotalMin) * 100,
    }
  }, [bedtime, sleepOnset, wakeTime, outOfBedTime, rangeStartMin, rangeTotalMin])

  // Compute hour labels and dividers
  const { labels } = useMemo(() => {
    const labelsList: { label: string; pct: number }[] = []
    const dividersList: number[] = []

    // Generate hour marks from rangeStart to rangeEnd
    const startHour = Math.ceil(rangeStartMin / 60)
    const totalHours = Math.ceil(rangeTotalMin / 60)

    for (let i = 0; i <= totalHours; i++) {
      const hourMin = (startHour + i) * 60
      const norm = normalizeMinutes(hourMin % 1440, rangeStartMin)
      const pct = (norm / rangeTotalMin) * 100

      if (pct >= 0 && pct <= 100) {
        const hour = ((startHour + i) % 24 + 24) % 24
        const label = `${String(hour).padStart(2, '0')}:00`
        labelsList.push({ label, pct })
        if (pct > 0 && pct < 100) {
          dividersList.push(pct)
        }
      }
    }

    return { labels: labelsList, dividers: dividersList }
  }, [rangeStartMin, rangeTotalMin])

  const metrics = computeSleepMetrics({ bedtime, sleepOnset, wakeTime, outOfBedTime })

  // Convert percentage back to time string
  const pctToTime = useCallback((pct: number): string => {
    const minutes = rangeStartMin + pct * rangeTotalMin
    return minutesToTime(Math.round(minutes))
  }, [rangeStartMin, rangeTotalMin])

  const handleDrag = useCallback((handleId: string, pct: number) => {
    const newTime = pctToTime(pct)
    const newMin = timeToMinutes(newTime)

    if (handleId === 'bedtime') {
      // Bedtime can't go past wake time
      const wakeNorm = normalizeMinutes(timeToMinutes(wakeTime), rangeStartMin)
      const newNorm = normalizeMinutes(newMin, rangeStartMin)
      if (newNorm >= wakeNorm) return
      onChange({ bedtime: newTime, sleepOnset: newTime, wakeTime, outOfBedTime })
    } else if (handleId === 'wake') {
      // Wake can't go before sleepOnset or after outOfBed
      const onsetNorm = normalizeMinutes(timeToMinutes(sleepOnset), rangeStartMin)
      const outNorm = normalizeMinutes(timeToMinutes(outOfBedTime), rangeStartMin)
      const newNorm = normalizeMinutes(newMin, rangeStartMin)
      if (newNorm <= onsetNorm || newNorm >= outNorm) return
      onChange({ bedtime, sleepOnset, wakeTime: newTime, outOfBedTime })
    } else if (handleId === 'outOfBed') {
      // OutOfBed can't go before wake
      const wakeNorm = normalizeMinutes(timeToMinutes(wakeTime), rangeStartMin)
      const newNorm = normalizeMinutes(newMin, rangeStartMin)
      if (newNorm <= wakeNorm) return
      onChange({ bedtime, sleepOnset, wakeTime, outOfBedTime: newTime })
    }
  }, [bedtime, sleepOnset, wakeTime, outOfBedTime, rangeStartMin, pctToTime, onChange])

  const handleSwipe = useCallback((startPct: number, endPct: number) => {
    const newBedtime = pctToTime(startPct)
    const newOnset = newBedtime
    const newOutOfBed = pctToTime(endPct)
    // Wake = outOfBed - 15min
    const outMin = timeToMinutes(newOutOfBed)
    const wakeMin = ((outMin - 15) % 1440 + 1440) % 1440
    const newWake = minutesToTime(wakeMin)
    onChange({ bedtime: newBedtime, sleepOnset: newOnset, wakeTime: newWake, outOfBedTime: newOutOfBed })
  }, [pctToTime, onChange])

  const handleDragEnd = useCallback(() => {
    // No-op for now, could trigger haptic feedback or save
  }, [])

  const pointerHandlers = usePointerDrag({
    barRef,
    rangeStartMin,
    rangeTotalMin,
    snapMinutes: 15,
    onSwipe: handleSwipe,
    onDrag: handleDrag,
    onDragEnd: handleDragEnd,
  })

  return (
    <section className="bg-surface-container rounded-xl p-6">
      <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-4">Sleep Range</span>

      {/* Time displays above bar */}
      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div>
          <span className="font-label text-[10px] text-on-surface-variant/50 uppercase tracking-wider block mb-1">Bedtime</span>
          <span className="font-headline text-2xl font-extralight text-tertiary">{bedtime}</span>
        </div>
        <div>
          <span className="font-label text-[10px] text-on-surface-variant/50 uppercase tracking-wider block mb-1">Wake</span>
          <span className="font-headline text-2xl font-extralight text-primary">{wakeTime}</span>
        </div>
        <div>
          <span className="font-label text-[10px] text-on-surface-variant/50 uppercase tracking-wider block mb-1">Out of bed</span>
          <span className="font-headline text-2xl font-extralight text-tertiary">{outOfBedTime}</span>
        </div>
      </div>

      <div className="relative">
        {/* Edge labels only */}
        <div className="flex justify-between mb-1">
          <span className="font-label text-[10px] text-on-surface-variant/50">{labels[0]?.label}</span>
          <span className="font-label text-[10px] text-on-surface-variant/50">{labels[labels.length - 1]?.label}</span>
        </div>

        {/* Track */}
        <div
          ref={barRef}
          className="h-12 w-full bg-surface-container-highest rounded-lg relative touch-none select-none"
          {...pointerHandlers}
        >
          {/* In-bed range */}
          <div
            className="absolute top-1.5 bottom-1.5 bg-secondary-container/40 rounded-sm"
            style={{ left: `${positions.bedPct}%`, width: `${positions.outPct - positions.bedPct}%` }}
          />

          {/* Sleep range */}
          <div
            className="absolute top-1.5 bottom-1.5 bg-primary/80 rounded-sm"
            style={{ left: `${positions.onsetPct}%`, width: `${positions.wakePct - positions.onsetPct}%` }}
          />

          {/* Handle: bedtime */}
          <div
            data-handle-id="bedtime"
            className="absolute top-1.5 bottom-1.5 w-3 bg-secondary/60 rounded-full cursor-ew-resize"
            style={{ left: `${positions.bedPct}%`, marginLeft: '-6px' }}
          />

          {/* Handle: wake time */}
          <div
            data-handle-id="wake"
            className="absolute top-1.5 bottom-1.5 w-3 bg-secondary rounded-full cursor-ew-resize"
            style={{ left: `${positions.wakePct}%`, marginLeft: '-6px' }}
          />

          {/* Handle: out of bed */}
          <div
            data-handle-id="outOfBed"
            className="absolute top-1.5 bottom-1.5 w-3 bg-secondary/60 rounded-full cursor-ew-resize"
            style={{ left: `${positions.outPct}%`, marginLeft: '-6px' }}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-center">
        <div className="bg-surface-container-low rounded-lg py-2.5">
          <span className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-wider block">In bed</span>
          <span className="font-body text-base text-tertiary-dim">{formatMinutesAsHMRounded(metrics.tib)}</span>
        </div>
        <div className="bg-surface-container-low rounded-lg py-2.5">
          <span className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-wider block">Slept</span>
          <span className="font-body text-base text-tertiary-dim">{formatMinutesAsHMRounded(metrics.tst)}</span>
        </div>
      </div>
    </section>
  )
}
