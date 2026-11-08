---
id: PD-1.6
title: 'Charts part 1: leaderboard bar chart and pairwise heatmap'
status: Done
assignee: []
created_date: '2026-11-08 19:20'
updated_date: '2026-11-08 19:56'
labels:
  - ready-for-agent
dependencies:
  - PD-1.2
parent_task_id: PD-1
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The tournament results show a leaderboard bar chart and a pairwise score heatmap. Introduces Nivo, the UI-side adapter from TournamentReport to Nivo data shapes, and a Nivo theme built from project tokens.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Each chart is a figure with a caption and a table of exact numbers
- [x] #2 Heatmap cell (A, B) shows A's score against B
- [x] #3 Charts have animation off and use only project tokens
- [x] #4 The adapter from TournamentReport to chart data is a pure function with unit tests
- [x] #5 The engine has no knowledge of Nivo
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
TournamentReport now carries pairwise scores (cell (A, B) is A's score against B), tested through runTournament. The Tournament results show a leaderboard bar chart and a pairwise heatmap, each a figure with a caption and a table of exact numbers, built from a pure, unit-tested adapter in src/charts/adapters.ts. Charts use Nivo 0.99.0 with animation off, a shared token theme (grey ramp, charcoal bars, flat tooltip), and a reusable Figure wrapper for PD-1.7.
<!-- SECTION:FINAL_SUMMARY:END -->
