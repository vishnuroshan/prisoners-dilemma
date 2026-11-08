import type { TournamentReport } from '../engine'
import { pairwiseHeatmap } from './adapters.ts'
import { Figure } from './Figure.tsx'
import { PairwiseChart } from './lazyCharts.ts'

export function PairwiseFigure({ report }: { report: TournamentReport }) {
  const rows = pairwiseHeatmap(report)
  return (
    <Figure
      caption="Pairwise scores: row strategy against column strategy. Darker is higher."
      chart={<PairwiseChart rows={rows} />}
    >
      <table className="border-collapse">
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
