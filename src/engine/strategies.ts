import { forgivingTitForTat, joss, random } from './stochasticStrategies.ts'
import { COOPERATE, DEFECT, type Move, type Strategy } from './types.ts'

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

export const titForTat: Strategy<null> = {
  id: 'tit-for-tat',
  name: 'Tit for Tat',
  origin: "Submitted by Anatol Rapoport to Axelrod's 1980 tournament, which it won.",
  description: "Cooperates in the first round, then copies the opponent's previous move.",
  initialState: null,
  decide: (_, lastRound) => ({ move: lastRound ? lastRound.opponent : COOPERATE, nextState: null }),
}

export const grudger: Strategy<{ betrayed: boolean }> = {
  id: 'grudger',
  name: 'Grudger',
  origin: "Submitted to Axelrod's 1980 tournament as Friedman's entry. Also known as Grim Trigger.",
  description: 'Cooperates until the opponent defects once, then defects in every round after.',
  initialState: { betrayed: false },
  decide: ({ betrayed }, lastRound) => {
    const nowBetrayed = betrayed || lastRound?.opponent === DEFECT
    return { move: nowBetrayed ? DEFECT : COOPERATE, nextState: { betrayed: nowBetrayed } }
  },
}

/** `priorOpponentDefection`: whether the opponent defected in the round before `lastRound`. */
export const titForTwoTats: Strategy<{ priorOpponentDefection: boolean }> = {
  id: 'tit-for-two-tats',
  name: 'Tit for Two Tats',
  origin: "Submitted by John Maynard Smith to Axelrod's second tournament, where it placed 24th.",
  description:
    'Cooperates in the first round. Defects only after the opponent defects twice in a row.',
  initialState: { priorOpponentDefection: false },
  decide: ({ priorOpponentDefection }, lastRound) => {
    const opponentDefected = lastRound?.opponent === DEFECT
    return {
      move: priorOpponentDefection && opponentDefected ? DEFECT : COOPERATE,
      nextState: { priorOpponentDefection: opponentDefected },
    }
  },
}

export const pavlov: Strategy<null> = {
  id: 'pavlov',
  name: 'Pavlov',
  origin:
    'Win-Stay, Lose-Shift. Named Pavlov by Kraines and Kraines (1989) and studied by Nowak and Sigmund (1993).',
  description:
    'Cooperates in the first round. Repeats its last move after earning 3 or 5 points, and switches after earning 0 or 1.',
  initialState: null,
  // A win (3 or 5 points) is exactly a round in which the opponent cooperated.
  decide: (_, lastRound) => {
    if (!lastRound) return { move: COOPERATE, nextState: null }
    const won = lastRound.opponent === COOPERATE
    return {
      move: won ? lastRound.own : lastRound.own === COOPERATE ? DEFECT : COOPERATE,
      nextState: null,
    }
  },
}

const PROBE: readonly Move[] = [COOPERATE, DEFECT, COOPERATE, COOPERATE]

type ProberState =
  | { readonly verdict: null; readonly round: number; readonly opponentDefected: boolean }
  | { readonly verdict: 'tit-for-tat' }
  | { readonly verdict: 'always-defect' }

export const prober: Strategy<ProberState> = {
  id: 'prober',
  name: 'Prober',
  origin:
    "Nicky Case's Detective from The Evolution of Trust (2017), renamed. It was not an entry in Axelrod's 1980 tournament.",
  description:
    'Plays C, D, C, C. If the opponent defected in any of those four rounds, it plays Tit for Tat from then on; otherwise it defects in every round after.',
  initialState: { verdict: null, round: 0, opponentDefected: false },
  decide: (state, lastRound, rng) => {
    if (state.verdict === 'always-defect') return { move: DEFECT, nextState: state }
    if (state.verdict === 'tit-for-tat') {
      return { move: titForTat.decide(null, lastRound, rng).move, nextState: state }
    }
    const opponentDefected = state.opponentDefected || lastRound?.opponent === DEFECT
    if (state.round < PROBE.length) {
      const nextState = { verdict: null, round: state.round + 1, opponentDefected }
      return { move: PROBE[state.round], nextState }
    }
    return prober.decide(
      { verdict: opponentDefected ? 'tit-for-tat' : 'always-defect' },
      lastRound,
      rng,
    )
  },
}

/** Registry order is the canonical order: it fixes round-robin indexes and breaks score ties. */
export const strategies: readonly Strategy[] = [
  alwaysCooperate,
  alwaysDefect,
  titForTat,
  grudger,
  titForTwoTats,
  pavlov,
  prober,
  random,
  joss,
  forgivingTitForTat,
]
