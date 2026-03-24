import { useNavigate } from 'react-router'
import { useAllSleepLogsLive } from '../hooks/reactive'
import { computeSleepMetrics } from '../utils/sleep-math'
import { formatMinutesAsHMRounded } from '../utils/date'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatDate(dateStr: string): { day: string; label: string } {
  const d = new Date(dateStr + 'T12:00:00')
  const day = DAY_NAMES[d.getDay()]
  const label = `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`
  return { day, label }
}

export function History() {
  const navigate = useNavigate()
  const logs = useAllSleepLogsLive()

  return (
    <main className="px-6 pt-6 pb-32">
      <div className="flex items-center justify-between mb-6">
        <button
          className="w-11 h-11 flex items-center justify-center text-on-surface-variant"
          aria-label="Back"
          onClick={() => navigate('/')}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="font-headline text-lg font-semibold tracking-tight text-tertiary">History</h2>
        <div className="w-11" />
      </div>

      {logs.length === 0 ? (
        <p className="font-body text-sm text-on-surface-variant/60 text-center py-12">No entries yet.</p>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => {
            const { day, label } = formatDate(log.date)
            const metrics = computeSleepMetrics(log)
            return (
              <button
                key={log.id}
                onClick={() => navigate(`/log?date=${log.date}`)}
                className="w-full bg-surface-container rounded-xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform text-left"
                aria-label={`Edit log for ${log.date}`}
              >
                {/* Date */}
                <div className="w-12 text-center shrink-0">
                  <span className="font-label text-[9px] text-on-surface-variant/50 uppercase tracking-wider block">{day}</span>
                  <span className="font-headline text-lg font-extralight text-tertiary">{label}</span>
                </div>

                {/* Sleep bar mini */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-body text-sm text-tertiary">{log.bedtime}</span>
                    <span className="font-body text-[10px] text-on-surface-variant/40">-</span>
                    <span className="font-body text-sm text-primary">{log.wakeTime}</span>
                    <span className="font-body text-[10px] text-on-surface-variant/40">-</span>
                    <span className="font-body text-sm text-tertiary-dim">{log.outOfBedTime}</span>
                  </div>
                  <div className="flex gap-3 font-label text-[10px] text-on-surface-variant/60 uppercase tracking-wider">
                    <span>{formatMinutesAsHMRounded(metrics.tst)}</span>
                    <span>SE {Math.round(metrics.se)}%</span>
                  </div>
                </div>

                {/* Arrow */}
                <span className="material-symbols-outlined text-on-surface-variant/30 text-lg shrink-0">chevron_right</span>
              </button>
            )
          })}
        </div>
      )}
    </main>
  )
}
