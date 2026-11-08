---
id: PD-1.7
title: 'Charts part 2: cooperation by round and outcome distribution'
status: Done
assignee: []
created_date: '2026-11-08 19:20'
updated_date: '2026-11-08 20:02'
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
- [x] #1 Cooperation rate at round n covers all matches, self-matches included
- [x] #2 Outcome distribution counts every round of every match once as Mutual Cooperation, Mutual Defection, or Betrayal
- [x] #3 Each chart is a figure with a caption and a table of exact numbers
- [x] #4 Engine tests cover both metrics with known small tournaments
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
TournamentReport now carries cooperationByRound (share of Cooperate moves per round over both moves of every match, self-matches included) and outcomes (rounds per Outcome, each round of every match counted once), computed by pure metrics over the match records and tested through runTournament with small known tournaments. The Tournament results add a blue cooperation-rate line (@nivo/line 0.99.0) and an outcome distribution bar chart (blue, orange, mid-grey), each a figure with a caption and a table of exact numbers; the per-round table sits in a native details element.
<!-- SECTION:FINAL_SUMMARY:END -->
