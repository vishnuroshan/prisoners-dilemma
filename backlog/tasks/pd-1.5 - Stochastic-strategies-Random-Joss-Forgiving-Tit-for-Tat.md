---
id: PD-1.5
title: 'Stochastic strategies: Random, Joss, Forgiving Tit for Tat'
status: To Do
assignee: []
created_date: '2026-11-08 19:20'
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
- [ ] #1 Tests use a fixed-sequence rng stub to assert exact moves
- [ ] #2 Joss defects with 10% probability only when Tit for Tat would cooperate, and never cooperates after an opponent defection
- [ ] #3 Forgiving Tit for Tat cooperates with 5% probability after an opponent defection
- [ ] #4 No use of Math.random anywhere in the engine
- [ ] #5 All three appear in listStrategies and in both UI sections
<!-- AC:END -->
