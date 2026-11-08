# Pure reducer strategies and a pure, serializable engine

Strategies are pure reducers packaged as plain data: `{ id, name, origin, description, initialState, decide(state, lastRound, rng) → { move, nextState } }`. Strategy state is plain serializable data (Grudger keeps `betrayed: true`, Prober keeps its probe verdict). Each round costs constant time regardless of match length. The engine is framework-free TypeScript. Tournament config (strategy ids, round count, seed) is plain data. Results hold the full record of every match as two `Uint8Array`s (0 = Cooperate, 1 = Defect). Each match gets its own RNG seeded from the tournament seed plus the pair's round-robin index. A single `playRound` function drives both tournament and human matches. Every metric is a pure function over the results.

The engine's public interface is four entry points, exported only from `src/engine/index.ts`: `listStrategies()` (metadata only, no reducers), `runTournament(config) → TournamentReport` (leaderboard, pairwise scores, cooperation by round, outcome distribution), `startHumanMatch(opts)`, and `playHumanMove(match, move)`. `playRound`, the match records, the RNG, and the metric functions are internal. An invalid config (rounds outside 1–1,000, unknown strategy id, empty selection) throws a `RangeError`. The UI may not import engine internals, and ESLint `no-restricted-imports` enforces this. Chart-library data shapes are produced by a UI-side adapter, never by the engine.

We chose this so that deferred features land as additions rather than rewrites: user-written strategies (sandboxable pure code), noise (inserted between decision and recorded move), repeated runs (loop over derived seeds), evolutionary runs (computed from the pairwise score matrix), persistence (store the config, re-run to reproduce), and parallel execution in a Web Worker pool (per-match seeds make results independent of execution order; typed arrays transfer without copying).

## Considered Options

- **Stateful strategy objects** were rejected. Hidden mutable state blocks sandboxing user code, makes noise and replay harder to reason about, and cannot cross a worker boundary.
- **Pure functions of full history** (`decide(history, rng)`) were rejected. They are simplest to write but cost O(n) per round, so O(n²) per match. That is too slow for long matches and for repeated or evolutionary runs.
- **One RNG stream for the whole tournament** was rejected. Results would depend on match execution order, so parallel runs would break seeded reproducibility.
- **Placeholder hooks** for deferred features (a `noise: 0` parameter, a plugin registry, worker scaffolding) were rejected. They guess at designs that do not exist yet. The seams above cost nothing now.

## Consequences

- Strategies must draw randomness only from the injected `rng`. Using `Math.random` breaks seeded reproducibility.
- Rounds per match are capped at 1–1,000 (default 200).
- Performance budget: the default tournament (10 strategies, 200 rounds) finishes in under 50 ms on the main thread, guarded by a timed Vitest test (median after warm-up). A breach is the trigger for the Worker pool.
