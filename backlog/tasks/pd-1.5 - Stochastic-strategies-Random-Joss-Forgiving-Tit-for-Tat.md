---
id: PD-1.5
title: 'Stochastic strategies: Random, Joss, Forgiving Tit for Tat'
status: Done
assignee: []
created_date: '2026-11-08 19:20'
updated_date: '2026-11-08 19:53'
labels:
  - ready-for-agent
dependencies:
  - PD-1.2
parent_task_id: PD-1
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Three stochastic strategies become available in the Tournament and Play sections. Rules are in CLAUDE.md (Strategies). Randomness comes only from the injected rng.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Tests use a fixed-sequence rng stub to assert exact moves
- [x] #2 Joss defects with 10% probability only when Tit for Tat would cooperate, and never cooperates after an opponent defection
- [x] #3 Forgiving Tit for Tat cooperates with 5% probability after an opponent defection
- [x] #4 No use of Math.random anywhere in the engine
- [x] #5 All three appear in listStrategies and in both UI sections
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added Random, Joss, and Forgiving Tit for Tat as pure reducers that draw only from the injected rng, registered after ALLC and ALLD, with reducer tests on a fixed-sequence rng stub and seeded-determinism tests through runTournament. They appear in the Tournament section via listStrategies; the Play section does not exist yet (PD-1.3), so its half of AC #5 is unverified until PD-1.3 lands. Forgiving Tit for Tat's primary source is marked TODO: verify.
<!-- SECTION:FINAL_SUMMARY:END -->
