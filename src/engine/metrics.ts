import { COOPERATE, type Move, type Strategy } from './types.ts'

/** The full record of one match. `a` and `b` index the tournament's strategy list. */
export interface MatchRecord {
  readonly a: number
  readonly b: number
  readonly movesA: Uint8Array
  readonly movesB: Uint8Array
}

/** One strategy's total score across the tournament. */
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

/** One heatmap cell: a strategy's score in its match against one opponent. */
export interface PairwiseScore {
  readonly strategyId: string
  readonly opponentId: string
  /** The strategy's score in its match against the opponent. */
  readonly score: number
}

/** Every strategy's score against every opponent, itself included, in selection order. */
export function pairwiseScores(
  strategies: readonly Strategy[],
  matches: readonly MatchRecord[],
): PairwiseScore[] {
  const scores = strategies.map(() => strategies.map(() => 0))
  for (const match of matches) {
    const [scoreA, scoreB] = matchScores(match)
    scores[match.b][match.a] = scoreB
    // In a self-match, side A counts, the same rule as the leaderboard.
    scores[match.a][match.b] = scoreA
  }
  return strategies.flatMap(({ id }, a) =>
    strategies.map((opponent, b) => ({
      strategyId: id,
      opponentId: opponent.id,
      score: scores[a][b],
    })),
  )
}

/** Share of moves that were Cooperate in each round (index 0 is round 1), over both moves of every match, self-matches included. */
export function cooperationByRound(rounds: number, matches: readonly MatchRecord[]): number[] {
  const cooperations = new Array<number>(rounds).fill(0)
  for (const { movesA, movesB } of matches) {
    for (let i = 0; i < rounds; i++) {
      if (movesA[i] === COOPERATE) cooperations[i]++
      if (movesB[i] === COOPERATE) cooperations[i]++
    }
  }
  const moves = 2 * matches.length
  return cooperations.map((count) => count / moves)
}

/** Number of rounds that ended in each Outcome. */
export interface OutcomeDistribution {
  readonly mutualCooperation: number
  readonly mutualDefection: number
  readonly betrayal: number
}

/** Counts every round of every match once, self-matches included. */
export function outcomeDistribution(matches: readonly MatchRecord[]): OutcomeDistribution {
  let mutualCooperation = 0
  let mutualDefection = 0
  let betrayal = 0
  for (const { movesA, movesB } of matches) {
    for (let i = 0; i < movesA.length; i++) {
      if (movesA[i] !== movesB[i]) betrayal++
      else if (movesA[i] === COOPERATE) mutualCooperation++
      else mutualDefection++
    }
  }
  return { mutualCooperation, mutualDefection, betrayal }
}
