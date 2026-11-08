import type { TournamentReport } from '../engine'
import { outcomeBars } from './adapters.ts'
import { Figure } from './Figure.tsx'
import { OutcomeChart } from './lazyCharts.ts'

export function OutcomeFigure({ report }: { report: TournamentReport }) {
  const bars = outcomeBars(report)
  const total = bars.reduce((sum, { rounds }) => sum + rounds, 0)
  return (
    <Figure
      caption="Outcome distribution: rounds ending in each Outcome."
      chart={<OutcomeChart bars={bars} />}
    >
      <table className="border-collapse">
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
