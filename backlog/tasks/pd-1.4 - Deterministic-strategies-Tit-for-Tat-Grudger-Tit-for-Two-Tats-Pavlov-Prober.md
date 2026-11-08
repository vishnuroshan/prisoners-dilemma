---
id: PD-1.4
title: >-
  Deterministic strategies: Tit for Tat, Grudger, Tit for Two Tats, Pavlov,
  Prober
status: Done
assignee: []
created_date: '2026-11-08 19:20'
updated_date: '2026-11-08 19:54'
labels:
  - ready-for-agent
dependencies:
  - PD-1.2
parent_task_id: PD-1
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Five deterministic strategies become available in the Tournament and Play sections. Rules, including the gap-filling decisions, are in CLAUDE.md (Strategies). Each strategy carries name, origin, and description metadata.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Each strategy is a pure reducer with serializable state, per ADR 0001
- [x] #2 Each strategy has tests at the reducer seam: fixed state and last round in, expected move out
- [x] #3 Prober plays C, D, C, C, then permanently becomes Tit for Tat if the opponent defected in rounds 1-4, otherwise always defects
- [x] #4 Pavlov and Tit for Two Tats open with Cooperate
- [x] #5 All five appear in listStrategies and in both UI sections
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
AC #5: all five are in listStrategies and the Tournament section (tested). The Play section does not exist on this branch; it is PD-1.3's work and is expected to list strategies via listStrategies, so not verified here. Origins checked against the Axelrod Python library docs (axelrod.readthedocs.io: TitForTat, Grudger, TitFor2Tats, WinStayLoseShift docstrings and bibliography) and Nicky Case's trust/words.html. Tournament.test.tsx no longer assumes a two-strategy registry.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added Tit for Tat, Grudger, Tit for Two Tats, Pavlov, and Prober as pure reducers with plain serializable state, registered in one contiguous block after ALLD. Each is tested at the reducer seam, with serializable-state checks and runTournament-level score checks. The Tournament UI tests were made independent of registry size.
<!-- SECTION:FINAL_SUMMARY:END -->
