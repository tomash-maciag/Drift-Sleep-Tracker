import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useActiveExperimentLive } from '../hooks/reactive'
import { createExperiment, archiveExperiment, computeExperimentComparison, getArchivedExperiments } from '../hooks/useExperiments'
import { todayDate } from '../utils/date'
import { ComparisonChart } from '../components/charts/ComparisonChart'
import { ExperimentCard } from '../components/ExperimentCard'
import { Section } from '../components/Section'

function daysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate + 'T12:00:00')
  const end = new Date(endDate + 'T12:00:00')
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

export function Experiments() {
  const activeExp = useActiveExperimentLive()
  const archivedExps = useLiveQuery(() => getArchivedExperiments(), [])
  const comparison = useLiveQuery(
    () => activeExp ? computeExperimentComparison(activeExp.id) : null,
    [activeExp?.id]
  )

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [name, setName] = useState('')
  const [condA, setCondA] = useState('')
  const [condB, setCondB] = useState('')
  const [creating, setCreating] = useState(false)

  const [showArchiveForm, setShowArchiveForm] = useState(false)
  const [archiveNotes, setArchiveNotes] = useState('')
  const [archiving, setArchiving] = useState(false)

  const canCreate = name.trim() !== '' && condA.trim() !== '' && condB.trim() !== ''

  async function handleCreate() {
    if (!canCreate || creating) return
    setCreating(true)
    try {
      await createExperiment(name.trim(), condA.trim(), condB.trim(), todayDate())
      setName('')
      setCondA('')
      setCondB('')
      setShowCreateForm(false)
    } finally {
      setCreating(false)
    }
  }

  async function handleArchive() {
    if (!activeExp || archiving) return
    setArchiving(true)
    try {
      await archiveExperiment(activeExp.id, todayDate(), archiveNotes.trim() || null)
      setArchiveNotes('')
      setShowArchiveForm(false)
    } finally {
      setArchiving(false)
    }
  }

  // Loading state
  if (activeExp === undefined) {
    return (
      <div className="space-y-6">
        <h1 className="font-headline text-xl font-light tracking-tight text-tertiary">Experiments</h1>
        <div className="py-8 text-center">
          <span className="font-body text-sm text-on-surface-variant">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="font-headline text-xl font-light tracking-tight text-tertiary">
        {activeExp ? activeExp.name : 'Experiments'}
      </h1>

      {/* Active Experiment */}
      {activeExp ? (
        <>
          <Section>
            <div className="space-y-4">
              {/* Status */}
              <div>
                <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-1">
                  Active since {activeExp.startDate}
                </span>
                <span className="font-body text-sm text-tertiary-dim">
                  Day {daysBetween(activeExp.startDate, todayDate()) + 1}
                </span>
              </div>

              {/* Comparison Chart */}
              {comparison && <ComparisonChart comparison={comparison} />}

              {/* Stats Summary */}
              {comparison && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-surface-container-low">
                  <div>
                    <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-1">
                      {comparison.conditionA.label}
                    </span>
                    <span className="font-body text-sm text-tertiary-dim">
                      {comparison.conditionA.dayCount} {comparison.conditionA.dayCount === 1 ? 'night' : 'nights'}
                    </span>
                  </div>
                  <div>
                    <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-1">
                      {comparison.conditionB.label}
                    </span>
                    <span className="font-body text-sm text-tertiary-dim">
                      {comparison.conditionB.dayCount} {comparison.conditionB.dayCount === 1 ? 'night' : 'nights'}
                    </span>
                  </div>
                </div>
              )}

              {/* Archive Button */}
              {!showArchiveForm ? (
                <button
                  onClick={() => setShowArchiveForm(true)}
                  className="w-full py-2.5 rounded-lg font-label text-[10px] uppercase tracking-[0.1em] bg-surface-container-low text-on-surface-variant border border-transparent hover:border-primary/20 transition-all"
                >
                  Archive Experiment
                </button>
              ) : (
                <div className="space-y-3 pt-2 border-t border-surface-container-low">
                  <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block">
                    Closing Notes
                  </span>
                  <textarea
                    value={archiveNotes}
                    onChange={(e) => setArchiveNotes(e.target.value)}
                    placeholder="Any observations or conclusions..."
                    className="w-full bg-surface-container-low rounded-lg px-3 py-2 font-body text-sm text-tertiary placeholder:text-on-surface-variant/40 border border-transparent focus:border-primary/30 focus:outline-none resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowArchiveForm(false)}
                      className="flex-1 py-2 rounded-lg font-label text-[10px] uppercase tracking-[0.1em] bg-surface-container-low text-on-surface-variant border border-transparent"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleArchive}
                      disabled={archiving}
                      className="flex-1 py-2 rounded-lg font-label text-[10px] uppercase tracking-[0.1em] bg-primary/20 text-primary border border-primary/30 disabled:opacity-50"
                    >
                      {archiving ? 'Archiving...' : 'Confirm Archive'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Section>
        </>
      ) : (
        <>
          {/* No active experiment — create prompt */}
          <Section>
            {!showCreateForm ? (
              <div className="space-y-4">
                <div>
                  <h2 className="font-headline text-base font-light tracking-tight text-tertiary mb-1">
                    Start an experiment
                  </h2>
                  <p className="font-body text-sm text-tertiary-dim">
                    Run an N-of-1 experiment to compare two conditions and see which works better for your sleep.
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full py-2.5 rounded-lg font-label text-[10px] uppercase tracking-[0.1em] bg-primary/20 text-primary border border-primary/30"
                >
                  Create
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block">
                  New Experiment
                </span>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Experiment name (e.g. Light Timing)"
                    className="w-full bg-surface-container-low rounded-lg px-3 py-2.5 font-body text-sm text-tertiary placeholder:text-on-surface-variant/40 border border-transparent focus:border-primary/30 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={condA}
                    onChange={(e) => setCondA(e.target.value)}
                    placeholder="Condition A (e.g. Light 19:30)"
                    className="w-full bg-surface-container-low rounded-lg px-3 py-2.5 font-body text-sm text-tertiary placeholder:text-on-surface-variant/40 border border-transparent focus:border-primary/30 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={condB}
                    onChange={(e) => setCondB(e.target.value)}
                    placeholder="Condition B (e.g. Light 20:30)"
                    className="w-full bg-surface-container-low rounded-lg px-3 py-2.5 font-body text-sm text-tertiary placeholder:text-on-surface-variant/40 border border-transparent focus:border-primary/30 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowCreateForm(false)
                      setName('')
                      setCondA('')
                      setCondB('')
                    }}
                    className="flex-1 py-2.5 rounded-lg font-label text-[10px] uppercase tracking-[0.1em] bg-surface-container-low text-on-surface-variant border border-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!canCreate || creating}
                    className={`flex-1 py-2.5 rounded-lg font-label text-[10px] uppercase tracking-[0.1em] transition-all ${
                      canCreate
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-surface-container-low text-on-surface-variant/40 border border-transparent'
                    } disabled:opacity-50`}
                  >
                    {creating ? 'Starting...' : 'Start'}
                  </button>
                </div>
              </div>
            )}
          </Section>
        </>
      )}

      {/* Archived Experiments */}
      {archivedExps && archivedExps.length > 0 && (
        <div className="space-y-3">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block px-1">
            Archived
          </span>
          {archivedExps.map((exp) => (
            <ExperimentCard key={exp.id} experiment={exp} />
          ))}
        </div>
      )}
    </div>
  )
}
