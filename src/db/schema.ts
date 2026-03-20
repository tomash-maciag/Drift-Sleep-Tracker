import Dexie from 'dexie'
import type {
  SleepLog,
  Medication,
  MedicationChange,
  Experiment,
  Tag,
  AppSetting,
  PhotoperiodEntry,
} from '../types'

export class DriftDatabase extends Dexie {
  sleepLogs!: Dexie.Table<SleepLog, string>
  medications!: Dexie.Table<Medication, string>
  medicationChanges!: Dexie.Table<MedicationChange, string>
  experiments!: Dexie.Table<Experiment, string>
  tags!: Dexie.Table<Tag, string>
  settings!: Dexie.Table<AppSetting, string>
  photoperiodCache!: Dexie.Table<PhotoperiodEntry, string>

  constructor() {
    super('drift')

    this.version(1).stores({
      sleepLogs: 'id, &date, createdAt',
      medications: 'id, createdAt',
      medicationChanges: 'id, medicationId, date, createdAt',
      experiments: 'id, status, createdAt',
      tags: 'id, label, createdAt',
      settings: 'key',
      photoperiodCache: 'date',
    })
  }
}
