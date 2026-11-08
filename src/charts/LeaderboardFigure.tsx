import { ResponsiveBar } from '@nivo/bar'
import type { TournamentReport } from '../engine'
import { leaderboardBars } from './adapters.ts'
import { Figure } from './Figure.tsx'
import { chartDefaults, INK, PAPER } from './theme.ts'

const BAR_HEIGHT = 32
const MARGIN = { top: 8, right: 16, bottom: 32, left: 176 }

export function LeaderboardFigure({ report }: { report: TournamentReport }) {
  const bars = leaderboardBars(report)
  return (
    <Figure
      caption="Leaderboard: each strategy's total score across the tournament."
      height={bars.length * BAR_HEIGHT + MARGIN.top + MARGIN.bottom}
      chart={
        <ResponsiveBar
          {...chartDefaults}
          // A horizontal Nivo bar chart draws the first datum at the bottom; rank 1 belongs on top.
          data={bars.toReversed()}
          keys={['score']}
          indexBy="strategy"
          layout="horizontal"
          margin={MARGIN}
          padding={0.3}
          colors={INK}
          labelTextColor={PAPER}
          labelSkipWidth={40}
          enableGridX
          enableGridY={false}
        />
      }
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
