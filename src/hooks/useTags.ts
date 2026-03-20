import { db } from '../db'
import { generateId, now } from '../utils/uuid'
import type { Tag } from '../types'

export async function getAllTags(): Promise<Tag[]> {
  return db.tags.toArray()
}

export async function addTag(label: string): Promise<Tag> {
  const timestamp = now()
  const tag: Tag = { id: generateId(), label, isDefault: false, createdAt: timestamp, updatedAt: timestamp, syncedAt: null }
  await db.tags.add(tag)
  return tag
}

export async function removeTag(id: string): Promise<void> {
  await db.tags.delete(id)
}
