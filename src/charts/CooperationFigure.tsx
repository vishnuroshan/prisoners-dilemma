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
      caption="Cooperation rate by round: the share of all moves in that round that were Cooperate, across every match, self-matches included."
      height={320}
      chart={<CooperationChart series={series} />}
    >
      {/* Up to 1,000 rows, so the exact numbers sit behind a native disclosure. */}
      <details className="mt-2">
        <summary>Cooperation rate for each round</summary>
        <table className="mt-2 border-collapse font-mono">
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
      </details>
    </Figure>
  )
}
