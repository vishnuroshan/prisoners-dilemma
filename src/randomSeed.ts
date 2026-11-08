/** A fresh unsigned 32-bit seed for a run or a match. */
export function randomSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0]
}
