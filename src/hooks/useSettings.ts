import { db } from '../db'
import { now } from '../utils/uuid'

export async function getSetting<T = unknown>(key: string): Promise<T | null> {
  const entry = await db.settings.get(key)
  if (!entry) return null
  return JSON.parse(entry.value) as T
}

export async function setSetting<T = unknown>(key: string, value: T): Promise<void> {
  await db.settings.put({ key, value: JSON.stringify(value), updatedAt: now() })
}

export async function getAllSettings(): Promise<Record<string, unknown>> {
  const entries = await db.settings.toArray()
  const result: Record<string, unknown> = {}
  for (const entry of entries) {
    result[entry.key] = JSON.parse(entry.value)
  }
  return result
}
