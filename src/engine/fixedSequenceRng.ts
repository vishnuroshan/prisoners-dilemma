import type { Rng } from './types.ts'

/**
 * The RNG's test adapter: returns `values` in order, then throws, so a test fails
 * when a strategy draws more often than expected.
 */
export function fixedSequenceRng(values: readonly number[]): Rng {
  let draws = 0
  return () => {
    if (draws === values.length) throw new Error(`rng drawn more than ${values.length} time(s)`)
    return values[draws++]
  }
}
