import { describe, expect, test } from 'vitest'
import type { TournamentReport } from '../engine'
import { leaderboardBars, pairwiseHeatmap } from './adapters.ts'

// Pairwise entries are in selection order; the leaderboard is in rank order.
const report: TournamentReport = {
  leaderboard: [
    { strategyId: 'b', name: 'Bravo', score: 9 },
    { strategyId: 'c', name: 'Charlie', score: 7 },
    { strategyId: 'a', name: 'Alpha', score: 4 },
  ],
  pairwise: [
    { strategyId: 'a', opponentId: 'a', score: 1 },
    { strategyId: 'a', opponentId: 'b', score: 2 },
    { strategyId: 'a', opponentId: 'c', score: 3 },
    { strategyId: 'b', opponentId: 'a', score: 4 },
    { strategyId: 'b', opponentId: 'b', score: 5 },
    { strategyId: 'b', opponentId: 'c', score: 6 },
    { strategyId: 'c', opponentId: 'a', score: 7 },
    { strategyId: 'c', opponentId: 'b', score: 8 },
    { strategyId: 'c', opponentId: 'c', score: 9 },
  ],
}

describe('leaderboardBars', () => {
  test('gives one bar per strategy in rank order', () => {
    expect(leaderboardBars(report)).toEqual([
      { strategy: 'Bravo', score: 9 },
      { strategy: 'Charlie', score: 7 },
      { strategy: 'Alpha', score: 4 },
    ])
  })
})

describe('pairwiseHeatmap', () => {
  test("cell (A, B) is A's score against B, with rows and columns in rank order", () => {
    expect(pairwiseHeatmap(report)).toEqual([
      {
        id: 'Bravo',
        data: [
          { x: 'Bravo', y: 5 },
          { x: 'Charlie', y: 6 },
          { x: 'Alpha', y: 4 },
        ],
      },
      {
        id: 'Charlie',
        data: [
          { x: 'Bravo', y: 8 },
          { x: 'Charlie', y: 9 },
          { x: 'Alpha', y: 7 },
        ],
      },
      {
        id: 'Alpha',
        data: [
          { x: 'Bravo', y: 2 },
          { x: 'Charlie', y: 3 },
          { x: 'Alpha', y: 1 },
        ],
      },
    ])
  })
})
