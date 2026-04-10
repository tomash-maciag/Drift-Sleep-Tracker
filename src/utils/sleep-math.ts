import { sleepDurationMinutes } from './date'
import type { ComputedSleepMetrics } from '../types'

interface SleepTimes {
  bedtime: string
  sleepOnset: string
  wakeTime: string
  outOfBedTime: string
  awakeningDuration?: number | null
}

export function computeSleepMetrics(times: SleepTimes): ComputedSleepMetrics {
  const grossTst = sleepDurationMinutes(times.bedtime, times.wakeTime)
  const tst = grossTst - (times.awakeningDuration ?? 0)
  const tib = sleepDurationMinutes(times.bedtime, times.outOfBedTime)
  const sol = sleepDurationMinutes(times.bedtime, times.sleepOnset)
  const se = tib > 0 ? (tst / tib) * 100 : 0

  return { tst, tib, se, sol }
}
