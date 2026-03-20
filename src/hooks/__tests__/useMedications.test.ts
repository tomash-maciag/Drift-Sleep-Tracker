import { describe, it, expect, beforeEach } from 'vitest'
import 'fake-indexeddb/auto'
import { db } from '../../db'
import { addMedication, updateMedicationDose, deactivateMedication, getActiveMedications, getMedicationChanges } from '../useMedications'

beforeEach(async () => {
  await db.delete()
  await db.open()
})

describe('addMedication', () => {
  it('creates a new active medication', async () => {
    const med = await addMedication('Trazodon', '50mg')
    expect(med.name).toBe('Trazodon')
    expect(med.currentDose).toBe('50mg')
    expect(med.active).toBe(true)
  })
})

describe('updateMedicationDose', () => {
  it('changes dose and creates a change record', async () => {
    const med = await addMedication('Trazodon', '50mg')
    const updated = await updateMedicationDose(med.id, '75mg', '2026-03-20', 'lekarz zalecił')
    expect(updated.currentDose).toBe('75mg')
    const changes = await getMedicationChanges(med.id)
    expect(changes.length).toBe(1)
    expect(changes[0].previousDose).toBe('50mg')
    expect(changes[0].newDose).toBe('75mg')
    expect(changes[0].note).toBe('lekarz zalecił')
  })
})

describe('deactivateMedication', () => {
  it('sets active to false', async () => {
    const med = await addMedication('Trazodon', '50mg')
    await deactivateMedication(med.id)
    const meds = await getActiveMedications()
    expect(meds.length).toBe(0)
  })
})

describe('getActiveMedications', () => {
  it('returns only active medications', async () => {
    const med1 = await addMedication('Trazodon', '50mg')
    await addMedication('Melatonina', '3mg')
    await deactivateMedication(med1.id)
    const active = await getActiveMedications()
    expect(active.length).toBe(1)
    expect(active[0].name).toBe('Melatonina')
  })
})
