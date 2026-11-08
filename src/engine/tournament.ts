import {
  leaderboard,
  pairwiseScores,
  type LeaderboardEntry,
  type MatchRecord,
  type PairwiseScore,
} from './metrics.ts'
import { playRound, type Player, type Round } from './playRound.ts'
import { matchSeed, seededRng } from './rng.ts'
import { strategies } from './strategies.ts'
import type { Rng, Strategy } from './types.ts'

export interface TournamentConfig {
  readonly strategyIds: readonly string[]
  /** Rounds per match, 1 to 1,000. */
  readonly rounds: number
  /** Unsigned 32-bit integer. The same config always gives the same report. */
  readonly seed: number
}

/** Results of a tournament. The round metrics land here in a later ticket. */
export interface TournamentReport {
  readonly leaderboard: readonly LeaderboardEntry[]
  readonly pairwise: readonly PairwiseScore[]
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
const MAX_SEED = 2 ** 32 - 1

function validate({ strategyIds, rounds, seed }: TournamentConfig): void {
  if (strategyIds.length === 0) throw new RangeError('Select at least one strategy.')
  for (const [i, id] of strategyIds.entries()) {
    if (!strategies.some((s) => s.id === id)) throw new RangeError(`Unknown strategy id: ${id}`)
    if (strategyIds.indexOf(id) !== i) throw new RangeError(`Duplicate strategy id: ${id}`)
  }
  if (!Number.isInteger(rounds) || rounds < 1 || rounds > MAX_ROUNDS) {
    throw new RangeError('Rounds must be a whole number from 1 to 1,000.')
  }
  if (!Number.isInteger(seed) || seed < 0 || seed > MAX_SEED) {
    throw new RangeError('Seed must be a whole number from 0 to 4,294,967,295.')
  }
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
  }
}
