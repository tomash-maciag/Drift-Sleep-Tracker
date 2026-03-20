import { describe, it, expect, beforeEach } from 'vitest'
import 'fake-indexeddb/auto'
import { db } from '../../db'
import { getCityCoordinates } from '../../utils/cities'
import { getCachedPhotoperiod } from '../usePhotoperiod'

beforeEach(async () => {
  await db.delete()
  await db.open()
})

describe('getCityCoordinates', () => {
  it('returns coordinates for Warsaw', () => {
    const coords = getCityCoordinates('Warszawa')
    expect(coords).not.toBeNull()
    expect(coords!.lat).toBeCloseTo(52.23, 1)
    expect(coords!.lng).toBeCloseTo(21.01, 1)
  })
  it('returns null for unknown city', () => {
    expect(getCityCoordinates('Atlantis')).toBeNull()
  })
})

describe('photoperiod cache', () => {
  it('stores and retrieves cached entry', async () => {
    await db.photoperiodCache.put({ date: '2026-03-20', sunrise: '2026-03-20T05:30:00Z', sunset: '2026-03-20T17:45:00Z', dayLengthMinutes: 735 })
    const cached = await getCachedPhotoperiod('2026-03-20')
    expect(cached).not.toBeNull()
    expect(cached!.dayLengthMinutes).toBe(735)
  })
  it('returns null for uncached date', async () => {
    const cached = await getCachedPhotoperiod('2026-01-01')
    expect(cached).toBeNull()
  })
})
