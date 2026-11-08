import { describe, expect, test } from 'vitest'
import { fixedSequenceRng } from './fixedSequenceRng.ts'
import { forgivingTitForTat, joss, random } from './stochasticStrategies.ts'
import { COOPERATE, DEFECT, type LastRound } from './types.ts'

/** Where Tit for Tat would cooperate: the opening, and after an opponent cooperation. */
const titForTatCooperates: (LastRound | null)[] = [
  null,
  { own: COOPERATE, opponent: COOPERATE },
  { own: DEFECT, opponent: COOPERATE },
]

const opponentDefected: LastRound[] = [
  { own: COOPERATE, opponent: DEFECT },
  { own: DEFECT, opponent: DEFECT },
]

describe('Random', () => {
  test.each([...titForTatCooperates, ...opponentDefected])(
    'after %o, a draw below 0.5 cooperates, otherwise defects',
    (lastRound) => {
      const decide = (draw: number) =>
        random.decide(random.initialState, lastRound, fixedSequenceRng([draw])).move
      expect([0, 0.4999, 0.5, 0.9999].map(decide)).toEqual([COOPERATE, COOPERATE, DEFECT, DEFECT])
    },
  )
})

describe('Joss', () => {
  test.each(titForTatCooperates)(
    'after %o, a draw below 0.1 defects, otherwise cooperates',
    (lastRound) => {
      const decide = (draw: number) =>
        joss.decide(joss.initialState, lastRound, fixedSequenceRng([draw])).move
      expect([0, 0.0999, 0.1, 0.9999].map(decide)).toEqual([DEFECT, DEFECT, COOPERATE, COOPERATE])
    },
  )

  test.each(opponentDefected)('after %o, defects without drawing', (lastRound) => {
    expect(joss.decide(joss.initialState, lastRound, fixedSequenceRng([])).move).toBe(DEFECT)
  })
})

describe('Forgiving Tit for Tat', () => {
  test.each(titForTatCooperates)('after %o, cooperates without drawing', (lastRound) => {
    const { move } = forgivingTitForTat.decide(
      forgivingTitForTat.initialState,
      lastRound,
      fixedSequenceRng([]),
    )
    expect(move).toBe(COOPERATE)
  })

  test.each(opponentDefected)(
    'after %o, a draw below 0.05 cooperates, otherwise defects',
    (lastRound) => {
      const decide = (draw: number) =>
        forgivingTitForTat.decide(
          forgivingTitForTat.initialState,
          lastRound,
          fixedSequenceRng([draw]),
        ).move
      expect([0, 0.0499, 0.05, 0.9999].map(decide)).toEqual([COOPERATE, COOPERATE, DEFECT, DEFECT])
    },
  )
})
