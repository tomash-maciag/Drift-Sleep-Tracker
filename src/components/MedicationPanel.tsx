import { useState } from 'react'
import { useActiveMedsLive } from '../hooks/reactive'
import { addMedication, updateMedicationDose } from '../hooks/useMedications'
import { todayDate } from '../utils/date'
import { Section } from './Section'

export function MedicationPanel() {
  const meds = useActiveMedsLive()
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDose, setNewDose] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDose, setEditDose] = useState('')

  const handleAdd = async () => {
    const name = newName.trim()
    const dose = newDose.trim()
    if (!name || !dose) return
    await addMedication(name, dose)
    setNewName('')
    setNewDose('')
    setShowAdd(false)
  }

  const handleDoseChange = async (medId: string) => {
    const dose = editDose.trim()
    if (!dose) return
    await updateMedicationDose(medId, dose, todayDate())
    setEditingId(null)
    setEditDose('')
  }

  return (
    <Section>
      <div className="flex items-center justify-between mb-4">
        <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Medications</span>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="font-label text-[10px] uppercase tracking-[0.1em] text-primary"
        >
          + Add
        </button>
      </div>

      <div className="space-y-3">
        {meds.map((med) => (
          <div key={med.id} className="flex items-center justify-between bg-surface-container-low rounded-lg p-3">
            {editingId === med.id ? (
              <div className="flex items-center gap-2 w-full">
                <span className="font-body text-sm text-tertiary">{med.name}</span>
                <input
                  type="text"
                  value={editDose}
                  onChange={(e) => setEditDose(e.target.value)}
                  placeholder={med.currentDose}
                  className="flex-1 bg-surface-container rounded-lg px-2 py-1 font-body text-sm text-tertiary border-none outline-none"
                  autoFocus
                />
                <button
                  onClick={() => handleDoseChange(med.id)}
                  className="font-label text-[10px] text-primary"
                >
                  Save
                </button>
                <button
                  onClick={() => { setEditingId(null); setEditDose('') }}
                  className="font-label text-[10px] text-on-surface-variant"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div>
                  <span className="font-body text-sm text-tertiary">{med.name}</span>
                  <span className="font-label text-[10px] text-on-surface-variant ml-2">{med.currentDose}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-label text-[10px] text-on-surface-variant">No change</span>
                  <button
                    onClick={() => { setEditingId(med.id); setEditDose(med.currentDose) }}
                    className="font-label text-[10px] text-primary"
                  >
                    Edit
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {meds.length === 0 && !showAdd && (
          <p className="font-body text-sm text-on-surface-variant/50">No active medications</p>
        )}

        {showAdd && (
          <div className="bg-surface-container-low rounded-lg p-3 space-y-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Medication name"
              className="w-full bg-surface-container rounded-lg px-3 py-2 font-body text-sm text-tertiary placeholder:text-on-surface-variant/30 border-none outline-none"
              autoFocus
            />
            <input
              type="text"
              value={newDose}
              onChange={(e) => setNewDose(e.target.value)}
              placeholder="Dose (e.g. 50mg)"
              className="w-full bg-surface-container rounded-lg px-3 py-2 font-body text-sm text-tertiary placeholder:text-on-surface-variant/30 border-none outline-none"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setShowAdd(false); setNewName(''); setNewDose('') }}
                className="font-label text-[10px] uppercase tracking-[0.1em] text-on-surface-variant px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="font-label text-[10px] uppercase tracking-[0.1em] text-primary px-3 py-1.5"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </Section>
  )
}
