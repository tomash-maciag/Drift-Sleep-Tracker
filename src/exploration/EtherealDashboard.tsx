import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, ReferenceLine, Tooltip, Cell,
} from 'recharts'
import { mockLogs, mockKPI, mockInsights } from './mockData'
import { formatMinutesAsHMRounded, minutesToTimeRounded, timeToMinutes } from '../utils/date'
import type { SleepLogWithMetrics } from '../types'

export function EtherealDashboard({ onOpenLog, onOpenSettings }: { onOpenLog?: () => void; onOpenSettings?: () => void }) {
  const [days, setDays] = useState<7 | 14 | 30>(7)
  const filteredLogs = mockLogs.slice(-days)

  // Mock: whether today has been logged
  const todayLogged = true
  const todayLog = mockLogs[mockLogs.length - 1]

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen pb-32 max-w-[400px] mx-auto selection:bg-primary-container selection:text-primary">

      {/* 1. Top App Bar */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] z-50 bg-[#161712]/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">bedtime</span>
            <h1 className="font-headline text-lg font-bold tracking-[0.1em] text-tertiary">DRIFT</h1>
          </div>
        </div>
      </header>

      <main className="pt-20 px-6 space-y-6">

        {/* 2. Greeting */}
        <div>
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
            {new Date().toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
          <h2 className="font-headline text-2xl font-light tracking-tight text-tertiary">
            {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'}
          </h2>
        </div>

        {/* 3. Today's Status */}
        {todayLogged ? (
          <section className="bg-surface-container rounded-xl p-5">
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-3">Last Night</span>
            <div className="flex items-baseline gap-4">
              <div>
                <span className="font-headline text-2xl font-extralight text-tertiary">
                  {formatMinutesAsHMRounded(todayLog.metrics.tst)}
                </span>
                <span className="font-label text-[10px] text-secondary ml-1">sleep</span>
              </div>
              <div className="w-px h-5 bg-outline-variant/20" />
              <div>
                <span className="font-headline text-2xl font-extralight text-tertiary">
                  {todayLog.wakeTime}
                </span>
                <span className="font-label text-[10px] text-secondary ml-1">wake</span>
              </div>
              <div className="w-px h-5 bg-outline-variant/20" />
              <div>
                <span className="font-headline text-2xl font-extralight text-tertiary">
                  {todayLog.metrics.se.toFixed(0)}
                </span>
                <span className="font-label text-[10px] text-primary ml-0.5">%</span>
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-surface-container rounded-xl p-6 flex items-center justify-between">
            <div>
              <span className="font-headline text-lg font-light text-tertiary">Log today's sleep</span>
              <p className="font-label text-[10px] text-on-surface-variant mt-1 uppercase tracking-[0.15em]">Tap to record last night</p>
            </div>
            <button className="bg-primary text-on-primary w-10 h-10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">add</span>
            </button>
          </section>
        )}

        {/* 3. Sleep Pattern */}
        <section className="bg-surface-container rounded-xl p-6">
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
          <SleepTimelineChart logs={mockLogs.slice(-7)} />
        </section>

        {/* 4. Insights */}
        <section className="bg-surface-container rounded-xl p-6 border-l-2 border-primary-container">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-3 block">Insights</span>
          <div className="space-y-3">
            {mockInsights.map((insight) => (
              <p key={insight.id} className="font-body text-sm text-tertiary-dim leading-relaxed">
                {insight.severity === 'warning' && (
                  <span className="text-error font-semibold">⚠ </span>
                )}
                {insight.severity === 'info' && (
                  <span className="text-primary font-semibold">→ </span>
                )}
                {insight.message}
              </p>
            ))}
          </div>
        </section>

        {/* 5. Trends: KPI + Toggle + Charts */}
        <KPISection days={days} setDays={setDays} />

        {/* 6. Wake Time Trend */}
        <section className="bg-surface-container-high rounded-xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-headline text-xl font-light tracking-tight text-tertiary">Wake Trend</h2>
              <div className="flex items-center gap-2">
                <span className="font-label text-[10px] uppercase tracking-widest text-secondary">Target 06:00</span>
                <div className="w-4 h-0 border-t border-dashed border-primary opacity-80" />
              </div>
            </div>
            <div className="text-right">
              <span className="font-headline text-2xl font-extralight text-tertiary">
                {minutesToTimeRounded(mockKPI.avgWakeTime!)}
              </span>
              <span className="font-label text-[10px] text-on-surface-variant block uppercase tracking-widest">Avg</span>
            </div>
          </div>
          <WakeTrendChart logs={filteredLogs} days={days} />
        </section>

        {/* 8. Sleep Efficiency */}
        <section className="bg-surface-container rounded-xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-headline text-xl font-light tracking-tight text-tertiary">Efficiency</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-label text-[10px] uppercase tracking-widest text-secondary">Target 85%</span>
                <div className="w-4 h-0 border-t border-dashed border-primary opacity-80" />
              </div>
            </div>
            <div className="text-right">
              <span className="font-headline text-2xl font-extralight text-tertiary">
                {mockKPI.avgSe!.toFixed(0)}%
              </span>
              <span className="font-label text-[10px] text-on-surface-variant block uppercase tracking-widest">Avg</span>
            </div>
          </div>
          <EfficiencyLineChart logs={filteredLogs} days={days} />
        </section>

      </main>

      {/* FAB */}
      <button
        className="fixed bottom-24 right-6 bg-primary text-on-primary h-14 w-14 rounded-2xl shadow-[0_0_32px_0_rgba(217,102,52,0.3)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40"
        onClick={onOpenLog}
      >
        <span className="material-symbols-outlined">add</span>
      </button>

      {/* 9. Bottom Nav */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] z-50 flex justify-around items-center px-6 pb-6 pt-3 bg-[#1a1c15]/90 backdrop-blur-xl rounded-t-[20px] border-t border-white/5">
        <button className="flex flex-col items-center text-primary active:scale-90 duration-300">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>bedtime</span>
          <span className="font-label uppercase tracking-[0.1em] text-[10px] mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center text-secondary hover:text-tertiary transition-all active:scale-90 duration-300">
          <span className="material-symbols-outlined text-2xl">science</span>
          <span className="font-label uppercase tracking-[0.1em] text-[10px] mt-1">Experiments</span>
        </button>
        <button className="flex flex-col items-center text-secondary hover:text-tertiary transition-all active:scale-90 duration-300" onClick={onOpenSettings}>
          <span className="material-symbols-outlined text-2xl">settings</span>
          <span className="font-label uppercase tracking-[0.1em] text-[10px] mt-1">Settings</span>
        </button>
      </footer>
    </div>
  )
}

/* ── KPI Cards ── */
function KPISection({ days, setDays }: { days: 7 | 14 | 30; setDays: (d: 7 | 14 | 30) => void }) {
  const cards = [
    { label: 'Sleep Time', value: formatMinutesAsHMRounded(mockKPI.avgTst!).replace('h ', 'h\u00A0'), unit: '' },
    { label: 'Efficiency', value: mockKPI.avgSe!.toFixed(0), unit: '%' },
    { label: 'Wake Up', value: minutesToTimeRounded(mockKPI.avgWakeTime!), unit: '' },
    { label: 'Trend', value: '↑', unit: mockKPI.trend === 'up' ? 'Improving' : mockKPI.trend === 'down' ? 'Declining' : 'Stable' },
  ]

  return (
    <section>
      <div className="flex items-end justify-between mb-4">
        <div>
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Overview</span>
          <h2 className="font-headline text-xl font-light tracking-tight text-tertiary">Trends</h2>
        </div>
        <div className="flex gap-1 bg-surface-container-low p-1 rounded-lg">
          {([7, 14, 30] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1 rounded-md font-label text-[10px] uppercase tracking-[0.1em] transition-all ${
                d === days
                  ? 'bg-surface-container-highest text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <div key={card.label} className="p-5 bg-surface-container rounded-xl flex flex-col justify-between h-28">
            <span className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
              {card.label}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-headline text-3xl font-extralight text-tertiary">{card.value}</span>
              {card.unit && (
                <span className="font-label text-xs text-primary">{card.unit}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Sleep Timeline ── */
function SleepTimelineChart({ logs }: { logs: SleepLogWithMetrics[] }) {
  // Target sleep window lines: 00:00 and 07:00
  // Range is 22:00–10:00 (720 min)
  const midnightPct = (2 * 60 / (12 * 60)) * 100 // 16.67%
  const sevenPct = (9 * 60 / (12 * 60)) * 100 // 75%

  return (
    <div className="space-y-3 relative">
      {/* Sleep window target lines */}
      <div className="absolute pointer-events-none z-10" style={{ top: '12px', left: 0, right: 0, bottom: '4px' }}>
        <div
          className="absolute top-0 bottom-0 border-l border-dashed border-primary/80"
          style={{ left: `${midnightPct}%` }}
        />
        <div
          className="absolute top-0 bottom-0 border-l border-dashed border-primary/80"
          style={{ left: `${sevenPct}%` }}
        />
      </div>
      {logs.map((log) => {
        const bedMin = timeToMinutes(log.bedtime)
        const onsetMin = timeToMinutes(log.sleepOnset)
        const wakeMin = timeToMinutes(log.wakeTime)
        const outMin = timeToMinutes(log.outOfBedTime)

        const rangeStart = 22 * 60
        const rangeTotal = 12 * 60

        const normBed = bedMin >= rangeStart ? bedMin - rangeStart : bedMin + 1440 - rangeStart
        const normOnset = onsetMin >= rangeStart ? onsetMin - rangeStart : onsetMin + 1440 - rangeStart
        const normWake = wakeMin < rangeStart ? wakeMin + 1440 - rangeStart : wakeMin - rangeStart
        const normOut = outMin < rangeStart ? outMin + 1440 - rangeStart : outMin - rangeStart

        const bedPct = (normBed / rangeTotal) * 100
        const outPct = (normOut / rangeTotal) * 100
        const onsetPct = (normOnset / rangeTotal) * 100
        const wakePct = (normWake / rangeTotal) * 100

        const tst = log.metrics.tst
        const dayLabel = new Date(log.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' })

        return (
          <div key={log.date} className="space-y-1">
            <div className="flex justify-between items-end px-0.5">
              <span className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-widest">{dayLabel}</span>
              <span className="font-label text-xs text-tertiary-dim">{formatMinutesAsHMRounded(tst)}</span>
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
      {/* Time axis — aligned with actual positions */}
      <div className="relative mt-2 h-3">
        {[
          { label: '22:00', pct: 0 },
          { label: '00:00', pct: (2 * 60 / (12 * 60)) * 100 },
          { label: '03:00', pct: (5 * 60 / (12 * 60)) * 100 },
          { label: '07:00', pct: (9 * 60 / (12 * 60)) * 100 },
          { label: '10:00', pct: 100 },
        ].map((t) => (
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
  )
}

/* ── Weekly aggregation helper ── */
function aggregateWeekly(logs: SleepLogWithMetrics[]) {
  const weeks: SleepLogWithMetrics[][] = []
  let currentWeek: SleepLogWithMetrics[] = []

  for (let i = 0; i < logs.length; i++) {
    currentWeek.push(logs[i])
    if (currentWeek.length === 7 || i === logs.length - 1) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }
  return weeks
}

function weekLabel(logs: SleepLogWithMetrics[]): string {
  const first = logs[0].date.slice(5) // MM-DD
  return `W${first}`
}

/* ── Wake Trend ── */
function WakeTrendChart({ logs, days }: { logs: SleepLogWithMetrics[]; days: number }) {
  const isWeekly = days === 30

  const data = isWeekly
    ? aggregateWeekly(logs).map((week) => ({
        date: weekLabel(week),
        wake: Math.round(week.reduce((sum, l) => sum + timeToMinutes(l.wakeTime), 0) / week.length),
      }))
    : logs.map((log) => ({
        date: new Date(log.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' }).toUpperCase(),
        wake: timeToMinutes(log.wakeTime),
      }))

  const lastIndex = data.length - 1
  const barWidth = isWeekly ? 36 : 24

  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <YAxis domain={['dataMin - 30', 'dataMax + 15']} hide />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 9, fill: '#858178' }}
          axisLine={false}
          tickLine={false}
        />
        <ReferenceLine
          y={360}
          stroke="#d96634"
          strokeOpacity={0.8}
          strokeDasharray="4 3"
          strokeWidth={1}
        />
        <Bar dataKey="wake" radius={[4, 4, 0, 0]} barSize={barWidth}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={i === lastIndex ? '#d96634' : '#3d3e34'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ── Efficiency Chart ── */
function EfficiencyLineChart({ logs, days }: { logs: SleepLogWithMetrics[]; days: number }) {
  const isWeekly = days === 30

  const data = isWeekly
    ? aggregateWeekly(logs).map((week) => ({
        date: weekLabel(week),
        se: Math.round(week.reduce((sum, l) => sum + l.metrics.se, 0) / week.length * 10) / 10,
      }))
    : logs.map((log) => ({
        date: new Date(log.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' }).toUpperCase(),
        se: Math.round(log.metrics.se * 10) / 10,
      }))

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="seGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d96634" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#d96634" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 9, fill: '#858178' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[60, 100]}
          ticks={[60, 70, 80, 85, 90, 100]}
          tick={{ fontSize: 9, fill: '#858178' }}
          axisLine={false}
          tickLine={false}
          width={32}
          tickFormatter={(v: number) => `${v}%`}
        />
        <ReferenceLine y={85} stroke="#d96634" strokeOpacity={0.8} strokeDasharray="4 3" strokeWidth={1} />
        <Tooltip
          formatter={(value) => [`${value}%`, 'SE']}
          contentStyle={{
            background: 'rgba(44, 46, 37, 0.9)',
            border: '1px solid rgba(77,74,67,0.2)',
            borderRadius: '6px',
            fontSize: '11px',
            color: '#f9f6f2',
            backdropFilter: 'blur(20px)',
          }}
        />
        <Area
          type="monotone"
          dataKey="se"
          stroke="#d96634"
          strokeWidth={2}
          strokeLinejoin="round"
          fill="url(#seGrad2)"
          dot={false}
          activeDot={{ r: 3, fill: '#f9f6f2', stroke: 'none' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
