import type { TournamentReport } from '../engine'
import { cooperationLine } from './adapters.ts'
import { Figure } from './Figure.tsx'
import { CooperationChart } from './lazyCharts.ts'

// Four decimal places: the table carries the exact numbers, which a 0.1% rounding would blur.
function decimal(rate: number): string {
  return rate.toFixed(4)
}

export function CooperationFigure({ report }: { report: TournamentReport }) {
  const series = cooperationLine(report)
  return (
    <Figure
      caption="Cooperation rate by round: share of Cooperate moves across all matches."
      chart={<CooperationChart series={series} />}
    >
      <table className="border-collapse">
        <thead>
          <tr className="border-b border-ink">
            <th className="pr-4 text-right">Round</th>
            <th className="text-right">Cooperation rate</th>
          </tr>
        </thead>
        <tbody>
          {series[0].data.map(({ x, y }) => (
            <tr key={x}>
              <td className="pr-4 text-right">{x}</td>
              <td className="text-right">{decimal(y)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Figure>
  )
}
