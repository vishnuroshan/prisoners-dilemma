import { payoff } from './metrics.ts'
import { playRound, type Player, type Round } from './playRound.ts'
import { matchSeed, seededRng } from './rng.ts'
import { strategies } from './strategies.ts'
import {
  COOPERATE,
  DEFECT,
  strategyInfo,
  type Move,
  type StrategyInfo,
  type StrategyState,
} from './types.ts'
import { assertKnownStrategy, assertSeed } from './validation.ts'

/** A move as the UI sees it: Cooperate or Defect. */
export type MoveLetter = 'C' | 'D'

/** One played round of a human match: the Human's move and the opponent's. */
export interface HumanRound {
  readonly human: MoveLetter
  readonly opponent: MoveLetter
}

/** How to start a human match: the opponent and the seed. */
export interface HumanMatchOptions {
  /** The opponent's strategy id, or null for a Hidden opponent. */
  readonly opponentId: string | null
  /** Unsigned 32-bit integer. The same seed and moves always give the same match. */
  readonly seed: number
}

/**
 * A human match in progress. Plain serializable data. The match length and a Hidden
 * opponent's identity are derived from the stored `seed`, and `opponentState` is that
 * opponent's state, so the data does not keep them secret. The UI does not expose them
 * until the match ends.
 */
export interface HumanMatch extends HumanMatchOptions {
  readonly opponentState: StrategyState
  readonly rounds: readonly HumanRound[]
  readonly humanScore: number
  readonly opponentScore: number
  readonly over: boolean
  /** The opponent, or null while a Hidden opponent is still hidden. */
  readonly opponent: StrategyInfo | null
}

const MIN_ROUNDS = 10
const MAX_ROUNDS = 20

function validate({ opponentId, seed }: HumanMatchOptions): void {
  if (opponentId !== null) assertKnownStrategy(opponentId)
  assertSeed(seed)
}

/** The match's hidden draws: its length, then the Hidden opponent (used only when none is chosen). */
function secrets({ opponentId, seed }: HumanMatchOptions) {
  const rng = seededRng(seed)
  const length = MIN_ROUNDS + Math.floor(rng() * (MAX_ROUNDS - MIN_ROUNDS + 1))
  const hidden = strategies[Math.floor(rng() * strategies.length)]
  const opponent = opponentId === null ? hidden : strategies.find((s) => s.id === opponentId)!
  return { length, opponent }
}

const toMove = (letter: MoveLetter): Move => (letter === 'C' ? COOPERATE : DEFECT)
const toLetter = (move: Move): MoveLetter => (move === COOPERATE ? 'C' : 'D')

/** Starts a match against a chosen strategy or a Hidden opponent. Throws a RangeError on invalid options. */
export function startHumanMatch(options: HumanMatchOptions): HumanMatch {
  validate(options)
  const { opponent } = secrets(options)
  return {
    opponentId: options.opponentId,
    seed: options.seed,
    opponentState: opponent.initialState,
    rounds: [],
    humanScore: 0,
    opponentScore: 0,
    over: false,
    opponent: options.opponentId === null ? null : strategyInfo(opponent),
  }
}

/** Plays one round with the Human's move. Throws a RangeError if the match is over or the move is not C or D. */
export function playHumanMove(match: HumanMatch, letter: MoveLetter): HumanMatch {
  if (match.over) throw new RangeError('The match is over.')
  if (letter !== 'C' && letter !== 'D') throw new RangeError(`Unknown move: ${letter}`)
  const { length, opponent } = secrets(match)
  const human: Player = { decide: () => ({ move: toMove(letter), nextState: null }), state: null }
  const last = match.rounds.at(-1)
  const lastRound: Round | null = last ? { a: toMove(last.human), b: toMove(last.opponent) } : null
  // Each round gets its own derived RNG, so the match needs no RNG state to stay serializable.
  const rng = seededRng(matchSeed(match.seed, match.rounds.length))
  const result = playRound(
    human,
    { decide: opponent.decide, state: match.opponentState },
    lastRound,
    rng,
  )
  const rounds = [...match.rounds, { human: letter, opponent: toLetter(result.round.b) }]
  const over = rounds.length === length
  return {
    ...match,
    opponentState: result.b.state,
    rounds,
    humanScore: match.humanScore + payoff(result.round.a, result.round.b),
    opponentScore: match.opponentScore + payoff(result.round.b, result.round.a),
    over,
    opponent: over ? strategyInfo(opponent) : match.opponent,
  }
}
