import { forgivingTitForTat, joss, random } from './stochasticStrategies.ts'
import { COOPERATE, DEFECT, type Strategy } from './types.ts'

const NOT_IN_AXELROD_1980 = "A baseline. It was not an entry in Axelrod's 1980 tournament."

export const alwaysCooperate: Strategy<null> = {
  id: 'always-cooperate',
  name: 'Always Cooperate',
  origin: NOT_IN_AXELROD_1980,
  description: 'Cooperates in every round.',
  initialState: null,
  decide: () => ({ move: COOPERATE, nextState: null }),
}

export const alwaysDefect: Strategy<null> = {
  id: 'always-defect',
  name: 'Always Defect',
  origin: NOT_IN_AXELROD_1980,
  description: 'Defects in every round.',
  initialState: null,
  decide: () => ({ move: DEFECT, nextState: null }),
}

/** Registry order is the canonical order: it fixes round-robin indexes and breaks score ties. */
export const strategies: readonly Strategy[] = [
  alwaysCooperate,
  alwaysDefect,
  random,
  joss,
  forgivingTitForTat,
]
