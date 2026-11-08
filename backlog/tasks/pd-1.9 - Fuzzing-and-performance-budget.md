---
id: PD-1.9
title: Fuzzing and performance budget
status: Done
assignee: []
created_date: '2026-11-08 19:20'
updated_date: '2026-11-08 20:07'
labels:
  - ready-for-agent
dependencies:
  - PD-1.4
  - PD-1.5
  - PD-1.7
parent_task_id: PD-1
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Guard engine robustness and the performance budget from ADR 0001 once all strategies and metrics exist.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 fast-check fuzzes runTournament over random strategy selections, round counts (1-1000), and seeds without throwing
- [x] #2 A Vitest benchmark asserts the default tournament (10 strategies, 200 rounds) runs in under 50 ms
- [x] #3 Both run in CI
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added a fast-check property test that runs runTournament over random shuffled strategy selections, rounds 1-1000, and uint32 seeds (50 runs) and checks the report shape, plus a timing test asserting the median of 21 post-warm-up default tournaments stays under 50 ms (measured about 1 ms locally). The budget guard is a plain Vitest test timed with performance.now() rather than a bench, because vitest run skips *.bench.ts files; both run in CI via pnpm test. No engine bugs found.
<!-- SECTION:FINAL_SUMMARY:END -->
