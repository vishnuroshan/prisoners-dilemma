---
id: PD-1.3
title: Human match against a strategy
status: To Do
assignee: []
created_date: '2026-11-08 19:20'
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
- [ ] #1 Opponent is chosen with a native select that includes a Hidden option
- [ ] #2 Match length is hidden from the Human and drawn between 10 and 20 rounds
- [ ] #3 Cooperate and Defect buttons work, and the C and D keys do the same
- [ ] #4 A round-by-round history (both moves, colour-coded) and both running scores are shown
- [ ] #5 A Hidden opponent is revealed when the match ends
- [ ] #6 Engine tests cover length bounds, scoring, end of match, and the reveal rule
<!-- AC:END -->
