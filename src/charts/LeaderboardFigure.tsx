import type { TournamentReport } from '../engine'
import { leaderboardBars } from './adapters.ts'
import { Figure } from './Figure.tsx'
import { LeaderboardChart } from './lazyCharts.ts'

export function LeaderboardFigure({ report }: { report: TournamentReport }) {
  const bars = leaderboardBars(report)
  return (
    <Figure
      caption="Leaderboard: each strategy’s total score."
      chart={<LeaderboardChart bars={bars} />}
    >
      <table className="border-collapse">
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
