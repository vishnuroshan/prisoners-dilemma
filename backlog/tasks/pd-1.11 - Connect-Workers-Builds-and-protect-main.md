---
id: PD-1.11
title: Connect Workers Builds and protect main
status: To Do
assignee: []
created_date: '2026-11-08 19:20'
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
- [ ] #1 Pushes to main deploy via Workers Builds; other branches get preview URLs
- [ ] #2 main requires a pull request and a passing CI check before merge
<!-- AC:END -->
