---
id: PD-1.3
title: Human match against a strategy
status: Done
assignee: []
created_date: '2026-11-08 19:20'
updated_date: '2026-11-08 19:55'
labels:
  - ready-for-agent
dependencies:
  - PD-1.2
parent_task_id: PD-1
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The Human plays a match against a chosen strategy or a Hidden opponent in the Play section. Adds startHumanMatch and playHumanMove to the engine's public interface (ADR 0001).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Opponent is chosen with a native select that includes a Hidden option
- [x] #2 Match length is hidden from the Human and drawn between 10 and 20 rounds
- [x] #3 Cooperate and Defect buttons work, and the C and D keys do the same
- [x] #4 A round-by-round history (both moves, colour-coded) and both running scores are shown
- [x] #5 A Hidden opponent is revealed when the match ends
- [x] #6 Engine tests cover length bounds, scoring, end of match, and the reveal rule
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added startHumanMatch and playHumanMove to the engine's public interface. The match is plain serializable data driven by the shared playRound, and its hidden length (10-20 rounds) and Hidden opponent are derived from the seed rather than stored. The Play section has an opponent select with a Hidden option, Cooperate and Defect buttons with C and D keys, a blue and orange history table, running scores, and the reveal at match end.
<!-- SECTION:FINAL_SUMMARY:END -->
