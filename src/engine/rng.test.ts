import { expect, test } from 'vitest'
import { matchSeed, seededRng } from './rng.ts'

// Golden vectors from bryc's reference mulberry32 and splitmix32 (jshash/PRNGs.md), as uint32.
test.each([
  [0, [1144304738, 1416247, 958946056]],
  [42, [2581720956, 1925393290, 3661312704]],
])('seededRng(%i) matches reference mulberry32', (seed, expected) => {
  const rng = seededRng(seed)
  expect(expected.map(() => rng() * 2 ** 32)).toEqual(expected)
})

test('matchSeed(seed, i) is the (i + 1)-th splitmix32 output', () => {
  expect([0, 1, 2].map((i) => matchSeed(42, i))).toEqual([551831576, 144025891, 322543647])
})
