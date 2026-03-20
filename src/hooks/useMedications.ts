import { db } from '../db'
import { generateId, now } from '../utils/uuid'
import type { Medication, MedicationChange } from '../types'

export async function addMedication(name: string, dose: string): Promise<Medication> {
  const timestamp = now()
  const med: Medication = { id: generateId(), name, currentDose: dose, active: true, createdAt: timestamp, updatedAt: timestamp, syncedAt: null }
  await db.medications.add(med)
  return med
}

export async function updateMedicationDose(medicationId: string, newDose: string, date: string, note: string | null = null): Promise<Medication> {
  const med = await db.medications.get(medicationId)
  if (!med) throw new Error(`Medication ${medicationId} not found`)
  const timestamp = now()
  const change: MedicationChange = { id: generateId(), medicationId, date, previousDose: med.currentDose, newDose, note, createdAt: timestamp, updatedAt: timestamp, syncedAt: null }
  await db.medicationChanges.add(change)
  await db.medications.update(medicationId, { currentDose: newDose, updatedAt: timestamp })
  const updated = await db.medications.get(medicationId)
  return updated!
}

export async function deactivateMedication(id: string): Promise<void> {
  await db.medications.update(id, { active: false, updatedAt: now() })
}

export async function getActiveMedications(): Promise<Medication[]> {
  return db.medications.filter((m) => m.active).toArray()
}

export async function getAllMedications(): Promise<Medication[]> {
  return db.medications.toArray()
}

export async function getMedicationChanges(medicationId: string): Promise<MedicationChange[]> {
  return db.medicationChanges.where('medicationId').equals(medicationId).sortBy('date')
}
