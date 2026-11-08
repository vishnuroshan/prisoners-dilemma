---
id: PD-1.2
title: 'First playable tournament: ALLC vs ALLD end to end'
status: To Do
assignee: []
created_date: '2026-11-08 19:20'
labels:
  - ready-for-agent
dependencies:
  - PD-1.1
parent_task_id: PD-1
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
A user ticks strategies, sets rounds and seed, presses Run, and sees a leaderboard table. Builds the engine core per ADR 0001 and CLAUDE.md: seeded RNG, per-match seeds, internal playRound, runTournament with config validation, listStrategies. Ships with only Always Cooperate and Always Defect.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Payoffs are correct for all four move pairs
- [ ] #2 A 200-round ALLC vs ALLD match scores exactly 0 vs 1000
- [ ] #3 The same config (strategies, rounds, seed) gives an identical TournamentReport
- [ ] #4 Self-matches count one side only; the leaderboard ranks by total score
- [ ] #5 Invalid config (rounds outside 1-1000, unknown strategy id, empty selection) throws RangeError
- [ ] #6 Each Run uses a fresh random seed unless the user enters one; the seed is shown with the results
- [ ] #7 Tournament section uses native checkboxes and number inputs; the leaderboard is a table
- [ ] #8 UI imports only the engine's public index
<!-- AC:END -->
