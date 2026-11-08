import { strategies } from './strategies.ts'

const MAX_SEED = 2 ** 32 - 1

/** Throws a RangeError unless `seed` is an unsigned 32-bit integer. */
export function assertSeed(seed: number): void {
  if (!Number.isInteger(seed) || seed < 0 || seed > MAX_SEED) {
    throw new RangeError('Seed must be a whole number from 0 to 4,294,967,295.')
  }
}

/** Throws a RangeError unless `id` names a registered strategy. */
export function assertKnownStrategy(id: string): void {
  if (!strategies.some((s) => s.id === id)) throw new RangeError(`Unknown strategy id: ${id}`)
}
