import type { Rng } from './types.ts'

const GOLDEN_GAMMA = 0x9e3779b9

/** splitmix32 finalizer (improved constants, per bryc's jshash/PRNGs.md). */
function mix32(z: number): number {
  z ^= z >>> 16
  z = Math.imul(z, 0x21f0aaad)
  z ^= z >>> 15
  z = Math.imul(z, 0x735a2d97)
  z ^= z >>> 15
  return z >>> 0
}

/**
 * The seed for the match at `matchIndex` in round-robin order. It is computed directly
 * (the (index + 1)-th splitmix32 output), so results do not depend on execution order.
 */
export function matchSeed(tournamentSeed: number, matchIndex: number): number {
  return mix32((tournamentSeed + Math.imul(matchIndex + 1, GOLDEN_GAMMA)) | 0)
}

/** mulberry32 (Tommy Ettinger, 2017, CC0): a 32-bit seeded generator returning floats in [0, 1). */
export function seededRng(seed: number): Rng {
  let state = seed | 0
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
