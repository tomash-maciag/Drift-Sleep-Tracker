import { db } from '../db'
import { getCityCoordinates } from '../utils/cities'
import type { PhotoperiodEntry } from '../types'

export async function getCachedPhotoperiod(date: string): Promise<PhotoperiodEntry | null> {
  const entry = await db.photoperiodCache.get(date)
  return entry ?? null
}

export async function fetchAndCachePhotoperiod(date: string, cityName: string): Promise<PhotoperiodEntry | null> {
  const cached = await getCachedPhotoperiod(date)
  if (cached) return cached
  const coords = getCityCoordinates(cityName)
  if (!coords) return null
  try {
    const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${coords.lat}&lng=${coords.lng}&date=${date}&formatted=0`)
    const data = await response.json()
    if (data.status !== 'OK') return null
    const sunrise = new Date(data.results.sunrise)
    const sunset = new Date(data.results.sunset)
    const dayLengthMinutes = Math.round((sunset.getTime() - sunrise.getTime()) / 60000)
    const entry: PhotoperiodEntry = { date, sunrise: data.results.sunrise, sunset: data.results.sunset, dayLengthMinutes }
    await db.photoperiodCache.put(entry)
    return entry
  } catch {
    return null
  }
}

export async function getPhotoperiodRange(startDate: string, endDate: string): Promise<PhotoperiodEntry[]> {
  return db.photoperiodCache.where('date').between(startDate, endDate, true, true).sortBy('date')
}
