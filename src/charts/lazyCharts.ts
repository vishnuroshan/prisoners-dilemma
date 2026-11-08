import { lazy } from 'react'

// Nivo is most of the JavaScript, and charts appear only after a tournament runs. All four
// charts share one dynamic import, so Nivo loads once, when the first results render.
const nivoCharts = () => import('./NivoCharts.tsx')

export const LeaderboardChart = lazy(() =>
  nivoCharts().then((m) => ({ default: m.LeaderboardChart })),
)
export const PairwiseChart = lazy(() => nivoCharts().then((m) => ({ default: m.PairwiseChart })))
export const CooperationChart = lazy(() =>
  nivoCharts().then((m) => ({ default: m.CooperationChart })),
)
export const OutcomeChart = lazy(() => nivoCharts().then((m) => ({ default: m.OutcomeChart })))
