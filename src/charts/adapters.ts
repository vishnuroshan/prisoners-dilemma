import type { TournamentReport } from '../engine'

// ADR 0001: the engine never knows Nivo. These pure functions turn a TournamentReport into Nivo data shapes.

/** A `@nivo/bar` datum, indexed by `strategy` with the key `score`. */
export type LeaderboardBar = { strategy: string; score: number }

/** A `@nivo/heatmap` serie: one row, where `x` is the column and `y` the cell value. */
export type PairwiseRow = { id: string; data: { x: string; y: number }[] }

/** One bar per strategy, in rank order. */
export function leaderboardBars({ leaderboard }: TournamentReport): LeaderboardBar[] {
  return leaderboard.map(({ name, score }) => ({ strategy: name, score }))
}

/** One row per strategy; cell (A, B) is A's score against B. Rows and columns follow rank order. */
export function pairwiseHeatmap({ leaderboard, pairwise }: TournamentReport): PairwiseRow[] {
  const scores = new Map(pairwise.map((p) => [`${p.strategyId} ${p.opponentId}`, p.score]))
  function score(strategyId: string, opponentId: string): number {
    const value = scores.get(`${strategyId} ${opponentId}`)
    if (value === undefined) throw new Error(`No pairwise score for ${strategyId} vs ${opponentId}`)
    return value
  }
  return leaderboard.map((row) => ({
    id: row.name,
    data: leaderboard.map((column) => ({
      x: column.name,
      y: score(row.strategyId, column.strategyId),
    })),
  }))
}
