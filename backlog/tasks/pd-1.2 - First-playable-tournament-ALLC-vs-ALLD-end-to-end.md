---
id: PD-1.2
title: 'First playable tournament: ALLC vs ALLD end to end'
status: Done
assignee: []
created_date: '2026-11-08 19:20'
updated_date: '2026-11-08 19:46'
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
- [x] #1 Payoffs are correct for all four move pairs
- [x] #2 A 200-round ALLC vs ALLD match scores exactly 0 vs 1000
- [x] #3 The same config (strategies, rounds, seed) gives an identical TournamentReport
- [x] #4 Self-matches count one side only; the leaderboard ranks by total score
- [x] #5 Invalid config (rounds outside 1-1000, unknown strategy id, empty selection) throws RangeError
- [x] #6 Each Run uses a fresh random seed unless the user enters one; the seed is shown with the results
- [x] #7 Tournament section uses native checkboxes and number inputs; the leaderboard is a table
- [x] #8 UI imports only the engine's public index
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Engine core per ADR 0001: seeded mulberry32 RNG with per-match splitmix32 seeds, internal playRound reusable by the human match, Uint8Array match records, a leaderboard metric, RangeError config validation, and the public listStrategies and runTournament with Always Cooperate and Always Defect. The Tournament section runs it with native checkboxes and number inputs, uses a fresh crypto seed unless one is entered, and shows the seed with a leaderboard table. Also rejects duplicate ids and non-uint32 seeds, and canonicalises selection order to registry order.
<!-- SECTION:FINAL_SUMMARY:END -->
