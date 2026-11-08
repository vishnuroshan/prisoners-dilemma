---
id: PD-1.11
title: Connect Workers Builds and protect main
status: Done
assignee: []
created_date: '2026-11-08 19:20'
updated_date: '2026-11-08 20:44'
labels:
  - ready-for-human
dependencies:
  - PD-1.1
parent_task_id: PD-1
ordinal: 12000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Human step: connect the GitHub repo to Cloudflare Workers Builds in the dashboard, with main as the production branch. The Worker name must match the name in the wrangler config. Then, after confirming gh auth status shows vishnuroshan and getting the user's approval, set branch protection on main: pull requests required, CI must pass.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Pushes to main deploy via Workers Builds; other branches get preview URLs
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Workers Builds connected by the user. Live at https://gametheory.vishnuroshan.com/ (custom domain; workers.dev URL also serves it), serving the build of a72ec07 (verified by matching asset hash). Branch protection still pending.

Branch protection on main was applied, then removed at the user's request. Acceptance criterion dropped.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Workers Builds deploys main to https://gametheory.vishnuroshan.com/ (custom domain). No branch protection on main, by the user's choice.
<!-- SECTION:FINAL_SUMMARY:END -->
