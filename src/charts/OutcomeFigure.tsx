import type { TournamentReport } from '../engine'
import { outcomeBars } from './adapters.ts'
import { Figure } from './Figure.tsx'
import { OutcomeChart } from './lazyCharts.ts'
import { horizontalBarHeight } from './theme.ts'

const BAR_HEIGHT = 40

export function OutcomeFigure({ report }: { report: TournamentReport }) {
  const bars = outcomeBars(report)
  const total = bars.reduce((sum, { rounds }) => sum + rounds, 0)
  return (
    <Figure
      caption="Outcome distribution: how many rounds, across every match, ended in Mutual Cooperation, Mutual Defection, or Betrayal."
      height={horizontalBarHeight(bars.length, BAR_HEIGHT)}
      chart={<OutcomeChart bars={bars} />}
    >
      <table className="mt-2 border-collapse font-mono">
        <thead>
          <tr className="border-b border-ink">
            <th className="pr-4 text-left">Outcome</th>
            <th className="pr-4 text-right">Rounds</th>
            <th className="text-right">Share</th>
          </tr>
        </thead>
        <tbody>
          {bars.map(({ outcome, rounds }) => (
            <tr key={outcome}>
              <td className="pr-4">{outcome}</td>
              <td className="pr-4 text-right">{rounds}</td>
              <td className="text-right">{((rounds / total) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Figure>
  )
}
