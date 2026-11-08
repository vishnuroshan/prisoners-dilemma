# The Iterated Prisoner's Dilemma

A single-page web app, inspired by Robert Axelrod's 1980 computer tournament, where strategies for the iterated Prisoner's Dilemma play each other in round-robin tournaments and you can play against them yourself.

Live demo: TODO (added once the Cloudflare Workers deployment exists).

## The experiment

In the Prisoner's Dilemma, two players each choose to Cooperate or Defect without seeing the other's choice. Each round pays (your points first, then your opponent's):

|                   | Opponent cooperates | Opponent defects |
| ----------------- | ------------------- | ---------------- |
| **You cooperate** | 3, 3                | 0, 5             |
| **You defect**    | 5, 0                | 1, 1             |

The four payoffs are called Temptation (5), Reward (3), Punishment (1), and Sucker's payoff (0).

Defecting always pays more in a single round, yet two players who both defect earn less than two who both cooperate. Repeat the game over many rounds and a player can respond to what the other did before, so cooperation can pay.

In 1980 Axelrod ran a tournament in which submitted strategies played the iterated game against each other, round-robin. Anatol Rapoport's Tit for Tat, which cooperates first and then copies the opponent's previous move, won.

This project is inspired by that tournament, not a recreation of it. Some strategies here were not entries in 1980, and each strategy shows its real origin in the app.

## Features

- **Tournament.** Pick any of the strategies below and a number of rounds per match (1 to 1,000, default 200). Every selected strategy plays every other one and a copy of itself. Results include a leaderboard bar chart and a pairwise heatmap, each with a table of exact numbers.
- **Seeded runs.** Each run uses a fresh random seed unless you enter one, and the seed is shown with the results. The same strategies, rounds, and seed always give the same results.
- **Play.** Play a match against a strategy you choose, or against a hidden opponent revealed when the match ends. The match length is hidden (10 to 20 rounds). Press `C` to cooperate and `D` to defect.
- **Planned for v1:** cooperation rate by round and outcome distribution charts, and teaching copy for the Introduction, Payoffs, and Strategies sections.

### Strategies

| Strategy              | Relation to Axelrod's 1980 tournament               |
| --------------------- | --------------------------------------------------- |
| Always Cooperate      | Baseline, not an entry                              |
| Always Defect         | Baseline, not an entry                              |
| Tit for Tat           | Anatol Rapoport's entry, the winner                 |
| Grudger               | Friedman's entry (also known as Grim Trigger)       |
| Tit for Two Tats      | John Maynard Smith's entry in the second tournament |
| Pavlov                | Named in later research (Kraines and Kraines, 1989) |
| Prober                | Not an entry; Nicky Case's "Detective", renamed     |
| Random                | Baseline included in the 1980 tournament            |
| Joss                  | Johann Joss's entry                                 |
| Forgiving Tit for Tat | Later research (a form of Generous Tit for Tat)     |

The full origin and rules of each strategy are in `src/engine/strategies.ts` and `src/engine/stochasticStrategies.ts`.

## Tech stack

React, TypeScript, Vite, pnpm, Vitest, Tailwind CSS v4, Nivo (charts), ESLint, Prettier, and GitHub Actions CI. The built site is static and hosted on Cloudflare Workers (static assets only). The tournament engine is framework-free TypeScript and runs entirely in the browser.

## Local setup

Requirements: Node.js (CI uses Node 24) and pnpm (the version is pinned in the `packageManager` field of `package.json`).

```sh
git clone https://github.com/vishnuroshan/prisoners-dilemma.git
cd prisoners-dilemma
pnpm install
pnpm dev
```

`pnpm dev` starts the Vite dev server and prints the local URL.

Other commands:

| Command          | What it does                                      |
| ---------------- | ------------------------------------------------- |
| `pnpm test`      | Run all Vitest tests once                         |
| `pnpm lint`      | Run ESLint                                        |
| `pnpm typecheck` | Type-check the app and Node configs (`tsc -b`)    |
| `pnpm build`     | Type-check, then build the static site to `dist/` |
| `pnpm preview`   | Serve the built `dist/` locally                   |

CI runs lint, typecheck, test, and build on every push and pull request.

## Adding a strategy

A strategy is plain data with a pure reducer:

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

See [CONTRIBUTING.md](CONTRIBUTING.md) for a worked example, the rules a strategy must follow, and how to register and test it.

## Project layout

- `src/engine/`: the tournament engine. Its public interface is `src/engine/index.ts`.
- `src/charts/`: chart figures and the adapters from engine results to chart data.
- `src/`: the page and its sections.
- `docs/adr/`: architecture decisions.
- `GLOSSARY.md`: the domain terms used in code and copy.
- `specs/spec.md`: the original product spec. `CLAUDE.md` records later decisions and wins where they differ.

## License

[MIT](LICENSE)
