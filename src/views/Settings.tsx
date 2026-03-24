import { useState, useRef, useMemo } from 'react'
import { useSettingLive, useTagsLive, useAllMedsLive } from '../hooks/reactive'
import { setSetting } from '../hooks/useSettings'
import { addTag, removeTag } from '../hooks/useTags'
import { addMedication, updateMedicationDose, deactivateMedication } from '../hooks/useMedications'
import { exportAllData, importAllData, downloadJson } from '../hooks/useDataExport'
import { requestNotificationPermission } from '../hooks/useNotifications'
import { getAvailableCities } from '../utils/cities'
import { Section } from '../components/Section'
import type { ExportData } from '../types'

export function Settings() {
  // --- Reactive data ---
  const sleepWindowStart = useSettingLive<string>('sleepWindowStart', '00:00')
  const sleepWindowEnd = useSettingLive<string>('sleepWindowEnd', '06:00')
  const barRangeStart = useSettingLive<string>('sleepBarRangeStart', '00:00')
  const barRangeEnd = useSettingLive<string>('sleepBarRangeEnd', '08:00')
  const notifTime = useSettingLive<string>('notificationTime', '07:30')
  const city = useSettingLive<string>('city', 'Warszawa')
  const lightStart = useSettingLive<string>('lightTherapyDefaultStart', '20:15')
  const lightEnd = useSettingLive<string>('lightTherapyDefaultEnd', '21:15')
  const tags = useTagsLive()
  const meds = useAllMedsLive()

  // --- Local UI state ---
  const [notifEnabled, setNotifEnabled] = useState(false)
  const [addingTag, setAddingTag] = useState(false)
  const [newTagLabel, setNewTagLabel] = useState('')
  const [addingMed, setAddingMed] = useState(false)
  const [newMedName, setNewMedName] = useState('')
  const [newMedDose, setNewMedDose] = useState('')
  const [editingMedId, setEditingMedId] = useState<string | null>(null)
  const [editDose, setEditDose] = useState('')
  const [importStatus, setImportStatus] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cities = useMemo(() => getAvailableCities(), [])

  // Derive notification enabled state from the setting
  const isNotifEnabled = notifEnabled || (notifTime !== null && notifTime !== '')

  // --- Handlers ---
  async function handleNotifToggle() {
    if (!notifEnabled) {
      const granted = await requestNotificationPermission()
      if (!granted) return
      setNotifEnabled(true)
      await setSetting('notificationTime', notifTime ?? '07:30')
    } else {
      setNotifEnabled(false)
      await setSetting('notificationTime', '')
    }
  }

  async function handleAddTag() {
    const label = newTagLabel.trim()
    if (!label) return
    await addTag(label)
    setNewTagLabel('')
    setAddingTag(false)
  }

  async function handleAddMed() {
    const name = newMedName.trim()
    const dose = newMedDose.trim()
    if (!name || !dose) return
    await addMedication(name, dose)
    setNewMedName('')
    setNewMedDose('')
    setAddingMed(false)
  }

  async function handleUpdateDose(medId: string) {
    const dose = editDose.trim()
    if (!dose) return
    const today = new Date().toISOString().slice(0, 10)
    await updateMedicationDose(medId, dose, today)
    setEditingMedId(null)
    setEditDose('')
  }

  async function handleExport() {
    const data = await exportAllData()
    downloadJson(data)
  }

  async function handleImport() {
    fileInputRef.current?.click()
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text) as ExportData
      if (!data.version || !data.sleepLogs || !data.tags) {
        setImportStatus('Invalid file format')
        return
      }
      await importAllData(data)
      setImportStatus('Import successful')
    } catch {
      setImportStatus('Import failed — invalid JSON')
    }
    // Reset file input so the same file can be re-selected
    e.target.value = ''
    setTimeout(() => setImportStatus(null), 3000)
  }

  return (
    <div className="space-y-6">

      {/* Sleep Window */}
      <Section>
        <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-4">Sleep Window</span>
        <p className="font-body text-sm text-on-surface-variant/60 mb-4">Your target bedtime and wake time. Used to calculate sleep efficiency and shown as reference lines on charts.</p>
        <div className="flex gap-3">
          <div className="flex-1 bg-surface-container-low rounded-lg p-4">
            <span className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-wider block mb-1">Bedtime</span>
            <input
              type="time"
              value={sleepWindowStart ?? '00:00'}
              onChange={(e) => setSetting('sleepWindowStart', e.target.value)}
              className="bg-transparent font-headline text-2xl font-extralight text-tertiary border-none outline-none w-full"
            />
          </div>
          <div className="flex-1 bg-surface-container-low rounded-lg p-4">
            <span className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-wider block mb-1">Wake up</span>
            <input
              type="time"
              value={sleepWindowEnd ?? '06:00'}
              onChange={(e) => setSetting('sleepWindowEnd', e.target.value)}
              className="bg-transparent font-headline text-2xl font-extralight text-tertiary border-none outline-none w-full"
            />
          </div>
        </div>
      </Section>

      {/* Sleep Bar Range */}
      <Section>
        <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-4">Sleep Bar Range</span>
        <p className="font-body text-sm text-on-surface-variant/60 mb-4">The time range displayed on the logging bar. Adjust if you regularly go to bed before 23:00 or wake after 09:00.</p>
        <div className="flex gap-3">
          <div className="flex-1 bg-surface-container-low rounded-lg p-4">
            <span className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-wider block mb-1">From</span>
            <input
              type="time"
              value={barRangeStart ?? '23:00'}
              onChange={(e) => setSetting('sleepBarRangeStart', e.target.value)}
              className="bg-transparent font-headline text-2xl font-extralight text-tertiary border-none outline-none w-full"
            />
          </div>
          <div className="flex-1 bg-surface-container-low rounded-lg p-4">
            <span className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-wider block mb-1">To</span>
            <input
              type="time"
              value={barRangeEnd ?? '09:00'}
              onChange={(e) => setSetting('sleepBarRangeEnd', e.target.value)}
              className="bg-transparent font-headline text-2xl font-extralight text-tertiary border-none outline-none w-full"
            />
          </div>
        </div>
      </Section>

      {/* Light Therapy Defaults */}
      <Section>
        <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-4">Light Therapy</span>
        <p className="font-body text-sm text-on-surface-variant/60 mb-4">Default times pre-filled when logging a new entry.</p>
        <div className="flex gap-3">
          <div className="flex-1 bg-surface-container-low rounded-lg p-4">
            <span className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-wider block mb-1">Start</span>
            <input
              type="time"
              value={lightStart ?? '20:15'}
              onChange={(e) => setSetting('lightTherapyDefaultStart', e.target.value)}
              className="bg-transparent font-headline text-2xl font-extralight text-tertiary border-none outline-none w-full"
            />
          </div>
          <div className="flex-1 bg-surface-container-low rounded-lg p-4">
            <span className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-wider block mb-1">End</span>
            <input
              type="time"
              value={lightEnd ?? '21:15'}
              onChange={(e) => setSetting('lightTherapyDefaultEnd', e.target.value)}
              className="bg-transparent font-headline text-2xl font-extralight text-tertiary border-none outline-none w-full"
            />
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section>
        <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-4">Notifications</span>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-body text-base text-tertiary-dim">Morning reminder</span>
            <button
              onClick={handleNotifToggle}
              className={`w-11 h-6 rounded-full transition-all relative ${
                isNotifEnabled ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-tertiary absolute top-0.5 transition-all ${
                isNotifEnabled ? 'left-5.5' : 'left-0.5'
              }`} />
            </button>
          </div>
          {isNotifEnabled && (
            <div className="bg-surface-container-low rounded-lg p-4">
              <span className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-wider block mb-1">Remind at</span>
              <input
                type="time"
                value={notifTime ?? '07:30'}
                onChange={(e) => setSetting('notificationTime', e.target.value)}
                className="bg-transparent font-headline text-2xl font-extralight text-tertiary border-none outline-none w-full"
              />
            </div>
          )}
        </div>
      </Section>

      {/* Location */}
      <Section>
        <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-4">Location</span>
        <p className="font-body text-sm text-on-surface-variant/60 mb-4">Used to fetch sunrise/sunset data for the seasonal view. Set once — no GPS needed.</p>
        <div className="bg-surface-container-low rounded-lg p-4">
          <span className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-wider block mb-1">City</span>
          <select
            value={city ?? 'Warszawa'}
            onChange={(e) => setSetting('city', e.target.value)}
            className="bg-transparent font-body text-base text-tertiary border-none outline-none w-full appearance-none cursor-pointer"
          >
            {cities.map((c) => (
              <option key={c} value={c} className="bg-surface-container text-tertiary">{c}</option>
            ))}
          </select>
        </div>
      </Section>

      {/* Tags */}
      <Section>
        <div className="flex items-center justify-between mb-4">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Tags</span>
          <button
            onClick={() => setAddingTag(true)}
            className="font-label text-xs uppercase tracking-[0.1em] text-primary"
          >
            + Add
          </button>
        </div>
        <p className="font-body text-sm text-on-surface-variant/60 mb-4">Tags you can attach to daily logs. Add your own or remove ones you don't use.</p>

        {addingTag && (
          <div className="mb-3 bg-surface-container-low rounded-lg p-4">
            <input
              type="text"
              autoFocus
              placeholder="Tag name"
              value={newTagLabel}
              onChange={(e) => setNewTagLabel(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddTag() }}
              onBlur={() => { if (newTagLabel.trim()) handleAddTag(); else setAddingTag(false) }}
              className="bg-transparent font-body text-base text-tertiary border-none outline-none w-full placeholder:text-on-surface-variant/30"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low"
            >
              <span className="font-label text-sm text-tertiary-dim">{tag.label}</span>
              {!tag.isDefault && (
                <span className="font-label text-[9px] text-on-surface-variant/40">custom</span>
              )}
              <button
                onClick={() => removeTag(tag.id)}
                className="text-on-surface-variant/40 hover:text-error transition-colors ml-1"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Medications */}
      <Section>
        <div className="flex items-center justify-between mb-4">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Medications</span>
          <button
            onClick={() => setAddingMed(true)}
            className="font-label text-xs uppercase tracking-[0.1em] text-primary"
          >
            + Add
          </button>
        </div>
        <p className="font-body text-sm text-on-surface-variant/60 mb-4">Manage your medication list. Changes are logged with dates so you can track how dose adjustments affect sleep.</p>

        {addingMed && (
          <div className="mb-3 bg-surface-container-low rounded-lg p-4 space-y-2">
            <input
              type="text"
              autoFocus
              placeholder="Medication name"
              value={newMedName}
              onChange={(e) => setNewMedName(e.target.value)}
              className="bg-transparent font-body text-base text-tertiary border-none outline-none w-full placeholder:text-on-surface-variant/30"
            />
            <input
              type="text"
              placeholder="Dose (e.g. 50mg)"
              value={newMedDose}
              onChange={(e) => setNewMedDose(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddMed() }}
              className="bg-transparent font-body text-base text-tertiary border-none outline-none w-full placeholder:text-on-surface-variant/30"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setAddingMed(false); setNewMedName(''); setNewMedDose('') }}
                className="font-label text-[10px] uppercase tracking-[0.1em] text-on-surface-variant/40"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMed}
                className="font-label text-xs uppercase tracking-[0.1em] text-primary"
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {meds.map((med) => (
            <div
              key={med.id}
              className={`bg-surface-container-low rounded-lg p-4 ${!med.active ? 'opacity-40' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-body text-base text-tertiary">{med.name}</span>
                  <span className="font-label text-[10px] text-on-surface-variant ml-2">{med.currentDose}</span>
                  {!med.active && (
                    <span className="font-label text-[9px] text-on-surface-variant/40 ml-2">inactive</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setEditingMedId(med.id); setEditDose(med.currentDose) }}
                    className="font-label text-[10px] text-primary"
                  >
                    Edit
                  </button>
                  {med.active && (
                    <button
                      onClick={() => deactivateMedication(med.id)}
                      className="font-label text-[10px] text-on-surface-variant/40 hover:text-error"
                    >
                      Deactivate
                    </button>
                  )}
                </div>
              </div>

              {editingMedId === med.id && (
                <div className="mt-2 flex gap-2 items-center">
                  <input
                    type="text"
                    autoFocus
                    value={editDose}
                    onChange={(e) => setEditDose(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateDose(med.id) }}
                    className="flex-1 bg-surface-container rounded-lg p-2 font-body text-base text-tertiary border-none outline-none placeholder:text-on-surface-variant/30"
                    placeholder="New dose"
                  />
                  <button
                    onClick={() => setEditingMedId(null)}
                    className="font-label text-[10px] uppercase tracking-[0.1em] text-on-surface-variant/40"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateDose(med.id)}
                    className="font-label text-xs uppercase tracking-[0.1em] text-primary"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Data */}
      <Section>
        <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-4">Data</span>
        <p className="font-body text-sm text-on-surface-variant/60 mb-4">Export all your data as a JSON file for backup. Import to restore data on a new device.</p>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex-1 py-3 rounded-lg bg-surface-container-low font-label text-sm uppercase tracking-[0.1em] text-tertiary-dim hover:bg-surface-container-high transition-all"
          >
            Export
          </button>
          <button
            onClick={handleImport}
            className="flex-1 py-3 rounded-lg bg-surface-container-low font-label text-sm uppercase tracking-[0.1em] text-tertiary-dim hover:bg-surface-container-high transition-all"
          >
            Import
          </button>
        </div>
        {importStatus && (
          <p className={`font-body text-xs mt-3 ${importStatus.includes('successful') ? 'text-primary' : 'text-error'}`}>
            {importStatus}
          </p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelected}
          className="hidden"
        />
      </Section>
    </div>
  )
}
