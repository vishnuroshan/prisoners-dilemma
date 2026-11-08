---
id: PD-1.7
title: 'Charts part 2: cooperation by round and outcome distribution'
status: To Do
assignee: []
created_date: '2026-11-08 19:20'
labels:
  - ready-for-agent
dependencies:
  - PD-1.6
parent_task_id: PD-1
ordinal: 8000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The tournament results add a cooperation-rate-by-round line chart and an outcome distribution chart, using the Nivo setup from Charts part 1. Metric definitions are in CLAUDE.md (Game rules).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Cooperation rate at round n covers all matches, self-matches included
- [ ] #2 Outcome distribution counts every round of every match once as Mutual Cooperation, Mutual Defection, or Betrayal
- [ ] #3 Each chart is a figure with a caption and a table of exact numbers
- [ ] #4 Engine tests cover both metrics with known small tournaments
<!-- AC:END -->
