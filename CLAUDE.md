# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Pre-implementation. No source code, `package.json`, or tooling exists yet. Design inputs, in order of precedence:

1. This file (decisions made after the spec was written; it wins on conflict).
2. `docs/adr/` (architecture decisions with rationale).
3. `GLOSSARY.md` (canonical domain terms; use them in code, UI copy, and tickets).
4. `specs/spec.md` (original spec; left unedited).

Deferred features are Backlog drafts DRAFT-1 to DRAFT-7. Do not build them, but do not break the seams they rely on (see ADR 0001).

## Stack

React, TypeScript, Vite, pnpm, Vitest, Tailwind v4, Nivo (charts), ESLint (flat config), Prettier, GitHub Actions CI. Hosted on Cloudflare Workers (static assets only) via Workers Builds Git integration.

## Planned commands (not yet wired up)

- `pnpm install`, `pnpm run dev`, `pnpm test`
- Single test file: `pnpm vitest run path/to/file.test.ts`; filter by name with `-t "<name>"`

Replace this section with the real scripts once tooling exists.

## Engine architecture (see ADR 0001)

- Framework-free TypeScript. No React or DOM imports in engine code.
- Public interface is exactly four entry points, exported only from `src/engine/index.ts`: `listStrategies()`, `runTournament(config) → TournamentReport`, `startHumanMatch(opts)`, `playHumanMove(match, move)`. Everything else is internal. The UI imports only the index, and ESLint `no-restricted-imports` enforces this.
- An invalid config (rounds outside 1–1,000, unknown strategy id, empty selection) throws a `RangeError`.
- Nivo data shapes come from a UI-side adapter over `TournamentReport`. The engine never knows the chart library.
- A strategy is plain data with a pure reducer: `{ id, name, origin, description, initialState, decide(state, lastRound, rng) → { move, nextState } }`. State must be plain serializable data. Strategies see only match history: never the match length or the opponent's identity.
- Strategies draw randomness only from the injected `rng`. Never use `Math.random`.
- One internal `playRound` function drives both tournament and human matches.
- Each match gets its own RNG seeded from the tournament seed plus the pair's round-robin index, so results do not depend on execution order.
- Config is plain data: strategy ids, rounds (1–1,000, default 200), seed. Each run uses a fresh random seed unless the user enters one; the seed is shown with the results.
- Internally, every match's full record is kept as two `Uint8Array`s (0 = Cooperate, 1 = Defect), and metrics are pure functions over the records. Records never cross the public interface.
- Test strategies at the reducer seam (fixed `state` and `lastRound` in, move out). Test everything else through the four entry points. The RNG has two adapters: the seeded generator, and a fixed-sequence stub for tests.
- Performance budget: the default tournament (10 strategies x 200 rounds) runs in under 50 ms on the main thread, guarded by a Vitest benchmark. No Web Worker until that breaks (DRAFT-6).

## Game rules

- Payoffs: T=5, R=3, P=1, S=0. Round-robin, including a self-match per strategy.
- Score: in a self-match only one side counts. The leaderboard ranks by total score.
- Metrics: heatmap cell (A, B) is A's score against B. Cooperation rate at round n covers all matches, self-matches included. Outcome distribution counts every round of every match once.

## Strategies (all 10 ship in v1)

Spec section 4 defines them. Decisions that fill its gaps:

- Pavlov and Tit for Two Tats open with Cooperate.
- The spec's "Detective" is renamed **Prober**. It plays C, D, C, C, then decides once and permanently: Tit for Tat if the opponent defected in rounds 1–4, otherwise always defect.
- Joss: when Tit for Tat would cooperate, defect with 10% probability. Never cooperate after an opponent defection.
- Forgiving Tit for Tat: after an opponent defection, cooperate with 5% probability.
- Probabilities are fixed constants, not user settings.
- The site says "inspired by" Axelrod, never "recreation". Each strategy shows its real origin. ALLC, ALLD, and Prober were not entries in Axelrod's 1980 tournament.

