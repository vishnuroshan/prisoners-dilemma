export const COOPERATE = 0
export const DEFECT = 1

/** 0 = Cooperate, 1 = Defect, matching the `Uint8Array` match records. */
export type Move = typeof COOPERATE | typeof DEFECT

/** The previous round from the deciding player's point of view. */
export interface LastRound {
  readonly own: Move
  readonly opponent: Move
}

/** Returns a float in [0, 1). The only randomness a strategy may use. */
export type Rng = () => number

/** Plain serializable data, so match state can be stored, replayed, or sent to a worker. */
export type StrategyState =
  | null
  | boolean
  | number
  | string
  | readonly StrategyState[]
  | { readonly [key: string]: StrategyState }

export interface Decision<S extends StrategyState = StrategyState> {
  readonly move: Move
  readonly nextState: S
}

/**
 * A strategy is plain data with a pure reducer (ADR 0001). It sees only the match
 * history, never the match length or the opponent's identity.
 */
export interface Strategy<S extends StrategyState = StrategyState> {
  readonly id: string
  readonly name: string
  readonly origin: string
  readonly description: string
  readonly initialState: S
  decide(state: S, lastRound: LastRound | null, rng: Rng): Decision<S>
}

/** A strategy's metadata for display: everything but its reducer and initial state. */
export type StrategyInfo = Pick<Strategy, 'id' | 'name' | 'origin' | 'description'>

export function strategyInfo({ id, name, origin, description }: Strategy): StrategyInfo {
  return { id, name, origin, description }
}
