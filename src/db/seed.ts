import { db } from './index'
import { generateId, now } from '../utils/uuid'

const DEFAULT_TAGS = [
  'stress',
  'alcohol',
  'illness',
  'travel',
  'late coffee',
  'exercise',
  'stomach discomfort',
]

export async function seedDefaults(): Promise<void> {
  const existingTags = await db.tags.count()
  if (existingTags > 0) return

  const timestamp = now()
  const tags = DEFAULT_TAGS.map((label) => ({
    id: generateId(),
    label,
    isDefault: true,
    createdAt: timestamp,
    updatedAt: timestamp,
    syncedAt: null,
  }))

  await db.tags.bulkAdd(tags)
}
