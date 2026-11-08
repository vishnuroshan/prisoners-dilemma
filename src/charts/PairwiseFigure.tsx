import { ResponsiveHeatMap } from '@nivo/heatmap'
import type { TournamentReport } from '../engine'
import { pairwiseHeatmap } from './adapters.ts'
import { Figure } from './Figure.tsx'
import { chartDefaults, grey, INK, PAPER } from './theme.ts'

const CELL_HEIGHT = 40
const MARGIN = { top: 120, right: 16, bottom: 8, left: 176 }
// The lowest score is light grey rather than paper, so it stays visible against the page.
const LOWEST_SHADE = 0.1

export function PairwiseFigure({ report }: { report: TournamentReport }) {
  const rows = pairwiseHeatmap(report)
  const scores = rows.flatMap((row) => row.data.map((cell) => cell.y))
  const min = Math.min(...scores)
  const max = Math.max(...scores)
  const level = (score: number | null) => (max === min ? 1 : ((score ?? min) - min) / (max - min))

  return (
    <Figure
      caption="Pairwise scores: each cell is the row strategy's score against the column strategy, self-matches included. Darker is higher."
      height={rows.length * CELL_HEIGHT + MARGIN.top + MARGIN.bottom}
      chart={
        <ResponsiveHeatMap
          {...chartDefaults}
          data={rows}
          margin={MARGIN}
          axisTop={{ tickSize: 0, tickPadding: 6, tickRotation: -45 }}
          axisLeft={{ tickSize: 0, tickPadding: 6 }}
          colors={(cell) => grey(LOWEST_SHADE + (1 - LOWEST_SHADE) * level(cell.value))}
          labelTextColor={(cell) => (level(cell.value) > 0.5 ? PAPER : INK)}
        />
      }
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
