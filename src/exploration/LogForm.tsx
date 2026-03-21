import { useState } from 'react'
import { formatMinutesAsHMRounded, timeToMinutes } from '../utils/date'
import { computeSleepMetrics } from '../utils/sleep-math'

// Mock static sleep bar values
const mockSleepBar = {
  bedtime: '23:15',
  sleepOnset: '23:30',
  wakeTime: '06:15',
  outOfBedTime: '06:45',
}

const defaultTags = [
  { id: '1', label: 'Stress', active: false },
  { id: '2', label: 'Alcohol', active: false },
  { id: '3', label: 'Illness', active: false },
  { id: '4', label: 'Travel', active: false },
  { id: '5', label: 'Late coffee', active: true },
  { id: '6', label: 'Exercise', active: false },
  { id: '7', label: 'Stomach', active: false },
]

export function LogForm({ onClose }: { onClose: () => void }) {
  const [quality, setQuality] = useState(7)
  const [grogginess, setGrogginess] = useState(4)
  const [alertMinutes, setAlertMinutes] = useState(20)
  const [alarmWake, setAlarmWake] = useState(false)
  const [tags, setTags] = useState(defaultTags)
  const [showExtended, setShowExtended] = useState(false)
  const [awakenings, setAwakenings] = useState(1)
  const [note, setNote] = useState('')
  const [isSunday] = useState(true) // mock
  const [weeklyStress, setWeeklyStress] = useState(5)
  const [weeklyRating, setWeeklyRating] = useState(6)
  const [experimentCondition, setExperimentCondition] = useState<'A' | 'B' | null>(null)

  const metrics = computeSleepMetrics(mockSleepBar)

  const toggleTag = (id: string) => {
    setTags(tags.map(t => t.id === id ? { ...t, active: !t.active } : t))
  }

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen pb-8 max-w-[400px] mx-auto selection:bg-primary-container selection:text-primary">

      {/* 1. Header */}
      <header className="sticky top-0 z-50 bg-[#161712]/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-6 h-14">
          <button className="text-on-surface-variant" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
          <h1 className="font-headline text-lg font-semibold tracking-tight text-tertiary">Log Sleep</h1>
          <button className="font-label text-[10px] uppercase tracking-[0.15em] text-primary bg-surface-container-highest px-3 py-1.5 rounded-lg">
            Today
          </button>
        </div>
      </header>

      <main className="px-6 pt-6 space-y-6">

        {/* 2. Sleep Bar (static mockup) */}
        <section className="bg-surface-container rounded-xl p-6">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-4">Sleep Range</span>

          {/* Time bar */}
          <div className="relative">
            {/* Time labels — above the bar */}
            <div className="relative h-4 mb-2">
              {[
                { label: '23:00', pct: 0 },
                { label: '01:00', pct: (2 * 60 / (10 * 60)) * 100 },
                { label: '03:00', pct: (4 * 60 / (10 * 60)) * 100 },
                { label: '05:00', pct: (6 * 60 / (10 * 60)) * 100 },
                { label: '07:00', pct: (8 * 60 / (10 * 60)) * 100 },
                { label: '09:00', pct: 100 },
              ].map((t) => (
                <span
                  key={t.label}
                  className="absolute font-label text-[10px] text-on-surface-variant/50 -translate-x-1/2"
                  style={{ left: `${t.pct}%` }}
                >
                  {t.label}
                </span>
              ))}
            </div>

            {/* Track */}
            <div className="h-12 w-full bg-surface-container-highest rounded-full relative">
              {/* Hour dividers */}
              {(() => {
                const rangeTotal = 10 * 60
                const dividers = [2, 4, 6, 8].map(h => (h * 60 / rangeTotal) * 100)
                return dividers.map((pct, i) => (
                  <div
                    key={i}
                    className="absolute top-2 bottom-2 w-px bg-outline-variant/15"
                    style={{ left: `${pct}%` }}
                  />
                ))
              })()}

              {/* Sleep & in-bed ranges */}
              {(() => {
                const rangeStart = 23 * 60
                const rangeTotal = 10 * 60
                const normBed = timeToMinutes(mockSleepBar.bedtime) - rangeStart
                const normOnset = timeToMinutes(mockSleepBar.sleepOnset) - rangeStart
                const normWake = timeToMinutes(mockSleepBar.wakeTime) + 1440 - rangeStart
                const normOut = timeToMinutes(mockSleepBar.outOfBedTime) + 1440 - rangeStart

                const bedPct = (normBed / rangeTotal) * 100
                const onsetPct = (normOnset / rangeTotal) * 100
                const wakePct = (normWake / rangeTotal) * 100
                const outPct = (normOut / rangeTotal) * 100

                return (
                  <>
                    {/* In bed */}
                    <div
                      className="absolute top-1.5 bottom-1.5 bg-secondary-container/40 rounded-full"
                      style={{ left: `${bedPct}%`, width: `${outPct - bedPct}%` }}
                    />
                    {/* Sleep */}
                    <div
                      className="absolute top-1.5 bottom-1.5 bg-primary/80 rounded-full"
                      style={{ left: `${onsetPct}%`, width: `${wakePct - onsetPct}%` }}
                    />
                    {/* Handle: wake time */}
                    <div
                      className="absolute top-2 bottom-2 w-2 bg-secondary rounded-full"
                      style={{ left: `${wakePct}%`, marginLeft: '-4px' }}
                    />
                    {/* Handle: out of bed */}
                    <div
                      className="absolute top-2.5 bottom-2.5 w-1.5 bg-secondary/60 rounded-full"
                      style={{ left: `${outPct}%`, marginLeft: '-3px' }}
                    />
                  </>
                )
              })()}
            </div>
          </div>

          {/* Range display */}
          <div className="mt-4 flex justify-between items-end">
            <div>
              <span className="font-headline text-2xl font-extralight text-tertiary">
                {mockSleepBar.sleepOnset} – {mockSleepBar.wakeTime}
              </span>
            </div>
            <div className="text-right font-label text-[10px] text-on-surface-variant uppercase tracking-widest space-y-0.5">
              <div>Slept: {formatMinutesAsHMRounded(metrics.tst)}</div>
              <div>In bed: {formatMinutesAsHMRounded(metrics.tib)}</div>
            </div>
          </div>
        </section>

        {/* 3. Core Fields */}
        <section className="bg-surface-container rounded-xl p-6 space-y-5">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block">Core</span>

          {/* Alarm toggle */}
          <div className="flex items-center justify-between">
            <span className="font-body text-sm text-tertiary-dim">Wake type</span>
            <div className="flex bg-surface-container-low rounded-lg p-0.5">
              <button
                onClick={() => setAlarmWake(false)}
                className={`px-3 py-1.5 rounded-md font-label text-[10px] uppercase tracking-[0.1em] transition-all ${
                  !alarmWake ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant'
                }`}
              >
                Spontaneous
              </button>
              <button
                onClick={() => setAlarmWake(true)}
                className={`px-3 py-1.5 rounded-md font-label text-[10px] uppercase tracking-[0.1em] transition-all ${
                  alarmWake ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant'
                }`}
              >
                Alarm
              </button>
            </div>
          </div>

          {/* Sleep Quality */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-body text-sm text-tertiary-dim">Sleep Quality</span>
              <span className="font-headline text-lg font-extralight text-primary">{quality}</span>
            </div>
            <input
              type="range"
              min={1} max={10} value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full h-1 bg-surface-container-low rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="font-label text-[9px] text-on-surface-variant/40">Poor</span>
              <span className="font-label text-[9px] text-on-surface-variant/40">Excellent</span>
            </div>
          </div>

          {/* Grogginess */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-body text-sm text-tertiary-dim">Grogginess</span>
              <span className="font-headline text-lg font-extralight text-primary">{grogginess}</span>
            </div>
            <input
              type="range"
              min={0} max={10} value={grogginess}
              onChange={(e) => setGrogginess(Number(e.target.value))}
              className="w-full h-1 bg-surface-container-low rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="font-label text-[9px] text-on-surface-variant/40">None</span>
              <span className="font-label text-[9px] text-on-surface-variant/40">Can't function</span>
            </div>
          </div>

          {/* Time to Alertness */}
          <div className="flex items-center justify-between">
            <span className="font-body text-sm text-tertiary-dim">Time to alertness</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAlertMinutes(Math.max(0, alertMinutes - 5))}
                className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-lg">remove</span>
              </button>
              <span className="font-headline text-lg font-extralight text-tertiary w-12 text-center">{alertMinutes}m</span>
              <button
                onClick={() => setAlertMinutes(Math.min(90, alertMinutes + 5))}
                className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
          </div>
        </section>

        {/* Light Therapy */}
        <section className="bg-surface-container rounded-xl p-6">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-3">Light Therapy</span>
          <div className="flex gap-3">
            <div className="flex-1 bg-surface-container-low rounded-lg p-3">
              <span className="font-label text-[9px] text-on-surface-variant/40 uppercase tracking-wider block mb-1">Start</span>
              <span className="font-body text-sm text-tertiary">19:30</span>
            </div>
            <div className="flex-1 bg-surface-container-low rounded-lg p-3">
              <span className="font-label text-[9px] text-on-surface-variant/40 uppercase tracking-wider block mb-1">End</span>
              <span className="font-body text-sm text-tertiary">20:30</span>
            </div>
            <div className="flex-1 bg-surface-container-low rounded-lg p-3">
              <span className="font-label text-[9px] text-on-surface-variant/40 uppercase tracking-wider block mb-1">Distance</span>
              <span className="font-body text-sm text-tertiary">30cm</span>
            </div>
          </div>
        </section>

        {/* 4. Tags */}
        <section className="bg-surface-container rounded-xl p-6">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-3">Tags</span>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1.5 rounded-lg font-label text-xs transition-all ${
                  tag.active
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-surface-container-low text-on-surface-variant border border-transparent'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </section>

        {/* 5. Medications */}
        <section className="bg-surface-container rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Medications</span>
            <button className="font-label text-[10px] uppercase tracking-[0.1em] text-primary">+ Add</button>
          </div>
          <div className="space-y-3">
            {/* Existing medication */}
            <div className="flex items-center justify-between bg-surface-container-low rounded-lg p-3">
              <div>
                <span className="font-body text-sm text-tertiary">Trazodon</span>
                <span className="font-label text-[10px] text-on-surface-variant ml-2">50mg</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-label text-[10px] text-on-surface-variant">No change</span>
                <button className="font-label text-[10px] text-primary">Edit</button>
              </div>
            </div>
            <div className="flex items-center justify-between bg-surface-container-low rounded-lg p-3">
              <div>
                <span className="font-body text-sm text-tertiary">Melatonin</span>
                <span className="font-label text-[10px] text-on-surface-variant ml-2">3mg</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-label text-[10px] text-on-surface-variant">No change</span>
                <button className="font-label text-[10px] text-primary">Edit</button>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Extended Fields */}
        <section className="bg-surface-container rounded-xl overflow-hidden">
          <button
            onClick={() => setShowExtended(!showExtended)}
            className="w-full p-6 flex items-center justify-between"
          >
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Extended</span>
            <span className="material-symbols-outlined text-on-surface-variant text-lg transition-transform" style={{ transform: showExtended ? 'rotate(180deg)' : '' }}>
              expand_more
            </span>
          </button>

          {showExtended && (
            <div className="px-6 pb-6 space-y-5 border-t border-outline-variant/10 pt-5">
              {/* Awakenings */}
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-tertiary-dim">Night awakenings</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAwakenings(Math.max(0, awakenings - 1))}
                    className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-lg">remove</span>
                  </button>
                  <span className="font-headline text-lg font-extralight text-tertiary w-6 text-center">{awakenings}</span>
                  <button
                    onClick={() => setAwakenings(Math.min(5, awakenings + 1))}
                    className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                  </button>
                </div>
              </div>

              {/* Note */}
              <div>
                <span className="font-body text-sm text-tertiary-dim block mb-2">Note</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Anything unusual..."
                  rows={2}
                  className="w-full bg-surface-container-low rounded-lg p-3 font-body text-sm text-tertiary placeholder:text-on-surface-variant/30 border-none outline-none resize-none"
                />
              </div>
            </div>
          )}
        </section>

        {/* 6. Weekly Review (Sunday only) */}
        {isSunday && (
          <section className="bg-surface-container rounded-xl p-6 space-y-5 border-l-2 border-primary-container">
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary block">Weekly Review</span>

            {/* Stress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-body text-sm text-tertiary-dim">Weekly stress</span>
                <span className="font-headline text-lg font-extralight text-primary">{weeklyStress}</span>
              </div>
              <input
                type="range"
                min={1} max={10} value={weeklyStress}
                onChange={(e) => setWeeklyStress(Number(e.target.value))}
                className="w-full h-1 bg-surface-container-low rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            {/* Activity */}
            <div>
              <span className="font-body text-sm text-tertiary-dim block mb-2">Physical activity</span>
              <div className="bg-surface-container-low rounded-lg p-3">
                <span className="font-body text-sm text-on-surface-variant">3× this week, mornings</span>
              </div>
            </div>

            {/* Inflammation */}
            <div>
              <span className="font-body text-sm text-tertiary-dim block mb-2">Inflammatory symptoms</span>
              <div className="flex flex-wrap gap-2">
                {['Back pain', 'Morning stiffness', 'Psoriasis flare', 'None'].map((s) => (
                  <button
                    key={s}
                    className={`px-3 py-1.5 rounded-lg font-label text-xs transition-all ${
                      s === 'None'
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-surface-container-low text-on-surface-variant border border-transparent'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Week Rating */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-body text-sm text-tertiary-dim">Overall week rating</span>
                <span className="font-headline text-lg font-extralight text-primary">{weeklyRating}</span>
              </div>
              <input
                type="range"
                min={1} max={10} value={weeklyRating}
                onChange={(e) => setWeeklyRating(Number(e.target.value))}
                className="w-full h-1 bg-surface-container-low rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          </section>
        )}

        {/* 7. Experiment Condition */}
        <section className="bg-surface-container rounded-xl p-6">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-3">Experiment: Light Timing</span>
          <div className="flex gap-2">
            {[
              { value: null as 'A' | 'B' | null, label: 'None' },
              { value: 'A' as const, label: 'Light 19:30' },
              { value: 'B' as const, label: 'Light 20:30' },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => setExperimentCondition(opt.value)}
                className={`flex-1 py-2 rounded-lg font-label text-[10px] uppercase tracking-[0.1em] transition-all ${
                  experimentCondition === opt.value
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-surface-container-low text-on-surface-variant border border-transparent'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* 8. Save Button */}
        <button className="w-full py-4 bg-primary text-on-primary font-headline font-semibold text-lg rounded-2xl shadow-[0_0_32px_0_rgba(217,102,52,0.3)] active:scale-[0.98] transition-all">
          Save
        </button>

      </main>
    </div>
  )
}
