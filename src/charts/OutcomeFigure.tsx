import { ResponsiveBar } from '@nivo/bar'
import type { TournamentReport } from '../engine'
import { outcomeBars, type OutcomeName } from './adapters.ts'
import { Figure } from './Figure.tsx'
import { chartDefaults, COOPERATE, DEFECT, grey, PAPER } from './theme.ts'

const BAR_HEIGHT = 40
const MARGIN = { top: 8, right: 16, bottom: 32, left: 176 }
// Betrayal mixes both moves, so it takes mid-grey from the neutral ramp (CLAUDE.md UI rules).
const COLOURS: Record<OutcomeName, string> = {
  'Mutual Cooperation': COOPERATE,
  'Mutual Defection': DEFECT,
  Betrayal: grey(0.5),
}

export function OutcomeFigure({ report }: { report: TournamentReport }) {
  const bars = outcomeBars(report)
  const total = bars.reduce((sum, { rounds }) => sum + rounds, 0)
  return (
    <Figure
      caption="Outcome distribution: how many rounds, across every match, ended in Mutual Cooperation, Mutual Defection, or Betrayal."
      height={bars.length * BAR_HEIGHT + MARGIN.top + MARGIN.bottom}
      chart={
        <ResponsiveBar
          {...chartDefaults}
          // A horizontal Nivo bar chart draws the first datum at the bottom; keep table order top to bottom.
          data={bars.toReversed()}
          keys={['rounds']}
          indexBy="outcome"
          layout="horizontal"
          margin={MARGIN}
          padding={0.3}
          colors={({ indexValue }) => COLOURS[indexValue as OutcomeName]}
          labelTextColor={PAPER}
          labelSkipWidth={40}
          enableGridX
          enableGridY={false}
        />
      }
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
