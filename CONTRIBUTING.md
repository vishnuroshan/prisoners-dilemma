# Contributing

Thanks for your interest. This guide covers how to propose a change, the checks a pull request must pass, and how to add a strategy.

## Before you start

- To propose a feature or report a bug, open a GitHub issue so the change can be discussed before you write code. Planned work is tracked as Backlog.md tasks under `backlog/`.
- Read `CLAUDE.md` for the decisions that govern the project (stack, engine rules, UI rules, departures from the spec) and `docs/adr/0001-pure-strategies-and-serializable-engine.md` for the engine design.
- Use the terms in `GLOSSARY.md` (move, round, match, tournament, strategy, payoff, score, outcome) in code, UI copy, and commit messages.

## Development

Set up as described in the README (`pnpm install`, `pnpm dev`). Before opening a pull request, run the same checks CI runs:

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Run a single test file with `pnpm vitest run <path>`, or filter by test name with `pnpm vitest run -t "<name>"`.

Format only the files you changed: `pnpm prettier --write <path> [<path> ...]`. There is no repo-wide format script, so unrelated files stay untouched.

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/), for example `feat(engine): add Random, Joss, and Forgiving Tit for Tat strategies`.

## Engine rules

- Engine code in `src/engine/` is framework-free TypeScript. No React or DOM imports.
- The UI imports the engine only through `src/engine/index.ts`. ESLint (`no-restricted-imports`) fails `pnpm lint` otherwise.
- The public interface is `listStrategies()`, `runTournament(config)`, `startHumanMatch(options)`, and `playHumanMove(match, move)`. Everything else is internal.

## Adding a strategy

A strategy is plain data with a pure reducer. The types are in `src/engine/types.ts`:

```ts
interface Strategy<S extends StrategyState = StrategyState> {
  readonly id: string
  readonly name: string
  readonly origin: string
  readonly description: string
  readonly initialState: S
  decide(state: S, lastRound: LastRound | null, rng: Rng): Decision<S>
}
```

Each round the engine calls `decide` with the strategy's current state, the previous round from the strategy's point of view (`{ own, opponent }`, or `null` in the first round), and the match's random number generator. `decide` returns the move (`COOPERATE` or `DEFECT`) and the state for the next round.

### 1. Write the reducer

Tit for Tat needs no state:

```ts
export const titForTat: Strategy<null> = {
  id: 'tit-for-tat',
  name: 'Tit for Tat',
  origin: "Submitted by Anatol Rapoport to Axelrod's 1980 tournament, which it won.",
  description: "Cooperates in the first round, then copies the opponent's previous move.",
  initialState: null,
  decide: (_, lastRound) => ({ move: lastRound ? lastRound.opponent : COOPERATE, nextState: null }),
}
```

Grudger keeps one flag in its state:

```ts
export const grudger: Strategy<{ betrayed: boolean }> = {
  // id, name, origin, description omitted
  initialState: { betrayed: false },
  decide: ({ betrayed }, lastRound) => {
    const nowBetrayed = betrayed || lastRound?.opponent === DEFECT
    return { move: nowBetrayed ? DEFECT : COOPERATE, nextState: { betrayed: nowBetrayed } }
  },
}
```

Put deterministic strategies in `src/engine/strategies.ts` and strategies that use randomness in `src/engine/stochasticStrategies.ts`.

Rules for a strategy:

- **Randomness comes only from `rng`.** Call `rng()` for a number in [0, 1). Never use `Math.random`: it breaks seeded reproducibility, so the same seed would no longer give the same results. Joss, for example, defects with 10% probability using `rng() < 0.1`.
- **State is plain serializable data**: `null`, booleans, numbers, strings, arrays, and plain objects (the `StrategyState` type). No classes, functions, `Map`s, or `Set`s.
- **`decide` is pure.** Return a new state instead of mutating the old one, and keep the work per round constant. Do not store the full history; keep only what the strategy needs (Grudger keeps one boolean).
- **A strategy sees only the match history.** It does not get the match length or the opponent's identity.
- **Probabilities are fixed constants**, not user settings.
- **`origin` states the real source.** Say plainly if the strategy was not an entry in Axelrod's 1980 tournament. Leave a `TODO` comment for any historical claim you cannot source.

### 2. Register it

Add the strategy to the `strategies` array at the bottom of `src/engine/strategies.ts`. Do not reorder the existing entries. The array order is the canonical order: it sets the order of `listStrategies()` (and so of the UI), the round-robin index that seeds each match, and how score ties break. Reordering can change the results for a given seed.

Then add the new id to the `lists every strategy in registry order` test in `src/engine/tournament.test.ts`.

### 3. Test it at the reducer seam

Feed `decide` a fixed state and last round, and assert the move and next state. Deterministic tests pass an `rng` that throws if drawn (see `noRandomness` in `src/engine/strategies.test.ts`). Stochastic tests use `fixedSequenceRng` from `src/engine/fixedSequenceRng.ts`, which returns the given values in order and throws if drawn more often:

```ts
test('opens by defecting on a draw below 0.1, otherwise cooperates', () => {
  const decide = (draw: number) =>
    joss.decide(joss.initialState, null, fixedSequenceRng([draw])).move
  expect([0, 0.0999, 0.1, 0.9999].map(decide)).toEqual([DEFECT, DEFECT, COOPERATE, COOPERATE])
})
```

Cover the opening move, each branch of the rule, and any state transitions.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