## Human match

Hidden length, drawn between 10 and 20 rounds. A hidden opponent is revealed at match end. Show a round-by-round history and running scores. Keyboard: `C` cooperates, `D` defects.

## UI rules

The goal is a serious, almost bare-HTML document. Nothing that reads as AI-generated frontend.

- One page with sections and a plain table of contents (`#anchor` links). No router.
- Single prose column about 70 characters wide. Figures may be wider.
- Fonts: system serif for text (Charter, Georgia fallback). `ui-monospace` for numbers and tables. No web fonts.
- Colours: text `#1A1A1A` on `#F9F9F9`. Blue and orange only, and only to encode Cooperate and Defect.
- Underlined links. 1px rules.
- Tailwind v4 with default colours, shadows, radii, and fonts disabled via `@theme { --color-*: initial; … }`. Only project tokens exist.
- Native HTML controls only: checkboxes, `<input type="number">`, `<select>`, `<button>`. No component library.
- Charts use Nivo with `animate={false}`, styled from tokens. Each chart is a `<figure>` with a caption and a table of exact numbers.
- **Banned:** hero banners, gradients, glassmorphism, blur, glow, drop shadows, rounded cards, three-column feature grids, icon-per-item lists, emoji, purple, indigo, or neon accents, dark-mode-first styling, animated blobs, skeleton shimmer, toasts, modals, call-to-action button pairs, marketing copy, chart animation.
- Teaching copy is drafted by Claude for the user's review. Historical claims that cannot be sourced stay as TODOs.

## Testing

Engine correctness first:

- Payoffs for all four move pairs.
- Each strategy fed fixed histories, asserting its next move.
- 200-round ALLC vs ALLD gives exactly 0 vs 1000.
- `fast-check` fuzzing over histories and round counts.
- Seeded determinism: the same config gives an identical result.

E2E and chart testing are deferred (DRAFT-7).

## Departures from the spec

Cloudflare Pages becomes Workers (Cloudflare's Pages docs now say "Start new projects with Workers"). Recharts becomes Nivo (Recharts has no heatmap). Inter or Roboto Mono becomes system fonts. Detective becomes Prober. "Recreation" becomes "inspired by".

## Repo operations

- Before any `gh` command, confirm `gh auth status` shows the account `vishnuroshan`.
- After CI exists, `main` gets branch protection: PRs required, CI must pass. Workers Builds deploys every push to `main` regardless of CI, so this protection is the only gate.

## Agent skills

### Issue tracker

Tasks live in Backlog.md (`backlog/`), managed with the `backlog` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage roles, used as Backlog task labels. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

<!-- BACKLOG.MD MCP GUIDELINES START -->

<CRITICAL_INSTRUCTION>

## BACKLOG WORKFLOW INSTRUCTIONS

This project uses Backlog.md MCP for all task and project management activities.

**CRITICAL GUIDANCE**

- If your client supports MCP resources, read `backlog://workflow/overview` to understand when and how to use Backlog for this project.
- If your client only supports tools or the above request fails, call `backlog.get_backlog_instructions()` to load the tool-oriented overview. Use the `instruction` selector when you need `task-creation`, `task-execution`, or `task-finalization`.

- **First time working here?** Read the overview resource IMMEDIATELY to learn the workflow
- **Already familiar?** You should have the overview cached ("## Backlog.md Overview (MCP)")
- **When to read it**: BEFORE creating tasks, or when you're unsure whether to track work

These guides cover:
- Decision framework for when to create tasks
- Search-first workflow to avoid duplicates
- Links to detailed guides for task creation, execution, and finalization
- MCP tools reference

You MUST read the overview resource to understand the complete workflow. The information is NOT summarized here.

</CRITICAL_INSTRUCTION>

<!-- BACKLOG.MD MCP GUIDELINES END -->
