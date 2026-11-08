import type { TournamentReport } from '../engine'
import { leaderboardBars } from './adapters.ts'
import { Figure } from './Figure.tsx'
import { LeaderboardChart } from './lazyCharts.ts'
import { horizontalBarHeight } from './theme.ts'

const BAR_HEIGHT = 32

export function LeaderboardFigure({ report }: { report: TournamentReport }) {
  const bars = leaderboardBars(report)
  return (
    <Figure
      caption="Leaderboard: each strategy's total score across the tournament."
      height={horizontalBarHeight(bars.length, BAR_HEIGHT)}
      chart={<LeaderboardChart bars={bars} />}
    >
      <table className="mt-2 border-collapse font-mono">
        <thead>
          <tr className="border-b border-ink">
            <th className="pr-4 text-left">Rank</th>
            <th className="pr-4 text-left">Strategy</th>
            <th className="text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {report.leaderboard.map(({ strategyId, name, score }, _, entries) => (
            <tr key={strategyId}>
              {/* Tied scores share a rank (entries are sorted highest first). */}
              <td className="pr-4">{entries.findIndex((e) => e.score === score) + 1}</td>
              <td className="pr-4">{name}</td>
              <td className="text-right">{score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Figure>
  )
}
