import type { Move, Strategy } from './types.ts'

/** The full record of one match. `a` and `b` index the tournament's strategy list. */
export interface MatchRecord {
  readonly a: number
  readonly b: number
  readonly movesA: Uint8Array
  readonly movesB: Uint8Array
}

export interface LeaderboardEntry {
  readonly strategyId: string
  readonly name: string
  readonly score: number
}

// PAYOFF[own][opponent]: Reward 3, Sucker's payoff 0, Temptation 5, Punishment 1.
const PAYOFF = [
  [3, 0],
  [5, 1],
] as const

export function payoff(own: Move, opponent: Move): number {
  return PAYOFF[own][opponent]
}

function matchScores({ movesA, movesB }: MatchRecord): [number, number] {
  let scoreA = 0
  let scoreB = 0
  for (let i = 0; i < movesA.length; i++) {
    scoreA += payoff(movesA[i] as Move, movesB[i] as Move)
    scoreB += payoff(movesB[i] as Move, movesA[i] as Move)
  }
  return [scoreA, scoreB]
}

/** Total score per strategy, highest first. In a self-match only one side counts. */
export function leaderboard(
  strategies: readonly Strategy[],
  matches: readonly MatchRecord[],
): LeaderboardEntry[] {
  const totals = strategies.map(() => 0)
  for (const match of matches) {
    const [scoreA, scoreB] = matchScores(match)
    totals[match.a] += scoreA
    if (match.a !== match.b) totals[match.b] += scoreB
  }
  return strategies
    .map(({ id, name }, i) => ({ strategyId: id, name, score: totals[i] }))
    .sort((x, y) => y.score - x.score)
}
