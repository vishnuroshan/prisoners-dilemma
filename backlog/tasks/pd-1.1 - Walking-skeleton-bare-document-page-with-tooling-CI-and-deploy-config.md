---
id: PD-1.1
title: 'Walking skeleton: bare document page with tooling, CI, and deploy config'
status: To Do
assignee: []
created_date: '2026-11-08 19:19'
labels:
  - ready-for-agent
dependencies: []
parent_task_id: PD-1
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
A bare document page builds, lints, type-checks, tests, and is ready for Cloudflare Workers static-asset hosting. The page shows only the section headings (Introduction, Payoffs, Strategies, Tournament, Play) and a plain table of contents with #anchor links. Follow the stack and UI rules in CLAUDE.md.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 pnpm dev serves the page; pnpm build produces static output
- [ ] #2 Tailwind v4 default colours, shadows, radii, and fonts are disabled; only project tokens exist
- [ ] #3 ESLint flat config and Prettier are set up; no-restricted-imports blocks UI imports of engine internals (anything under the engine except its index)
- [ ] #4 Vitest runs with at least one passing test
- [ ] #5 GitHub Actions CI runs lint, type-check, tests, and build on every push and pull request
- [ ] #6 Wrangler config serves the build output as static assets on Workers, with no server code
- [ ] #7 Page follows CLAUDE.md UI rules: system serif, ui-monospace for data, no banned patterns
<!-- AC:END -->
