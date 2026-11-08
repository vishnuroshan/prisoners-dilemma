import { COOPERATE, DEFECT, type Strategy } from './types.ts'

// Source for the Random and Joss origins: the Axelrod Python library's strategy index
// (axelrod.readthedocs.io/en/stable/reference/strategy_index.html), citing Axelrod (1980).

export const random: Strategy<null> = {
  id: 'random',
  name: 'Random',
  origin: "A baseline included in Axelrod's 1980 tournament.",
  description: 'Cooperates or defects with equal probability in every round.',
  initialState: null,
  decide: (_state, _lastRound, rng) => ({
    move: rng() < 0.5 ? COOPERATE : DEFECT,
    nextState: null,
  }),
}

export const joss: Strategy<null> = {
  id: 'joss',
  name: 'Joss',
  origin: "Submitted to Axelrod's 1980 tournament by Johann Joss.",
  description:
    'Plays Tit for Tat, but when Tit for Tat would cooperate it defects with 10% probability. Always defects after the opponent defects.',
  initialState: null,
  decide: (_state, lastRound, rng) => ({
    move: lastRound?.opponent === DEFECT || rng() < 0.1 ? DEFECT : COOPERATE,
    nextState: null,
  }),
}

export const forgivingTitForTat: Strategy<null> = {
  id: 'forgiving-tit-for-tat',
  name: 'Forgiving Tit for Tat',
  // TODO: verify the primary source. The Axelrod library cites Nowak (1993) for Generous Tit for Tat.
  origin:
    "A form of Generous Tit for Tat, studied in research after Axelrod's tournaments. It was not an entry in Axelrod's 1980 tournament.",
  description:
    'Plays Tit for Tat, but after the opponent defects it cooperates with 5% probability, which can break cycles of retaliation.',
  initialState: null,
  decide: (_state, lastRound, rng) => ({
    move: lastRound?.opponent === DEFECT && rng() >= 0.05 ? DEFECT : COOPERATE,
    nextState: null,
  }),
}
