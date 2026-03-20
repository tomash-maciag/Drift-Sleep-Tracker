import { describe, it, expect } from 'vitest'
import { computeSleepMetrics } from '../sleep-math'

describe('computeSleepMetrics', () => {
  it('calculates TST, TIB, SE, SOL for normal night', () => {
    const metrics = computeSleepMetrics({
      bedtime: '23:00',
      sleepOnset: '23:30',
      wakeTime: '06:00',
      outOfBedTime: '06:30',
    })
    expect(metrics.tst).toBe(390)
    expect(metrics.tib).toBe(450)
    expect(metrics.sol).toBe(30)
    expect(metrics.se).toBeCloseTo(86.67, 1)
  })

  it('handles short night', () => {
    const metrics = computeSleepMetrics({
      bedtime: '01:00',
      sleepOnset: '01:30',
      wakeTime: '04:00',
      outOfBedTime: '04:00',
    })
    expect(metrics.tst).toBe(150)
    expect(metrics.tib).toBe(180)
    expect(metrics.sol).toBe(30)
    expect(metrics.se).toBeCloseTo(83.33, 1)
  })

  it('handles sleep onset same as bedtime', () => {
    const metrics = computeSleepMetrics({
      bedtime: '23:00',
      sleepOnset: '23:00',
      wakeTime: '07:00',
      outOfBedTime: '07:00',
    })
    expect(metrics.tst).toBe(480)
    expect(metrics.tib).toBe(480)
    expect(metrics.sol).toBe(0)
    expect(metrics.se).toBe(100)
  })

  it('handles grogginess period', () => {
    const metrics = computeSleepMetrics({
      bedtime: '23:00',
      sleepOnset: '23:15',
      wakeTime: '05:00',
      outOfBedTime: '06:00',
    })
    expect(metrics.tst).toBe(345)
    expect(metrics.tib).toBe(420)
    expect(metrics.sol).toBe(15)
    expect(metrics.se).toBeCloseTo(82.14, 1)
  })
})
