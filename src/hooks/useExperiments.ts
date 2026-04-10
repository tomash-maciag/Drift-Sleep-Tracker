import { db } from '../db'
import { generateId, now } from '../utils/uuid'
import { computeSleepMetrics } from '../utils/sleep-math'
import { timeToMinutes } from '../utils/date'
import type { Experiment, ExperimentComparison, ConditionStats, SleepLog } from '../types'

export async function createExperiment(name: string, conditionA: string, conditionB: string, startDate: string): Promise<Experiment> {
  const active = await getActiveExperiment()
  if (active) throw new Error('An active experiment already exists')
  const timestamp = now()
  const exp: Experiment = { id: generateId(), name, conditionA, conditionB, status: 'active', startDate, endDate: null, notes: null, createdAt: timestamp, updatedAt: timestamp, syncedAt: null }
  await db.experiments.add(exp)
  return exp
}

export async function getActiveExperiment(): Promise<Experiment | null> {
  const exp = await db.experiments.where('status').equals('active').first()
  return exp ?? null
}

export async function getArchivedExperiments(): Promise<Experiment[]> {
  return db.experiments.where('status').equals('archived').reverse().sortBy('endDate')
}

export async function archiveExperiment(id: string, endDate: string, notes: string | null = null): Promise<Experiment> {
  const timestamp = now()
  await db.experiments.update(id, { status: 'archived', endDate, notes, updatedAt: timestamp })
  const exp = await db.experiments.get(id)
  return exp!
}

export async function computeExperimentComparison(experimentId: string): Promise<ExperimentComparison> {
  const exp = await db.experiments.get(experimentId)
  if (!exp) throw new Error(`Experiment ${experimentId} not found`)
  const logsA = await db.sleepLogs.filter((l) => l.experimentCondition === 'A').toArray()
  const logsB = await db.sleepLogs.filter((l) => l.experimentCondition === 'B').toArray()
  return { conditionA: computeConditionStats(exp.conditionA, logsA), conditionB: computeConditionStats(exp.conditionB, logsB) }
}

function computeConditionStats(label: string, logs: SleepLog[]): ConditionStats {
  if (logs.length === 0) {
    return { label, dayCount: 0, avgWakeTime: 0, avgTst: 0, avgQuality: 0, minWakeTime: 0, maxWakeTime: 0, minTst: 0, maxTst: 0, minQuality: 0, maxQuality: 0 }
  }
  const wakeTimes = logs.map((l) => timeToMinutes(l.wakeTime))
  const tsts = logs.map((l) => computeSleepMetrics({ bedtime: l.bedtime, sleepOnset: l.sleepOnset, wakeTime: l.wakeTime, outOfBedTime: l.outOfBedTime, awakeningDuration: l.awakeningDuration }).tst)
  const qualities = logs.map((l) => l.sleepQuality)
  return {
    label, dayCount: logs.length,
    avgWakeTime: avg(wakeTimes), avgTst: avg(tsts), avgQuality: avg(qualities),
    minWakeTime: Math.min(...wakeTimes), maxWakeTime: Math.max(...wakeTimes),
    minTst: Math.min(...tsts), maxTst: Math.max(...tsts),
    minQuality: Math.min(...qualities), maxQuality: Math.max(...qualities),
  }
}

function avg(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length
}
