// Every Nivo import lives in this module. It is loaded lazily (lazyCharts.ts), so the page
// renders without Nivo in the main bundle and the figures' tables do not wait for it.
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveHeatMap } from '@nivo/heatmap'
import { ResponsiveLine } from '@nivo/line'
import type {
  CooperationSerie,
  LeaderboardBar,
  OutcomeBar,
  OutcomeName,
  PairwiseRow,
} from './adapters.ts'
import {
  chartDefaults,
  COOPERATE_COLOR,
  DEFECT_COLOR,
  grey,
  HEATMAP_MARGIN,
  horizontalBarDefaults,
  INK,
  PAPER,
  topDown,
} from './theme.ts'

export function LeaderboardChart({ bars }: { bars: LeaderboardBar[] }) {
  return (
    <ResponsiveBar
      {...horizontalBarDefaults}
      // Rank 1 on top.
      data={topDown(bars)}
      keys={['score']}
      indexBy="strategy"
      colors={INK}
    />
  )
}

// The lowest score is light grey rather than paper, so it stays visible against the page.
const LOWEST_SHADE = 0.1

export function PairwiseChart({ rows }: { rows: PairwiseRow[] }) {
  const scores = rows.flatMap((row) => row.data.map((cell) => cell.y))
  const min = Math.min(...scores)
  const max = Math.max(...scores)
  const level = (score: number | null) => (max === min ? 1 : ((score ?? min) - min) / (max - min))
  return (
    <ResponsiveHeatMap
      {...chartDefaults}
      data={rows}
      margin={HEATMAP_MARGIN}
      axisTop={{ tickSize: 0, tickPadding: 6, tickRotation: -45 }}
      axisLeft={{ tickSize: 0, tickPadding: 6 }}
      colors={(cell) => grey(LOWEST_SHADE + (1 - LOWEST_SHADE) * level(cell.value))}
      labelTextColor={(cell) => (level(cell.value) > 0.5 ? PAPER : INK)}
    />
  )
}

const LINE_MARGIN = { top: 8, right: 16, bottom: 48, left: 56 }

export function CooperationChart({ series }: { series: CooperationSerie[] }) {
  return (
    <ResponsiveLine
      {...chartDefaults}
      data={series}
      margin={LINE_MARGIN}
      xScale={{ type: 'linear', min: 1, max: 'auto' }}
      yScale={{ type: 'linear', min: 0, max: 1 }}
      colors={COOPERATE_COLOR}
      lineWidth={2}
      enablePoints={false}
      enableGridX={false}
      axisBottom={{ legend: 'Round', legendOffset: 36, legendPosition: 'middle' }}
      axisLeft={{ format: '.0%' }}
      useMesh
    />
  )
}

// Betrayal mixes both moves, so it takes mid-grey from the neutral ramp (CLAUDE.md UI rules).
const OUTCOME_COLOURS: Record<OutcomeName, string> = {
  'Mutual Cooperation': COOPERATE_COLOR,
  'Mutual Defection': DEFECT_COLOR,
  Betrayal: grey(0.5),
}

export function OutcomeChart({ bars }: { bars: OutcomeBar[] }) {
  return (
    <ResponsiveBar
      {...horizontalBarDefaults}
      // Same order as the table, top to bottom.
      data={topDown(bars)}
      keys={['rounds']}
      indexBy="outcome"
      colors={({ indexValue }) => OUTCOME_COLOURS[indexValue as OutcomeName]}
    />
  )
}
