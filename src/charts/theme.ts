import type { PartialTheme } from '@nivo/theming'

// Nivo needs literal colour values for SVG attributes and tooltips, so the neutral tokens
// in src/index.css (--color-paper, --color-ink) are mirrored here as grey levels.
const PAPER_LEVEL = 0xf9
const INK_LEVEL = 0x1a
const MONO = 'ui-monospace, monospace'

/** A grey on the single neutral ramp: 0 is paper, 1 is ink. For chart data that is not a move. */
export function grey(t: number): string {
  const hex = Math.round(PAPER_LEVEL + (INK_LEVEL - PAPER_LEVEL) * t)
    .toString(16)
    .padStart(2, '0')
  return `#${hex}${hex}${hex}`
}

export const PAPER = grey(0)
export const INK = grey(1)

// Mirrors --color-cooperate and --color-defect in src/index.css. Only for data that encodes a move.
export const COOPERATE_COLOR = '#2f5d8a'
export const DEFECT_COLOR = '#b3501b'

const theme: PartialTheme = {
  background: 'transparent',
  text: { fontFamily: MONO, fontSize: 12, fill: INK },
  axis: {
    domain: { line: { stroke: INK, strokeWidth: 1 } },
    ticks: { line: { stroke: INK, strokeWidth: 1 } },
  },
  grid: { line: { stroke: grey(0.15), strokeWidth: 1 } },
  // Nivo's default tooltip has a drop shadow and rounded corners, both banned by the UI rules.
  tooltip: {
    container: {
      background: PAPER,
      color: INK,
      fontFamily: MONO,
      fontSize: 12,
      border: `1px solid ${INK}`,
      borderRadius: 0,
      boxShadow: 'none',
    },
  },
}

/** Props every chart spreads: project tokens and no animation (CLAUDE.md UI rules). */
export const chartDefaults = { theme, animate: false } as const

// The left margin fits the longest strategy or Outcome name.
const HORIZONTAL_BAR_MARGIN = { top: 8, right: 16, bottom: 32, left: 176 }

/** Props the horizontal bar charts spread: one value per row, labelled inside the bar. */
export const horizontalBarDefaults = {
  ...chartDefaults,
  layout: 'horizontal',
  margin: HORIZONTAL_BAR_MARGIN,
  padding: 0.3,
  labelTextColor: PAPER,
  labelSkipWidth: 40,
  enableGridX: true,
  enableGridY: false,
} as const

/** Height in px of a horizontal bar chart with `bars` bars of `barHeight` px each. */
export function horizontalBarHeight(bars: number, barHeight: number): number {
  return bars * barHeight + HORIZONTAL_BAR_MARGIN.top + HORIZONTAL_BAR_MARGIN.bottom
}

// The top margin fits the rotated column labels; the left margin fits the row labels.
export const HEATMAP_MARGIN = { top: 120, right: 16, bottom: 8, left: 176 }

/** Height in px of a heatmap with `rows` rows of `rowHeight` px each. */
export function heatmapHeight(rows: number, rowHeight: number): number {
  return rows * rowHeight + HEATMAP_MARGIN.top + HEATMAP_MARGIN.bottom
}

/** A horizontal Nivo bar chart draws the first datum at the bottom; this puts it on top. */
export function topDown<T>(data: readonly T[]): T[] {
  return data.toReversed()
}
