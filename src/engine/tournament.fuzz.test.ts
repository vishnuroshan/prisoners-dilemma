import fc from 'fast-check'
import { expect, test } from 'vitest'
import { listStrategies, runTournament } from './index.ts'

const strategyIds = listStrategies().map(({ id }) => id)

const validConfig = fc.record({
  strategyIds: fc.shuffledSubarray(strategyIds, { minLength: 1 }),
  rounds: fc.integer({ min: 1, max: 1000 }),
  seed: fc.integer({ min: 0, max: 2 ** 32 - 1 }),
})

test('runTournament completes any valid config with a well-formed report', () => {
  fc.assert(
    fc.property(validConfig, (config) => {
      const report = runTournament(config)
      const selected = config.strategyIds.length
      const matches = (selected * (selected + 1)) / 2

      expect(report.leaderboard).toHaveLength(selected)
      expect(report.pairwise).toHaveLength(selected * selected)
      expect(report.cooperationByRound).toHaveLength(config.rounds)
      for (const rate of report.cooperationByRound) {
        expect(rate).toBeGreaterThanOrEqual(0)
        expect(rate).toBeLessThanOrEqual(1)
      }
      const { mutualCooperation, mutualDefection, betrayal } = report.outcomes
      expect(mutualCooperation + mutualDefection + betrayal).toBe(matches * config.rounds)
    }),
    // Each run plays up to 55 matches of 1,000 rounds; 50 runs keeps CI fast.
    { numRuns: 50 },
  )
})
