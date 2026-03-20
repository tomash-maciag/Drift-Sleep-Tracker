import { db } from '../db'
import type { ExportData } from '../types'

export async function exportAllData(): Promise<ExportData> {
  const [sleepLogs, medications, medicationChanges, experiments, tags, settings] =
    await Promise.all([
      db.sleepLogs.toArray(),
      db.medications.toArray(),
      db.medicationChanges.toArray(),
      db.experiments.toArray(),
      db.tags.toArray(),
      db.settings.toArray(),
    ])
  return { version: '1.0', exportedAt: new Date().toISOString(), sleepLogs, medications, medicationChanges, experiments, tags, settings }
}

export async function importAllData(data: ExportData): Promise<void> {
  await db.transaction('rw', [db.sleepLogs, db.medications, db.medicationChanges, db.experiments, db.tags, db.settings], async () => {
    await db.sleepLogs.bulkPut(data.sleepLogs)
    await db.medications.bulkPut(data.medications)
    await db.medicationChanges.bulkPut(data.medicationChanges)
    await db.experiments.bulkPut(data.experiments)
    await db.tags.bulkPut(data.tags)
    await db.settings.bulkPut(data.settings)
  })
}

export function downloadJson(data: ExportData): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `drift-backup-${data.exportedAt.slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
