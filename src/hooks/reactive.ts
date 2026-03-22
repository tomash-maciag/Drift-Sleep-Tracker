import { useLiveQuery } from 'dexie-react-hooks'
import { getSleepLogsInRange, getSleepLogByDate } from './useSleepLogs'
import { computeKPI } from './useKPI'
import { getAllTags } from './useTags'
import { getActiveMedications, getAllMedications } from './useMedications'
import { getActiveExperiment } from './useExperiments'
import { getSetting } from './useSettings'
import type { SleepLog, KPI, Tag, Medication, Experiment } from '../types'

export function useSleepLogsLive(startDate: string, endDate: string): SleepLog[] {
  return useLiveQuery(() => getSleepLogsInRange(startDate, endDate), [startDate, endDate], [])
}

export function useTodayLog(date: string): SleepLog | null | undefined {
  return useLiveQuery(() => getSleepLogByDate(date), [date])
}

export function useKPILive(date: string, days: number): KPI | undefined {
  return useLiveQuery(() => computeKPI(date, days), [date, days])
}

export function useTagsLive(): Tag[] {
  return useLiveQuery(() => getAllTags(), [], [])
}

export function useActiveMedsLive(): Medication[] {
  return useLiveQuery(() => getActiveMedications(), [], [])
}

export function useAllMedsLive(): Medication[] {
  return useLiveQuery(() => getAllMedications(), [], [])
}

export function useActiveExperimentLive(): Experiment | null | undefined {
  return useLiveQuery(() => getActiveExperiment(), [])
}

export function useSettingLive<T>(key: string, defaultValue: T): T | null {
  return useLiveQuery(() => getSetting<T>(key), [key], defaultValue)
}
