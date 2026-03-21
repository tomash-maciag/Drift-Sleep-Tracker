import { useState } from 'react'

const defaultTags = [
  { id: '1', label: 'Stress', isDefault: true },
  { id: '2', label: 'Alcohol', isDefault: true },
  { id: '3', label: 'Illness', isDefault: true },
  { id: '4', label: 'Travel', isDefault: true },
  { id: '5', label: 'Late coffee', isDefault: true },
  { id: '6', label: 'Exercise', isDefault: true },
  { id: '7', label: 'Stomach', isDefault: true },
  { id: '8', label: 'Migraine', isDefault: false },
]

const defaultMeds = [
  { id: '1', name: 'Trazodon', dose: '50mg', active: true },
  { id: '2', name: 'Melatonin', dose: '3mg', active: true },
  { id: '3', name: 'Hydroxyzine', dose: '25mg', active: false },
]

export function Settings({ onClose }: { onClose: () => void }) {
  const [sleepWindowStart, setSleepWindowStart] = useState('23:00')
  const [sleepWindowEnd, setSleepWindowEnd] = useState('07:00')
  const [barRangeStart, setBarRangeStart] = useState('23:00')
  const [barRangeEnd, setBarRangeEnd] = useState('09:00')
  const [notifTime, setNotifTime] = useState('07:30')
  const [notifEnabled, setNotifEnabled] = useState(true)
  const [city, setCity] = useState('Warszawa')
  const [tags, setTags] = useState(defaultTags)
  const [meds, setMeds] = useState(defaultMeds)

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen pb-32 max-w-[400px] mx-auto selection:bg-primary-container selection:text-primary">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#161712]/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-6 h-14">
          <button className="text-on-surface-variant" onClick={onClose}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline text-lg font-semibold tracking-tight text-tertiary">Settings</h1>
          <div className="w-6" />
        </div>
      </header>

      <main className="px-6 pt-6 space-y-6">

        {/* Sleep Window */}
        <section className="bg-surface-container rounded-xl p-6">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-4">Sleep Window</span>
          <p className="font-body text-xs text-on-surface-variant/60 mb-4">Your target bedtime and wake time. Used to calculate sleep efficiency and shown as reference lines on charts.</p>
          <div className="flex gap-3">
            <div className="flex-1 bg-surface-container-low rounded-lg p-3">
              <span className="font-label text-[9px] text-on-surface-variant/40 uppercase tracking-wider block mb-1">Bedtime</span>
              <input
                type="time"
                value={sleepWindowStart}
                onChange={(e) => setSleepWindowStart(e.target.value)}
                className="bg-transparent font-headline text-lg font-extralight text-tertiary border-none outline-none w-full"
              />
            </div>
            <div className="flex-1 bg-surface-container-low rounded-lg p-3">
              <span className="font-label text-[9px] text-on-surface-variant/40 uppercase tracking-wider block mb-1">Wake up</span>
              <input
                type="time"
                value={sleepWindowEnd}
                onChange={(e) => setSleepWindowEnd(e.target.value)}
                className="bg-transparent font-headline text-lg font-extralight text-tertiary border-none outline-none w-full"
              />
            </div>
          </div>
        </section>

        {/* Sleep Bar Range */}
        <section className="bg-surface-container rounded-xl p-6">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-4">Sleep Bar Range</span>
          <p className="font-body text-xs text-on-surface-variant/60 mb-4">The time range displayed on the logging bar. Adjust if you regularly go to bed before 23:00 or wake after 09:00.</p>
          <div className="flex gap-3">
            <div className="flex-1 bg-surface-container-low rounded-lg p-3">
              <span className="font-label text-[9px] text-on-surface-variant/40 uppercase tracking-wider block mb-1">From</span>
              <input
                type="time"
                value={barRangeStart}
                onChange={(e) => setBarRangeStart(e.target.value)}
                className="bg-transparent font-headline text-lg font-extralight text-tertiary border-none outline-none w-full"
              />
            </div>
            <div className="flex-1 bg-surface-container-low rounded-lg p-3">
              <span className="font-label text-[9px] text-on-surface-variant/40 uppercase tracking-wider block mb-1">To</span>
              <input
                type="time"
                value={barRangeEnd}
                onChange={(e) => setBarRangeEnd(e.target.value)}
                className="bg-transparent font-headline text-lg font-extralight text-tertiary border-none outline-none w-full"
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-surface-container rounded-xl p-6">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-4">Notifications</span>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-tertiary-dim">Morning reminder</span>
              <button
                onClick={() => setNotifEnabled(!notifEnabled)}
                className={`w-11 h-6 rounded-full transition-all relative ${
                  notifEnabled ? 'bg-primary' : 'bg-surface-container-highest'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-tertiary absolute top-0.5 transition-all ${
                  notifEnabled ? 'left-5.5' : 'left-0.5'
                }`} />
              </button>
            </div>
            {notifEnabled && (
              <div className="bg-surface-container-low rounded-lg p-3">
                <span className="font-label text-[9px] text-on-surface-variant/40 uppercase tracking-wider block mb-1">Remind at</span>
                <input
                  type="time"
                  value={notifTime}
                  onChange={(e) => setNotifTime(e.target.value)}
                  className="bg-transparent font-headline text-lg font-extralight text-tertiary border-none outline-none w-full"
                />
              </div>
            )}
          </div>
        </section>

        {/* City */}
        <section className="bg-surface-container rounded-xl p-6">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-4">Location</span>
          <p className="font-body text-xs text-on-surface-variant/60 mb-4">Used to fetch sunrise/sunset data for the seasonal view. Set once — no GPS needed.</p>
          <div className="bg-surface-container-low rounded-lg p-3">
            <span className="font-label text-[9px] text-on-surface-variant/40 uppercase tracking-wider block mb-1">City</span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-transparent font-body text-sm text-tertiary border-none outline-none w-full appearance-none cursor-pointer"
            >
              {['Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań', 'Łódź', 'Szczecin', 'Lublin', 'Katowice', 'Białystok'].map((c) => (
                <option key={c} value={c} className="bg-surface-container text-tertiary">{c}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Tags */}
        <section className="bg-surface-container rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Tags</span>
            <button className="font-label text-[10px] uppercase tracking-[0.1em] text-primary">+ Add</button>
          </div>
          <p className="font-body text-xs text-on-surface-variant/60 mb-4">Tags you can attach to daily logs. Add your own or remove ones you don't use.</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low"
              >
                <span className="font-label text-xs text-tertiary-dim">{tag.label}</span>
                {!tag.isDefault && (
                  <span className="font-label text-[9px] text-on-surface-variant/40">custom</span>
                )}
                <button
                  onClick={() => setTags(tags.filter(t => t.id !== tag.id))}
                  className="text-on-surface-variant/40 hover:text-error transition-colors ml-1"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Medications */}
        <section className="bg-surface-container rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Medications</span>
            <button className="font-label text-[10px] uppercase tracking-[0.1em] text-primary">+ Add</button>
          </div>
          <p className="font-body text-xs text-on-surface-variant/60 mb-4">Manage your medication list. Changes are logged with dates so you can track how dose adjustments affect sleep.</p>
          <div className="space-y-3">
            {meds.map((med) => (
              <div
                key={med.id}
                className={`flex items-center justify-between bg-surface-container-low rounded-lg p-3 ${!med.active ? 'opacity-40' : ''}`}
              >
                <div>
                  <span className="font-body text-sm text-tertiary">{med.name}</span>
                  <span className="font-label text-[10px] text-on-surface-variant ml-2">{med.dose}</span>
                  {!med.active && (
                    <span className="font-label text-[9px] text-on-surface-variant/40 ml-2">inactive</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button className="font-label text-[10px] text-primary">Edit</button>
                  {med.active && (
                    <button
                      onClick={() => setMeds(meds.map(m => m.id === med.id ? { ...m, active: false } : m))}
                      className="font-label text-[10px] text-on-surface-variant/40 hover:text-error"
                    >
                      Deactivate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data */}
        <section className="bg-surface-container rounded-xl p-6">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-4">Data</span>
          <p className="font-body text-xs text-on-surface-variant/60 mb-4">Export all your data as a JSON file for backup. Import to restore data on a new device.</p>
          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-lg bg-surface-container-low font-label text-xs uppercase tracking-[0.1em] text-tertiary-dim hover:bg-surface-container-high transition-all">
              Export
            </button>
            <button className="flex-1 py-3 rounded-lg bg-surface-container-low font-label text-xs uppercase tracking-[0.1em] text-tertiary-dim hover:bg-surface-container-high transition-all">
              Import
            </button>
          </div>
        </section>

      </main>

      {/* Bottom Nav */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] z-50 flex justify-around items-center px-6 pb-6 pt-3 bg-[#1a1c15]/90 backdrop-blur-xl rounded-t-[20px] border-t border-white/5">
        <button className="flex flex-col items-center text-secondary hover:text-tertiary transition-all active:scale-90 duration-300" onClick={onClose}>
          <span className="material-symbols-outlined text-2xl">bedtime</span>
          <span className="font-label uppercase tracking-[0.1em] text-[10px] mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center text-secondary hover:text-tertiary transition-all active:scale-90 duration-300">
          <span className="material-symbols-outlined text-2xl">science</span>
          <span className="font-label uppercase tracking-[0.1em] text-[10px] mt-1">Experiments</span>
        </button>
        <button className="flex flex-col items-center text-primary active:scale-90 duration-300">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
          <span className="font-label uppercase tracking-[0.1em] text-[10px] mt-1">Settings</span>
        </button>
      </footer>
    </div>
  )
}
