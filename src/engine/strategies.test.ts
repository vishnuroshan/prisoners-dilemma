import { describe, expect, test } from 'vitest'
import {
  alwaysCooperate,
  alwaysDefect,
  grudger,
  pavlov,
  prober,
  titForTat,
  titForTwoTats,
} from './strategies.ts'
import {
  COOPERATE,
  DEFECT,
  type Decision,
  type LastRound,
  type Move,
  type Rng,
  type Strategy,
} from './types.ts'

// Deterministic strategies must not draw randomness.
const noRandomness: Rng = () => {
  throw new Error('deterministic strategy drew from the rng')
}

/** Threads state through the reducer against a fixed sequence of opponent moves. */
function playAgainst(strategy: Strategy, opponentMoves: Move[]): Decision[] {
  let state = strategy.initialState
  let lastRound: LastRound | null = null
  const decisions: Decision[] = []
  for (const opponent of opponentMoves) {
    const decision = strategy.decide(state, lastRound, noRandomness)
    decisions.push(decision)
    state = decision.nextState
    lastRound = { own: decision.move, opponent }
  }
  return decisions
}

const movesAgainst = (strategy: Strategy, opponentMoves: Move[]) =>
  playAgainst(strategy, opponentMoves).map(({ move }) => move)

const C = COOPERATE
const D = DEFECT

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

describe('Tit for Tat', () => {
  test('opens with Cooperate', () => {
    expect(titForTat.decide(titForTat.initialState, null, noRandomness).move).toBe(COOPERATE)
  })

  test.each([
    [{ own: COOPERATE, opponent: COOPERATE }, COOPERATE],
    [{ own: COOPERATE, opponent: DEFECT }, DEFECT],
    [{ own: DEFECT, opponent: COOPERATE }, COOPERATE],
    [{ own: DEFECT, opponent: DEFECT }, DEFECT],
  ] as const)("after %o plays %i, the opponent's last move", (lastRound, expected) => {
    expect(titForTat.decide(titForTat.initialState, lastRound, noRandomness).move).toBe(expected)
  })
})

describe('Grudger', () => {
  test('opens with Cooperate', () => {
    expect(grudger.decide(grudger.initialState, null, noRandomness).move).toBe(COOPERATE)
  })

  test('keeps cooperating while the opponent cooperates', () => {
    const decision = grudger.decide(
      { betrayed: false },
      { own: COOPERATE, opponent: COOPERATE },
      noRandomness,
    )
    expect(decision).toEqual({ move: COOPERATE, nextState: { betrayed: false } })
  })

  test('defects after the first opponent defection and remembers it', () => {
    const decision = grudger.decide(
      { betrayed: false },
      { own: COOPERATE, opponent: DEFECT },
      noRandomness,
    )
    expect(decision).toEqual({ move: DEFECT, nextState: { betrayed: true } })
  })

  test('keeps defecting once betrayed, even after the opponent cooperates', () => {
    const decision = grudger.decide(
      { betrayed: true },
      { own: DEFECT, opponent: COOPERATE },
      noRandomness,
    )
    expect(decision).toEqual({ move: DEFECT, nextState: { betrayed: true } })
  })
})

describe('Tit for Two Tats', () => {
  test('opens with Cooperate', () => {
    expect(titForTwoTats.decide(titForTwoTats.initialState, null, noRandomness).move).toBe(
      COOPERATE,
    )
  })

  test('forgives a single opponent defection and remembers it', () => {
    const decision = titForTwoTats.decide(
      { priorOpponentDefection: false },
      { own: COOPERATE, opponent: DEFECT },
      noRandomness,
    )
    expect(decision).toEqual({ move: COOPERATE, nextState: { priorOpponentDefection: true } })
  })

  test('defects after two opponent defections in a row', () => {
    const decision = titForTwoTats.decide(
      { priorOpponentDefection: true },
      { own: COOPERATE, opponent: DEFECT },
      noRandomness,
    )
    expect(decision).toEqual({ move: DEFECT, nextState: { priorOpponentDefection: true } })
  })

  test('cooperates once the opponent cooperates again', () => {
    const decision = titForTwoTats.decide(
      { priorOpponentDefection: true },
      { own: DEFECT, opponent: COOPERATE },
      noRandomness,
    )
    expect(decision).toEqual({ move: COOPERATE, nextState: { priorOpponentDefection: false } })
  })
})

describe('Pavlov', () => {
  test('opens with Cooperate', () => {
    expect(pavlov.decide(pavlov.initialState, null, noRandomness).move).toBe(COOPERATE)
  })

  test.each([
    ['Reward (3): stays with Cooperate', { own: COOPERATE, opponent: COOPERATE }, COOPERATE],
    ['Temptation (5): stays with Defect', { own: DEFECT, opponent: COOPERATE }, DEFECT],
    ["Sucker's payoff (0): shifts to Defect", { own: COOPERATE, opponent: DEFECT }, DEFECT],
    ['Punishment (1): shifts to Cooperate', { own: DEFECT, opponent: DEFECT }, COOPERATE],
  ] as const)('after %s', (_, lastRound, expected) => {
    expect(pavlov.decide(pavlov.initialState, lastRound, noRandomness).move).toBe(expected)
  })
})

describe('Prober', () => {
  test('probes with C, D, C, C, then always defects if the opponent never defected', () => {
    expect(movesAgainst(prober, [C, C, C, C, C, C, C, C])).toEqual([C, D, C, C, D, D, D, D])
  })

  test('becomes Tit for Tat if the opponent defected during the probe', () => {
    expect(movesAgainst(prober, [C, D, C, C, D, C, C])).toEqual([C, D, C, C, C, D, C])
  })

  test("counts an opponent defection in round 4, seen only when choosing round 5's move", () => {
    expect(movesAgainst(prober, [C, C, C, D, C, C])).toEqual([C, D, C, C, D, C])
  })

  test('keeps always defecting after its verdict, even if the opponent defects later', () => {
    expect(movesAgainst(prober, [C, C, C, C, D, C, C])).toEqual([C, D, C, C, D, D, D])
  })
})

describe.each([titForTat, grudger, titForTwoTats, pavlov, prober])('$name', (strategy) => {
  test('keeps plain serializable state', () => {
    for (const { nextState } of playAgainst(strategy, [C, D, D, C, D, C, C, D, C, C])) {
      expect(JSON.parse(JSON.stringify(nextState))).toStrictEqual(nextState)
    }
  })
})
