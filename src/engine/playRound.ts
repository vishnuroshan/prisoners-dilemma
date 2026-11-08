import type { Move, Rng, Strategy, StrategyState } from './types.ts'

/**
 * One side of a match. A strategy plays through its reducer; the human (PD-1.3) can
 * play as a player whose `decide` returns the move they chose.
 */
export interface Player {
  readonly decide: Strategy['decide']
  readonly state: StrategyState
}

export interface Round {
  readonly a: Move
  readonly b: Move
}

/** Plays one round: each player decides from its own view of the previous round. */
export function playRound(a: Player, b: Player, lastRound: Round | null, rng: Rng) {
  const decisionA = a.decide(a.state, lastRound && { own: lastRound.a, opponent: lastRound.b }, rng)
  const decisionB = b.decide(b.state, lastRound && { own: lastRound.b, opponent: lastRound.a }, rng)
  return {
    round: { a: decisionA.move, b: decisionB.move } satisfies Round,
    a: { decide: a.decide, state: decisionA.nextState } satisfies Player,
    b: { decide: b.decide, state: decisionB.nextState } satisfies Player,
  }
}
