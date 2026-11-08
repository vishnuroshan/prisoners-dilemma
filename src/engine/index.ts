import { strategies } from './strategies.ts'
import { strategyInfo, type StrategyInfo } from './types.ts'

export {
  playHumanMove,
  startHumanMatch,
  type HumanMatch,
  type HumanMatchOptions,
  type HumanRound,
  type MoveLetter,
} from './humanMatch.ts'
export type { LeaderboardEntry, OutcomeDistribution, PairwiseScore } from './metrics.ts'
export { runTournament, type TournamentConfig, type TournamentReport } from './tournament.ts'
export type { StrategyInfo } from './types.ts'

/** Every available strategy's metadata, without its reducer. */
export function listStrategies(): StrategyInfo[] {
  return strategies.map(strategyInfo)
}
