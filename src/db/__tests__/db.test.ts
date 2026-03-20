import { describe, it, expect, beforeEach } from 'vitest'
import 'fake-indexeddb/auto'
import { db } from '../index'
import { seedDefaults } from '../seed'

beforeEach(async () => {
  await db.delete()
  await db.open()
})

describe('database schema', () => {
  it('has all required tables', () => {
    expect(db.tables.map((t) => t.name).sort()).toEqual([
      'experiments',
      'medicationChanges',
      'medications',
      'photoperiodCache',
      'settings',
      'sleepLogs',
      'tags',
    ])
  })
})

describe('seedDefaults', () => {
  it('creates default tags', async () => {
    await seedDefaults()
    const tags = await db.tags.toArray()
    expect(tags.length).toBe(7)
    expect(tags.map((t) => t.label).sort()).toEqual([
      'alcohol',
      'exercise',
      'illness',
      'late coffee',
      'stomach discomfort',
      'stress',
      'travel',
    ])
    expect(tags.every((t) => t.isDefault)).toBe(true)
  })

  it('does not duplicate tags on second run', async () => {
    await seedDefaults()
    await seedDefaults()
    const tags = await db.tags.toArray()
    expect(tags.length).toBe(7)
  })
})
