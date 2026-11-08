---
id: PD-1.10
title: README and CONTRIBUTING
status: Done
assignee: []
created_date: '2026-11-08 19:20'
updated_date: '2026-11-08 20:00'
labels:
  - ready-for-agent
dependencies:
  - PD-1.4
parent_task_id: PD-1
ordinal: 11000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Developer and visitor documentation per spec section 11.1, updated for decisions in CLAUDE.md, plus a guide for adding a strategy through the reducer interface.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 README covers description, features, stack, local setup (pnpm install, pnpm dev, pnpm test)
- [x] #2 README live demo link is a TODO until deployment exists
- [x] #3 CONTRIBUTING explains how to add a strategy, with a short reducer example and the rng rule
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Rewrote README.md for visitors and developers: the experiment, payoff matrix, features, strategy list with origins, stack, local setup and commands, and a TODO live demo link. Added CONTRIBUTING.md covering checks, engine rules, and adding a strategy through the reducer interface with Tit for Tat and Grudger examples, the rng rule, registration, and reducer-seam tests. Docs only; no source changes.
<!-- SECTION:FINAL_SUMMARY:END -->
