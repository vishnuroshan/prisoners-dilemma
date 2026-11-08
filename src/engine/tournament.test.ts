import { describe, expect, test } from 'vitest'
import { listStrategies, runTournament } from './index.ts'

const ALLC = 'always-cooperate'
const ALLD = 'always-defect'

function scores(strategyIds: string[], rounds: number) {
  const { leaderboard } = runTournament({ strategyIds, rounds, seed: 1 })
  return Object.fromEntries(leaderboard.map((entry) => [entry.strategyId, entry.score]))
}

/** A's score in its match against B: the tournament total minus A's self-match. */
function matchScore(a: string, b: string, rounds: number) {
  return scores([a, b], rounds)[a] - scores([a], rounds)[a]
}

describe('payoffs', () => {
  test('Mutual Cooperation pays Reward (3)', () => {
    expect(scores([ALLC], 1)[ALLC]).toBe(3)
  })

  test('Mutual Defection pays Punishment (1)', () => {
    expect(scores([ALLD], 1)[ALLD]).toBe(1)
  })

  test('Betrayal pays the defector Temptation (5)', () => {
    expect(matchScore(ALLD, ALLC, 1)).toBe(5)
  })

  test("Betrayal pays the cooperator the Sucker's payoff (0)", () => {
    expect(matchScore(ALLC, ALLD, 1)).toBe(0)
  })
})

describe('runTournament', () => {
  test('a 200-round Always Cooperate vs Always Defect match scores 0 vs 1000', () => {
    expect(matchScore(ALLC, ALLD, 200)).toBe(0)
    expect(matchScore(ALLD, ALLC, 200)).toBe(1000)
  })

  test('a self-match counts one side only', () => {
    expect(scores([ALLC], 200)[ALLC]).toBe(600)
  })

  test('the leaderboard ranks by total score, highest first', () => {
    const { leaderboard } = runTournament({ strategyIds: [ALLC, ALLD], rounds: 200, seed: 1 })
    expect(leaderboard).toEqual([
      { strategyId: ALLD, name: 'Always Defect', score: 1200 },
      { strategyId: ALLC, name: 'Always Cooperate', score: 600 },
    ])
  })

  test("pairwise scores give each strategy's score against each opponent, itself included", () => {
    const { pairwise } = runTournament({ strategyIds: [ALLC, ALLD], rounds: 200, seed: 1 })
    expect(pairwise).toEqual([
      { strategyId: ALLC, opponentId: ALLC, score: 600 },
      { strategyId: ALLC, opponentId: ALLD, score: 0 },
      { strategyId: ALLD, opponentId: ALLC, score: 1000 },
      { strategyId: ALLD, opponentId: ALLD, score: 200 },
    ])
  })

  test('the same config gives an identical report', () => {
    const config = { strategyIds: [ALLC, ALLD], rounds: 137, seed: 4_294_967_295 }
    expect(runTournament(config)).toEqual(runTournament({ ...config }))
  })

  test('the order of the selected strategy ids does not change the report', () => {
    expect(runTournament({ strategyIds: [ALLD, ALLC], rounds: 50, seed: 9 })).toEqual(
      runTournament({ strategyIds: [ALLC, ALLD], rounds: 50, seed: 9 }),
    )
  })
})

describe('runTournament rejects an invalid config with a RangeError', () => {
  const valid = { strategyIds: [ALLC, ALLD], rounds: 200, seed: 1 }

  test.each([
    ['empty selection', { strategyIds: [] }],
    ['unknown strategy id', { strategyIds: [ALLC, 'tit-for-tat-typo'] }],
    ['duplicate strategy id', { strategyIds: [ALLC, ALLC] }],
    ['0 rounds', { rounds: 0 }],
    ['1,001 rounds', { rounds: 1001 }],
    ['fractional rounds', { rounds: 2.5 }],
    ['NaN rounds', { rounds: Number.NaN }],
    ['negative seed', { seed: -1 }],
    ['seed above 2^32 - 1', { seed: 2 ** 32 }],
    ['fractional seed', { seed: 0.5 }],
  ])('%s', (_, override) => {
    expect(() => runTournament({ ...valid, ...override })).toThrow(RangeError)
  })

  test.each([1, 1000])('accepts %i rounds', (rounds) => {
    expect(() => runTournament({ ...valid, rounds })).not.toThrow()
  })
})

describe('deterministic strategies in a tournament', () => {
  test('Tit for Tat loses only the first round to Always Defect over 200 rounds', () => {
    expect(matchScore('tit-for-tat', ALLD, 200)).toBe(199)
    expect(matchScore(ALLD, 'tit-for-tat', 200)).toBe(204)
  })

  test('Prober exploits Always Cooperate after its probe', () => {
    expect(matchScore('prober', ALLC, 200)).toBe(3 + 5 + 3 + 3 + 196 * 5)
  })

  test('Grudger, Tit for Two Tats, and Pavlov cooperate throughout with Tit for Tat', () => {
    for (const id of ['grudger', 'tit-for-two-tats', 'pavlov']) {
      expect(matchScore(id, 'tit-for-tat', 200)).toBe(600)
    }
  })
})

describe('listStrategies', () => {
  test('lists every strategy as metadata only', () => {
    for (const info of listStrategies()) {
      expect(Object.keys(info).sort()).toEqual(['description', 'id', 'name', 'origin'])
    }
  })

  test('lists every strategy in registry order', () => {
    expect(listStrategies().map(({ id }) => id)).toEqual([
      ALLC,
      ALLD,
      'tit-for-tat',
      'grudger',
      'tit-for-two-tats',
      'pavlov',
      'prober',
      'random',
      'joss',
      'forgiving-tit-for-tat',
    ])
  })
})

describe('stochastic strategies', () => {
  const config = {
    strategyIds: [ALLC, ALLD, 'random', 'joss', 'forgiving-tit-for-tat'],
    rounds: 200,
    seed: 7,
  }

  test('the same seed gives an identical report', () => {
    expect(runTournament(config)).toEqual(runTournament({ ...config }))
  })

  test('a different seed changes the report', () => {
    expect(runTournament({ ...config, seed: 8 })).not.toEqual(runTournament(config))
  })
})
