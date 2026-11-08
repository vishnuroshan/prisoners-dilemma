---
id: PD-1.1
title: 'Walking skeleton: bare document page with tooling, CI, and deploy config'
status: Done
assignee: []
created_date: '2026-11-08 19:19'
updated_date: '2026-11-08 19:33'
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
- [x] #1 pnpm dev serves the page; pnpm build produces static output
- [x] #2 Tailwind v4 default colours, shadows, radii, and fonts are disabled; only project tokens exist
- [x] #3 ESLint flat config and Prettier are set up; no-restricted-imports blocks UI imports of engine internals (anything under the engine except its index)
- [x] #4 Vitest runs with at least one passing test
- [x] #5 GitHub Actions CI runs lint, type-check, tests, and build on every push and pull request
- [x] #6 Wrangler config serves the build output as static assets on Workers, with no server code
- [x] #7 Page follows CLAUDE.md UI rules: system serif, ui-monospace for data, no banned patterns
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Vite React TS walking skeleton: a bare document page with the five section headings and a #anchor table of contents, styled with Tailwind v4 where default colours, shadows, radii, blur, and fonts are cleared and only ink/paper, serif/mono, and a 70ch column token exist. ESLint flat config (with a tested no-restricted-imports guard so only src/engine/index.ts is importable), Prettier, Vitest (App TOC test plus import-guard tests), GitHub Actions CI (lint, typecheck, test, build), and a static-assets-only wrangler.jsonc are wired up. TypeScript is pinned to 6.0 because typescript-eslint 8.72 does not support TypeScript 7.
<!-- SECTION:FINAL_SUMMARY:END -->
