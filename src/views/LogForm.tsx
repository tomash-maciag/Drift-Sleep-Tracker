import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useTagsLive, useSettingLive, useTodayLog, useActiveMedsLive } from '../hooks/reactive'
import { createSleepLog, updateSleepLog } from '../hooks/useSleepLogs'
import { Section } from '../components/Section'
import { ToggleField } from '../components/ToggleField'
import { TagPicker } from '../components/TagPicker'
import { SleepBar } from '../components/SleepBar/SleepBar'
import { MedicationPanel } from '../components/MedicationPanel'
import { WeeklyReview } from '../components/WeeklyReview'
import { ExperimentPicker } from '../components/ExperimentPicker'
import { todayDate, isSunday, timeToMinutes, minutesToTime } from '../utils/date'

export function LogForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [date, setDate] = useState(searchParams.get('date') || todayDate())

  // Check for existing log on this date
  const existingLog = useTodayLog(date)

  // Sleep bar range settings
  const barRangeStart = useSettingLive<string>('sleepBarRangeStart', '00:00')
  const barRangeEnd = useSettingLive<string>('sleepBarRangeEnd', '08:00')

  // Sleep window defaults from settings
  const sleepWindowStart = useSettingLive<string>('sleepWindowStart', '00:00')
  const sleepWindowEnd = useSettingLive<string>('sleepWindowEnd', '06:00')

  // Compute defaults from sleep window
  const defaultBedtime = sleepWindowStart ?? '00:00'
  const defaultOnset = minutesToTime((timeToMinutes(defaultBedtime) + 15) % 1440)
  const defaultWake = sleepWindowEnd ?? '06:00'
  const defaultOut = minutesToTime((timeToMinutes(defaultWake) + 15) % 1440)

  // Sleep bar state
  const [bedtime, setBedtime] = useState(defaultBedtime)
  const [sleepOnset, setSleepOnset] = useState(defaultOnset)
  const [wakeTime, setWakeTime] = useState(defaultWake)
  const [outOfBedTime, setOutOfBedTime] = useState(defaultOut)

  // Sync defaults when settings load (async) and no existing log
  const [defaultsApplied, setDefaultsApplied] = useState(false)
  useEffect(() => {
    if (!existingLog && !defaultsApplied && sleepWindowStart && sleepWindowEnd) {
      setBedtime(sleepWindowStart)
      setSleepOnset(minutesToTime((timeToMinutes(sleepWindowStart) + 15) % 1440))
      setWakeTime(sleepWindowEnd)
      setOutOfBedTime(minutesToTime((timeToMinutes(sleepWindowEnd) + 15) % 1440))
      setDefaultsApplied(true)
    }
  }, [existingLog, defaultsApplied, sleepWindowStart, sleepWindowEnd])

  // Core fields
  const [alarmWake, setAlarmWake] = useState(0) // 0=Spontaneous, 1=Alarm
  const [quality, setQuality] = useState(1) // 0=Bad, 1=Average, 2=Good
  const [grogginess, setGrogginess] = useState(0) // 0=No, 1=Yes

  // Tags
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])

  // Awakening
  const [hasAwakening, setHasAwakening] = useState(0) // 0=No, 1=Yes
  const [awakeningTime, setAwakeningTime] = useState('')
  const [awakeningDuration, setAwakeningDuration] = useState<15 | 30 | 45>(15)

  // Medications — only meds with defaultTaken are pre-checked for new entries
  const activeMeds = useActiveMedsLive()
  const [takenMeds, setTakenMeds] = useState<string[]>([])
  const [medsInitialized, setMedsInitialized] = useState(false)

  useEffect(() => {
    if (!medsInitialized && activeMeds.length > 0 && !existingLog) {
      setTakenMeds(activeMeds.filter((m) => m.defaultTaken).map((m) => m.name))
      setMedsInitialized(true)
    }
  }, [medsInitialized, activeMeds, existingLog])

  const handleMedToggle = (medName: string) => {
    setTakenMeds((prev) =>
      prev.includes(medName) ? prev.filter((m) => m !== medName) : [...prev, medName]
    )
  }

  // Extended
  const [showExtended, setShowExtended] = useState(false)
  const [note, setNote] = useState('')

  // Light therapy (defaults from settings)
  const defaultLightStart = useSettingLive<string>('lightTherapyDefaultStart', '20:15')
  const defaultLightEnd = useSettingLive<string>('lightTherapyDefaultEnd', '21:15')
  const [lightStart, setLightStart] = useState('')
  const [lightEnd, setLightEnd] = useState('')
  const [lightIntensity] = useState('40cm')

  // Apply defaults when no existing log and settings loaded
  useEffect(() => {
    if (!existingLog && defaultLightStart && defaultLightEnd) {
      setLightStart((prev) => prev || defaultLightStart)
      setLightEnd((prev) => prev || defaultLightEnd)
    }
  }, [existingLog, defaultLightStart, defaultLightEnd])

  // Weekly review
  const [weeklyStress, setWeeklyStress] = useState(5)
  const [weeklyActivity, setWeeklyActivity] = useState('')
  const [weeklyInflammation, setWeeklyInflammation] = useState<string[]>([])
  const [weeklyRating, setWeeklyRating] = useState(5)

  // Experiment
  const [experimentCondition, setExperimentCondition] = useState<string | null>(null)

  // Pre-fill from existing log when editing
  useEffect(() => {
    if (existingLog) {
      setBedtime(existingLog.bedtime)
      setSleepOnset(existingLog.sleepOnset)
      setWakeTime(existingLog.wakeTime)
      setOutOfBedTime(existingLog.outOfBedTime)
      setAlarmWake(existingLog.alarmWake ? 1 : 0)
      // Map stored 1-10 quality to 3-level: <=4=Bad, 5-6=Average, >=7=Good
      const q = existingLog.sleepQuality
      setQuality(q <= 4 ? 0 : q <= 6 ? 1 : 2)
      setGrogginess(existingLog.grogginess >= 5 ? 1 : 0)
      if (existingLog.awakenings > 0) {
        setHasAwakening(1)
        // We don't store awakening time/duration separately yet, so leave defaults
      }
      setNote(existingLog.note ?? '')
      setSelectedTagIds([]) // Tags stored as labels; handled below
      setLightStart(existingLog.lightTherapyStart ?? '')
      setLightEnd(existingLog.lightTherapyEnd ?? '')
      // lightIntensity is fixed at 40cm
      setExperimentCondition(existingLog.experimentCondition)
      if (existingLog.weeklyStress !== null) setWeeklyStress(existingLog.weeklyStress)
      if (existingLog.weeklyActivity !== null) setWeeklyActivity(existingLog.weeklyActivity)
      if (existingLog.weeklyInflammation !== null) setWeeklyInflammation(existingLog.weeklyInflammation)
      if (existingLog.weeklyRating !== null) setWeeklyRating(existingLog.weeklyRating)
    }
  }, [existingLog])

  // Tags from DB
  const tags = useTagsLive()

  // When existing log has tags (stored as labels), resolve them to IDs
  useEffect(() => {
    if (existingLog && existingLog.tags.length > 0 && tags.length > 0) {
      const ids = tags
        .filter((t) => existingLog.tags.includes(t.label))
        .map((t) => t.id)
      setSelectedTagIds(ids)
    }
  }, [existingLog, tags])

  const tagPickerItems = tags.map((t) => ({
    id: t.id,
    label: t.label,
    active: selectedTagIds.includes(t.id),
  }))

  const handleTagToggle = (id: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    )
  }

  const handleSleepBarChange = useCallback((values: { bedtime: string; sleepOnset: string; wakeTime: string; outOfBedTime: string }) => {
    setBedtime(values.bedtime)
    setSleepOnset(values.sleepOnset)
    setWakeTime(values.wakeTime)
    setOutOfBedTime(values.outOfBedTime)
  }, [])

  const handleSave = async () => {
    // Convert selectedTagIds to labels
    const tagLabels = tags
      .filter((t) => selectedTagIds.includes(t.id))
      .map((t) => t.label)

    const isSundayDate = isSunday(date)

    const input = {
      bedtime,
      sleepOnset,
      wakeTime,
      outOfBedTime,
      alarmWake: alarmWake === 1,
      sleepQuality: quality === 0 ? 3 : quality === 1 ? 5 : 8,
      grogginess: grogginess === 1 ? 7 : 1,
      wakeUpMinutes: 20,
      awakenings: hasAwakening === 1 ? 1 : 0,
      lightTherapyStart: lightStart || null,
      lightTherapyEnd: lightEnd || null,
      lightTherapyIntensity: lightIntensity || null,
      tags: tagLabels,
      note: note || null,
      experimentCondition,
      weeklyStress: isSundayDate ? weeklyStress : null,
      weeklyActivity: isSundayDate ? weeklyActivity || null : null,
      weeklyInflammation: isSundayDate ? weeklyInflammation : null,
      weeklyRating: isSundayDate ? weeklyRating : null,
    }

    if (existingLog) {
      await updateSleepLog(existingLog.id, input)
    } else {
      await createSleepLog(date, input)
    }
    navigate('/')
  }

  return (
    <>
      {/* Sub-header */}
      <div className="flex items-center justify-between mb-6">
        <button className="w-11 h-11 flex items-center justify-center text-on-surface-variant" aria-label="Close" onClick={() => navigate('/')}>
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="font-headline text-lg font-semibold tracking-tight text-tertiary">Log Sleep</h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="font-label text-[10px] uppercase tracking-[0.15em] text-primary bg-surface-container-highest px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer"
        />
      </div>

      <div className="space-y-6">
        {/* Sleep Bar */}
        <SleepBar
          bedtime={bedtime}
          sleepOnset={sleepOnset}
          wakeTime={wakeTime}
          outOfBedTime={outOfBedTime}
          rangeStart={barRangeStart ?? '23:00'}
          rangeEnd={barRangeEnd ?? '09:00'}
          onChange={handleSleepBarChange}
        />

        {/* Awakening */}
        <Section>
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-4">Night Awakening</span>
          <ToggleField label="Woke up at night" options={['No', 'Yes']} value={hasAwakening} onChange={setHasAwakening} />
          {hasAwakening === 1 && (
            <div className="mt-4 flex gap-3 items-end">
              <div className="flex-1 bg-surface-container-low rounded-lg p-3">
                <span className="font-label text-[9px] text-on-surface-variant/40 uppercase tracking-wider block mb-1">Time</span>
                <input
                  type="time"
                  value={awakeningTime}
                  onChange={(e) => setAwakeningTime(e.target.value)}
                  className="w-full bg-transparent font-body text-sm text-tertiary border-none outline-none"
                />
              </div>
              <div className="flex gap-2">
                {([15, 30, 45] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setAwakeningDuration(d)}
                    className={`px-3 py-2.5 rounded-lg font-label text-xs transition-all ${
                      awakeningDuration === d
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-surface-container-low text-on-surface-variant border border-transparent'
                    }`}
                    aria-label={`${d} minutes`}
                  >
                    ~{d}m
                  </button>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* Core Fields */}
        <Section>
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-4">Morning</span>
          <div className="space-y-5">
            <ToggleField label="Wake type" options={['Spontaneous', 'Alarm']} value={alarmWake} onChange={setAlarmWake} />
            <ToggleField label="Sleep quality" options={['Bad', 'Average', 'Good']} value={quality} onChange={setQuality} />
            <ToggleField label="Grogginess" options={['No', 'Yes']} value={grogginess} onChange={setGrogginess} />
          </div>
        </Section>

        {/* Light Therapy */}
        <Section>
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-3">Light Therapy</span>
          <div className="flex gap-3">
            <div className="flex-1 bg-surface-container-low rounded-lg p-3">
              <span className="font-label text-[9px] text-on-surface-variant/40 uppercase tracking-wider block mb-1">Start</span>
              <input
                type="time"
                value={lightStart}
                onChange={(e) => setLightStart(e.target.value)}
                className="w-full bg-transparent font-body text-sm text-tertiary border-none outline-none"
                placeholder="--:--"
              />
            </div>
            <div className="flex-1 bg-surface-container-low rounded-lg p-3">
              <span className="font-label text-[9px] text-on-surface-variant/40 uppercase tracking-wider block mb-1">End</span>
              <input
                type="time"
                value={lightEnd}
                onChange={(e) => setLightEnd(e.target.value)}
                className="w-full bg-transparent font-body text-sm text-tertiary border-none outline-none"
                placeholder="--:--"
              />
            </div>
          </div>
        </Section>

        {/* Tags */}
        <Section>
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-3">Tags</span>
          <TagPicker tags={tagPickerItems} onToggle={handleTagToggle} />
        </Section>

        {/* Medications */}
        <MedicationPanel takenMeds={takenMeds} onToggle={handleMedToggle} />

        {/* Extended Fields (collapsible) */}
        <section className="bg-surface-container rounded-xl overflow-hidden">
          <button
            onClick={() => setShowExtended(!showExtended)}
            className="w-full p-6 flex items-center justify-between"
          >
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Extended</span>
            <span
              className="material-symbols-outlined text-on-surface-variant text-lg transition-transform"
              style={{ transform: showExtended ? 'rotate(180deg)' : '' }}
            >
              expand_more
            </span>
          </button>

          {showExtended && (
            <div className="px-6 pb-6 space-y-5 border-t border-outline-variant/10 pt-5">
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

        {/* Weekly Review (Sunday only) */}
        {isSunday(date) && (
          <WeeklyReview
            stress={weeklyStress}
            onStressChange={setWeeklyStress}
            activity={weeklyActivity}
            onActivityChange={setWeeklyActivity}
            inflammation={weeklyInflammation}
            onInflammationChange={setWeeklyInflammation}
            rating={weeklyRating}
            onRatingChange={setWeeklyRating}
          />
        )}

        {/* Experiment Picker (if active experiment) */}
        <ExperimentPicker value={experimentCondition} onChange={setExperimentCondition} />

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-4 bg-primary text-on-primary font-headline font-semibold text-lg rounded-2xl shadow-[0_0_32px_0_rgba(217,102,52,0.3)] active:scale-[0.98] transition-all"
        >
          {existingLog ? 'Update' : 'Save'}
        </button>
      </div>
    </>
  )
}
