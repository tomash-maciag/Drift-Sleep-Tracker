import { useActiveMedsLive } from '../hooks/reactive'
import { Section } from './Section'

interface MedicationPanelProps {
  takenMeds: string[]
  onToggle: (medName: string) => void
}

export function MedicationPanel({ takenMeds, onToggle }: MedicationPanelProps) {
  const meds = useActiveMedsLive()

  if (meds.length === 0) return null

  return (
    <Section>
      <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant block mb-3">Medications</span>
      <div className="space-y-2">
        {meds.map((med) => {
          const taken = takenMeds.includes(med.name)
          return (
            <button
              key={med.id}
              onClick={() => onToggle(med.name)}
              className={`w-full flex items-center justify-between rounded-lg p-3 transition-all ${
                taken
                  ? 'bg-surface-container-low'
                  : 'bg-surface-container-low opacity-50'
              }`}
              aria-label={`${med.name} ${taken ? 'taken' : 'not taken'}`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-lg ${taken ? 'text-primary' : 'text-on-surface-variant/40'}`}>
                  {taken ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <div className="text-left">
                  <span className={`font-body text-sm ${taken ? 'text-tertiary' : 'text-on-surface-variant/50'}`}>{med.name}</span>
                  <span className="font-label text-[10px] text-on-surface-variant/40 ml-2">{med.currentDose}</span>
                </div>
              </div>
              <span className={`font-label text-[10px] uppercase tracking-wider ${taken ? 'text-primary/60' : 'text-on-surface-variant/30'}`}>
                {taken ? 'Taken' : '—'}
              </span>
            </button>
          )
        })}
      </div>
    </Section>
  )
}
