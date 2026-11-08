import type { TournamentReport } from '../engine'
import { pairwiseHeatmap } from './adapters.ts'
import { Figure } from './Figure.tsx'
import { PairwiseChart } from './lazyCharts.ts'
import { heatmapHeight } from './theme.ts'

const CELL_HEIGHT = 40

export function PairwiseFigure({ report }: { report: TournamentReport }) {
  const rows = pairwiseHeatmap(report)
  return (
    <Figure
      caption="Pairwise scores: each cell is the row strategy's score against the column strategy, self-matches included. Darker is higher."
      height={heatmapHeight(rows.length, CELL_HEIGHT)}
      chart={<PairwiseChart rows={rows} />}
    >
      <table className="mt-2 border-collapse font-mono">
        <thead>
          <tr className="border-b border-ink">
            <td />
            {rows.map(({ id }) => (
              <th key={id} scope="col" className="pr-4 text-right">
                {id}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ id, data }) => (
            <tr key={id}>
              <th scope="row" className="pr-4 text-left font-normal">
                {id}
              </th>
              {data.map(({ x, y }) => (
                <td key={x} className="pr-4 text-right">
                  {y}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Figure>
  )
}
