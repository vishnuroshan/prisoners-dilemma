---
id: PD-1.4
title: >-
  Deterministic strategies: Tit for Tat, Grudger, Tit for Two Tats, Pavlov,
  Prober
status: To Do
assignee: []
created_date: '2026-11-08 19:20'
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
- [ ] #1 Each strategy is a pure reducer with serializable state, per ADR 0001
- [ ] #2 Each strategy has tests at the reducer seam: fixed state and last round in, expected move out
- [ ] #3 Prober plays C, D, C, C, then permanently becomes Tit for Tat if the opponent defected in rounds 1-4, otherwise always defects
- [ ] #4 Pavlov and Tit for Two Tats open with Cooperate
- [ ] #5 All five appear in listStrategies and in both UI sections
<!-- AC:END -->
