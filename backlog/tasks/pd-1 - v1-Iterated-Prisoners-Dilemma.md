---
id: PD-1
title: 'v1: Iterated Prisoner''s Dilemma'
status: Done
assignee: []
created_date: '2026-11-08 19:18'
updated_date: '2026-11-08 20:44'
labels: []
dependencies: []
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build v1 of the Axelrod-inspired Iterated Prisoner's Dilemma site: tournament engine, all 10 strategies, tournament dashboard, human match, teaching copy, tooling, and deployment.

Source of truth, in order of precedence:
1. CLAUDE.md (decisions made after the spec; wins on conflict)
2. docs/adr/0001-pure-strategies-and-serializable-engine.md
3. GLOSSARY.md (use its terms in code, UI copy, and tickets)
4. specs/spec.md (original spec)

Deferred features (DRAFT-1 to DRAFT-7) are out of scope, but their seams must stay intact.
<!-- SECTION:DESCRIPTION:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
v1 shipped: engine, 10 strategies, tournament dashboard with four charts, human match, teaching copy, tooling, CI, and deployment on Cloudflare Workers at https://gametheory.vishnuroshan.com/.
<!-- SECTION:FINAL_SUMMARY:END -->
