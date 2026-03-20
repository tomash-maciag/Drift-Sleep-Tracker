import { describe, it, expect, beforeEach } from 'vitest'
import 'fake-indexeddb/auto'
import { db } from '../../db'
import { getSetting, setSetting, getAllSettings } from '../useSettings'

beforeEach(async () => {
  await db.delete()
  await db.open()
})

describe('setSetting / getSetting', () => {
  it('stores and retrieves a string setting', async () => {
    await setSetting('notificationTime', '07:30')
    const val = await getSetting('notificationTime')
    expect(val).toBe('07:30')
  })
  it('stores and retrieves an object setting', async () => {
    await setSetting('enabledExtendedFields', { lightTherapy: true, awakenings: false })
    const val = await getSetting('enabledExtendedFields')
    expect(val).toEqual({ lightTherapy: true, awakenings: false })
  })
  it('overwrites existing setting', async () => {
    await setSetting('notificationTime', '07:30')
    await setSetting('notificationTime', '08:00')
    const val = await getSetting('notificationTime')
    expect(val).toBe('08:00')
  })
  it('returns null for missing setting', async () => {
    const val = await getSetting('notificationTime')
    expect(val).toBeNull()
  })
})

describe('getAllSettings', () => {
  it('returns all stored settings as key-value map', async () => {
    await setSetting('notificationTime', '07:30')
    await setSetting('city', 'Warsaw')
    const all = await getAllSettings()
    expect(all.notificationTime).toBe('07:30')
    expect(all.city).toBe('Warsaw')
  })
})
