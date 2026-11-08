import {
  cooperationByRound,
  leaderboard,
  outcomeDistribution,
  pairwiseScores,
  type LeaderboardEntry,
  type MatchRecord,
  type OutcomeDistribution,
  type PairwiseScore,
} from './metrics.ts'
import { playRound, type Player, type Round } from './playRound.ts'
import { matchSeed, seededRng } from './rng.ts'
import { strategies } from './strategies.ts'
import type { Rng, Strategy } from './types.ts'
import { assertKnownStrategy, assertSeed } from './validation.ts'

/** What to play: which strategies, how many rounds per match, and the seed. */
export interface TournamentConfig {
  /** Ids from `listStrategies()`, each at most once, at least one. Order does not change the report. */
  readonly strategyIds: readonly string[]
  /** Rounds per match, 1 to 1,000. */
  readonly rounds: number
  /** Unsigned 32-bit integer. The same config always gives the same report. */
  readonly seed: number
}

/** Results of a tournament. */
export interface TournamentReport {
  readonly leaderboard: readonly LeaderboardEntry[]
  readonly pairwise: readonly PairwiseScore[]
  /** Share of moves that were Cooperate in each round, from 0 to 1. Index 0 is round 1. */
  readonly cooperationByRound: readonly number[]
  readonly outcomes: OutcomeDistribution
}

function playMatch(a: Strategy, b: Strategy, rounds: number, rng: Rng) {
  const movesA = new Uint8Array(rounds)
  const movesB = new Uint8Array(rounds)
  let playerA: Player = { decide: a.decide, state: a.initialState }
  let playerB: Player = { decide: b.decide, state: b.initialState }
  let lastRound: Round | null = null
  for (let i = 0; i < rounds; i++) {
    const result = playRound(playerA, playerB, lastRound, rng)
    playerA = result.a
    playerB = result.b
    lastRound = result.round
    movesA[i] = result.round.a
    movesB[i] = result.round.b
  }
  return { movesA, movesB }
}

const MAX_ROUNDS = 1000

function validate({ strategyIds, rounds, seed }: TournamentConfig): void {
  if (strategyIds.length === 0) throw new RangeError('Select at least one strategy.')
  for (const [i, id] of strategyIds.entries()) {
    assertKnownStrategy(id)
    if (strategyIds.indexOf(id) !== i) throw new RangeError(`Duplicate strategy id: ${id}`)
  }
  if (!Number.isInteger(rounds) || rounds < 1 || rounds > MAX_ROUNDS) {
    throw new RangeError('Rounds must be a whole number from 1 to 1,000.')
  }
  assertSeed(seed)
}

/** Plays every selected strategy against every other one and itself. Throws a RangeError on an invalid config. */
export function runTournament(config: TournamentConfig): TournamentReport {
  validate(config)
  const selected = strategies.filter(({ id }) => config.strategyIds.includes(id))
  const matches: MatchRecord[] = []
  for (let a = 0; a < selected.length; a++) {
    for (let b = a; b < selected.length; b++) {
      const rng = seededRng(matchSeed(config.seed, matches.length))
      matches.push({ a, b, ...playMatch(selected[a], selected[b], config.rounds, rng) })
    }
  }
  return {
    leaderboard: leaderboard(selected, matches),
    pairwise: pairwiseScores(selected, matches),
    cooperationByRound: cooperationByRound(config.rounds, matches),
    outcomes: outcomeDistribution(matches),
  }
}
