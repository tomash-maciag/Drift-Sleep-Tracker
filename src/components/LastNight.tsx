import { useNavigate } from 'react-router'
import { useTodayLog } from '../hooks/reactive'
import { computeSleepMetrics } from '../utils/sleep-math'
import { formatMinutesAsHMRounded, todayDate } from '../utils/date'

export function LastNight() {
  const navigate = useNavigate()
  const todayLog = useTodayLog(todayDate())

  // undefined = loading, null = no log today
  if (todayLog === undefined) return null

  if (!todayLog) {
    return (
      <section className="bg-surface-container rounded-xl p-6 flex items-center justify-between">
        <div>
          <span className="font-headline text-lg font-light text-tertiary">Log today's sleep</span>
          <p className="font-label text-[10px] text-on-surface-variant mt-1 uppercase tracking-[0.15em]">Tap to record last night</p>
        </div>
        <button onClick={() => navigate('/log')} aria-label="Log sleep" className="bg-primary text-on-primary w-11 h-11 rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-xl">add</span>
        </button>
      </section>
    )
  }

  const metrics = computeSleepMetrics(todayLog)
  return (
    <section className="bg-surface-container rounded-xl p-5">
      <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-3">Last Night</span>
      <div className="flex items-baseline gap-4">
        <div>
          <span className="font-headline text-2xl font-extralight text-tertiary">{formatMinutesAsHMRounded(metrics.tst)}</span>
          <span className="font-label text-[10px] text-secondary ml-1">sleep</span>
        </div>
        <div className="w-px h-5 bg-outline-variant/20" />
        <div>
          <span className="font-headline text-2xl font-extralight text-tertiary">{todayLog.wakeTime}</span>
          <span className="font-label text-[10px] text-secondary ml-1">wake</span>
        </div>
      </div>
    </section>
  )
}
