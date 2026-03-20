import { describe, it, expect, beforeEach } from 'vitest'
import 'fake-indexeddb/auto'
import { db } from '../../db'
import { seedDefaults } from '../../db/seed'
import { getAllTags, addTag, removeTag } from '../useTags'

beforeEach(async () => {
  await db.delete()
  await db.open()
  await seedDefaults()
})

describe('getAllTags', () => {
  it('returns all seeded tags', async () => {
    const tags = await getAllTags()
    expect(tags.length).toBe(7)
  })
})

describe('addTag', () => {
  it('creates a custom (non-default) tag', async () => {
    const tag = await addTag('migraine')
    expect(tag.label).toBe('migraine')
    expect(tag.isDefault).toBe(false)
    const all = await getAllTags()
    expect(all.length).toBe(8)
  })
})

describe('removeTag', () => {
  it('deletes a tag by id', async () => {
    const tag = await addTag('migraine')
    await removeTag(tag.id)
    const all = await getAllTags()
    expect(all.length).toBe(7)
  })
})
