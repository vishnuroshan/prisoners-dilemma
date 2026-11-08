import { describe, expect, test } from 'vitest'
import { alwaysCooperate, alwaysDefect } from './strategies.ts'
import { COOPERATE, DEFECT, type LastRound, type Rng } from './types.ts'

// Deterministic strategies must not draw randomness.
const noRandomness: Rng = () => {
  throw new Error('deterministic strategy drew from the rng')
}

const lastRounds: (LastRound | null)[] = [
  null,
  { own: COOPERATE, opponent: COOPERATE },
  { own: COOPERATE, opponent: DEFECT },
  { own: DEFECT, opponent: COOPERATE },
  { own: DEFECT, opponent: DEFECT },
]

describe('Always Cooperate', () => {
  test.each(lastRounds)('cooperates after %o', (lastRound) => {
    const { move } = alwaysCooperate.decide(alwaysCooperate.initialState, lastRound, noRandomness)
    expect(move).toBe(COOPERATE)
  })
})

describe('Always Defect', () => {
  test.each(lastRounds)('defects after %o', (lastRound) => {
    const { move } = alwaysDefect.decide(alwaysDefect.initialState, lastRound, noRandomness)
    expect(move).toBe(DEFECT)
  })
})
