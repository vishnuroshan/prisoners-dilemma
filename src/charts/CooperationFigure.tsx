import { ResponsiveLine } from '@nivo/line'
import type { TournamentReport } from '../engine'
import { cooperationLine } from './adapters.ts'
import { Figure } from './Figure.tsx'
import { chartDefaults, COOPERATE } from './theme.ts'

const MARGIN = { top: 8, right: 16, bottom: 48, left: 56 }

function percent(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`
}

export function CooperationFigure({ report }: { report: TournamentReport }) {
  const series = cooperationLine(report)
  return (
    <Figure
      caption="Cooperation rate by round: the share of all moves in that round that were Cooperate, across every match, self-matches included."
      height={320}
      chart={
        <ResponsiveLine
          {...chartDefaults}
          data={series}
          margin={MARGIN}
          xScale={{ type: 'linear', min: 1, max: 'auto' }}
          yScale={{ type: 'linear', min: 0, max: 1 }}
          colors={COOPERATE}
          lineWidth={2}
          enablePoints={false}
          enableGridX={false}
          axisBottom={{ legend: 'Round', legendOffset: 36, legendPosition: 'middle' }}
          axisLeft={{ format: '.0%' }}
          useMesh
        />
      }
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
                <td className="text-right">{percent(y)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </Figure>
  )
}
