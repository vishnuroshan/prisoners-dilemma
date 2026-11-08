---
id: PD-1.8
title: 'Teaching copy: Introduction, Payoffs, Strategies sections'
status: Done
assignee: []
created_date: '2026-11-08 19:20'
updated_date: '2026-11-08 20:00'
labels:
  - ready-for-agent
dependencies:
  - PD-1.4
  - PD-1.5
parent_task_id: PD-1
ordinal: 9000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The page explains the dilemma, the payoff matrix, and every strategy. The Strategies section is rendered from listStrategies metadata. Copy is drafted for the user's review, in a serious tone with no marketing language.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Introduction covers the dilemma and states the site is inspired by Axelrod's tournament, never a recreation
- [x] #2 Payoffs section shows the matrix as a table with T, R, P, S values
- [x] #3 Strategies section lists all 10 with name, origin, and description
- [x] #4 Any historical claim that cannot be sourced is marked TODO
- [x] #5 Copy uses GLOSSARY.md terms
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added Introduction, Payoffs, and Strategies section components with draft teaching copy for review: the payoff matrix is a semantic table with T, R, P, S named, and Strategies renders name, description, and origin from listStrategies. The Introduction says the site is inspired by Axelrod's 1980 tournament; unsourced historical claims (origin of the dilemma, 1980 entry count, match length, format) are TODO comments. Rendering tests cover the matrix values, all 10 strategies, and the inspired-by wording.
<!-- SECTION:FINAL_SUMMARY:END -->
