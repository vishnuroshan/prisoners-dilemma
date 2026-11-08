---
id: DRAFT-6
title: Run engine in a Web Worker
status: Draft
assignee: []
created_date: '2026-11-08 18:45'
labels: []
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Run matches in parallel across a Worker pool sized to navigator.hardwareConcurrency.

Trigger: the Vitest benchmark breaches its budget (default tournament of 10 strategies x 200 rounds under 50 ms on the main thread), or repeated or evolutionary runs land.

Seams already in place (docs/adr/0001): per-match RNG seeds make results independent of execution order; match records are Uint8Arrays that transfer without copying; config is plain data and strategies are resolved by id inside the worker; strategies are pure reducers with serializable state.
<!-- SECTION:DESCRIPTION:END -->
