import { strategies } from './strategies.ts'
import type { StrategyInfo } from './types.ts'

export type { LeaderboardEntry } from './metrics.ts'
export { runTournament, type TournamentConfig, type TournamentReport } from './tournament.ts'
export type { StrategyInfo } from './types.ts'

/** Every available strategy's metadata, without its reducer. */
export function listStrategies(): StrategyInfo[] {
  return strategies.map(({ id, name, origin, description }) => ({ id, name, origin, description }))
}
