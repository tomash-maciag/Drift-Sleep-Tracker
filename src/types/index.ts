export interface SleepLog {
  id: string
  date: string // YYYY-MM-DD, unique
  bedtime: string // HH:MM
  sleepOnset: string // HH:MM
  wakeTime: string // HH:MM
  outOfBedTime: string // HH:MM
  alarmWake: boolean
  sleepQuality: number // 1-10
  grogginess: number // 0-10
  wakeUpMinutes: number // 0-90
  awakenings: number // 0-5
  lightTherapyStart: string | null
  lightTherapyEnd: string | null
  lightTherapyIntensity: string | null
  tags: string[]
  note: string | null
  experimentCondition: string | null
  weeklyStress: number | null
  weeklyActivity: string | null
  weeklyInflammation: string[] | null
  weeklyRating: number | null
  createdAt: string
  updatedAt: string
  syncedAt: string | null
}

export interface ComputedSleepMetrics {
  tst: number
  tib: number
  se: number
  sol: number
}

export interface SleepLogWithMetrics extends SleepLog {
  metrics: ComputedSleepMetrics
}

export interface Medication {
  id: string
  name: string
  currentDose: string
  active: boolean
  createdAt: string
  updatedAt: string
  syncedAt: string | null
}

export interface MedicationChange {
  id: string
  medicationId: string
  date: string
  previousDose: string
  newDose: string
  note: string | null
  createdAt: string
  updatedAt: string
  syncedAt: string | null
}

export interface Experiment {
  id: string
  name: string
  conditionA: string
  conditionB: string
  status: 'active' | 'archived'
  startDate: string
  endDate: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  syncedAt: string | null
}

export interface ExperimentComparison {
  conditionA: ConditionStats
  conditionB: ConditionStats
}

export interface ConditionStats {
  label: string
  dayCount: number
  avgWakeTime: number
  avgTst: number
  avgQuality: number
  minWakeTime: number
  maxWakeTime: number
  minTst: number
  maxTst: number
  minQuality: number
  maxQuality: number
}

export interface Tag {
  id: string
  label: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
  syncedAt: string | null
}

export interface AppSetting {
  key: string
  value: string
  updatedAt: string
}

export type SettingKey =
  | 'notificationTime'
  | 'sleepWindowStart'
  | 'sleepWindowEnd'
  | 'sleepBarRangeStart'
  | 'sleepBarRangeEnd'
  | 'city'
  | 'enabledExtendedFields'
  | 'lightTherapyDefaultStart'
  | 'lightTherapyDefaultEnd'
  | 'installedAt'

export interface PhotoperiodEntry {
  date: string
  sunrise: string
  sunset: string
  dayLengthMinutes: number
}

export interface KPI {
  avgTst: number | null
  avgWakeTime: number | null
  avgSe: number | null
  trend: 'up' | 'down' | 'stable' | null
}

export interface Insight {
  id: string
  type: string
  message: string
  severity: 'info' | 'warning'
}

export interface CityCoordinates {
  name: string
  lat: number
  lng: number
}

export interface ExportData {
  version: string
  exportedAt: string
  sleepLogs: SleepLog[]
  medications: Medication[]
  medicationChanges: MedicationChange[]
  experiments: Experiment[]
  tags: Tag[]
  settings: AppSetting[]
}
