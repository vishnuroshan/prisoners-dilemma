import { expect, test } from 'vitest'
import { listStrategies, runTournament } from './index.ts'

const BUDGET_MS = 50
const WARM_UP_RUNS = 5
const SAMPLES = 21

// A plain test rather than `bench`, because `vitest run` skips *.bench.ts files.
// Warm-up lets V8 tier up the JIT; the median ignores GC pauses and noisy outliers on slow CI.
test(`the default tournament (10 strategies x 200 rounds) runs in under ${BUDGET_MS} ms`, () => {
  const config = { strategyIds: listStrategies().map(({ id }) => id), rounds: 200, seed: 1 }
  expect(config.strategyIds).toHaveLength(10)

  for (let i = 0; i < WARM_UP_RUNS; i++) runTournament(config)
  const samples: number[] = []
  for (let i = 0; i < SAMPLES; i++) {
    const start = performance.now()
    runTournament(config)
    samples.push(performance.now() - start)
  }
  samples.sort((a, b) => a - b)
  const median = samples[Math.floor(SAMPLES / 2)]

  expect(median, `median of ${SAMPLES} runs: ${median.toFixed(2)} ms`).toBeLessThan(BUDGET_MS)
})
