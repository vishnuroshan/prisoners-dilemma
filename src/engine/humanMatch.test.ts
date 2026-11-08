import { describe, expect, test } from 'vitest'
import { listStrategies, playHumanMove, startHumanMatch, type HumanMatch } from './index.ts'

const ALLC = 'always-cooperate'
const ALLD = 'always-defect'

describe('scoring', () => {
  test('each round records both moves and adds both payoffs to the running scores', () => {
    let match = startHumanMatch({ opponentId: ALLD, seed: 1 })
    match = playHumanMove(match, 'C')
    match = playHumanMove(match, 'D')

    expect(match.rounds).toEqual([
      { human: 'C', opponent: 'D' },
      { human: 'D', opponent: 'D' },
    ])
    expect(match.humanScore).toBe(1)
    expect(match.opponentScore).toBe(6)
  })
})

/** Plays Cooperate until the match ends and returns the finished match. */
function playToEnd(match: HumanMatch) {
  while (!match.over) match = playHumanMove(match, 'C')
  return match
}

const seeds = Array.from({ length: 200 }, (_, i) => i)
const allIds = listStrategies().map(({ id }) => id)

describe('match length', () => {
  test('is drawn from 10 to 20 rounds, both bounds reachable', () => {
    const lengths = seeds.map(
      (seed) => playToEnd(startHumanMatch({ opponentId: ALLC, seed })).rounds.length,
    )
    expect(Math.min(...lengths)).toBe(10)
    expect(Math.max(...lengths)).toBe(20)
  })
})

describe('end of match', () => {
  test('a new match is not over', () => {
    expect(startHumanMatch({ opponentId: ALLC, seed: 7 }).over).toBe(false)
  })

  test('a move after the match is over throws a RangeError', () => {
    const finished = playToEnd(startHumanMatch({ opponentId: ALLC, seed: 7 }))
    expect(() => playHumanMove(finished, 'C')).toThrow(RangeError)
  })
})

describe('a human match is plain data', () => {
  test('a match restored from JSON plays on exactly like the original', () => {
    let match = startHumanMatch({ opponentId: null, seed: 11 })
    for (let i = 0; i < 5; i++) match = playHumanMove(match, 'D')
    const restored = JSON.parse(JSON.stringify(match)) as HumanMatch
    expect(playToEnd(restored)).toEqual(playToEnd(match))
  })

  test('playing a move does not change the match it was given', () => {
    const match = startHumanMatch({ opponentId: ALLC, seed: 1 })
    const snapshot = structuredClone(match)
    playHumanMove(match, 'D')
    expect(match).toEqual(snapshot)
  })
})

describe('invalid input throws a RangeError', () => {
  test.each([
    ['unknown opponent id', { opponentId: 'tit-for-tat-typo', seed: 1 }],
    ['negative seed', { opponentId: ALLC, seed: -1 }],
    ['seed above 2^32 - 1', { opponentId: ALLC, seed: 2 ** 32 }],
    ['fractional seed', { opponentId: ALLC, seed: 0.5 }],
  ])('startHumanMatch: %s', (_, options) => {
    expect(() => startHumanMatch(options)).toThrow(RangeError)
  })

  test('playHumanMove: a move other than C or D', () => {
    const match = startHumanMatch({ opponentId: ALLC, seed: 1 })
    expect(() => playHumanMove(match, 'X' as 'C')).toThrow(RangeError)
  })
})

describe('reveal rule', () => {
  test('a chosen opponent is shown from the start', () => {
    expect(startHumanMatch({ opponentId: ALLD, seed: 1 }).opponent).toMatchObject({
      id: ALLD,
      name: 'Always Defect',
    })
  })

  test('a Hidden opponent stays hidden until the match ends, then is revealed', () => {
    let match = startHumanMatch({ opponentId: null, seed: 3 })
    while (!match.over) {
      expect(match.opponent).toBeNull()
      match = playHumanMove(match, 'C')
    }
    expect(allIds).toContain(match.opponent?.id)
  })

  test('the Hidden opponent is picked at random from every strategy', () => {
    const picked = new Set(
      seeds.map((seed) => playToEnd(startHumanMatch({ opponentId: null, seed })).opponent?.id),
    )
    expect(picked).toEqual(new Set(allIds))
  })

  test('the revealed Hidden opponent is the one that played', () => {
    for (const seed of seeds.slice(0, 20)) {
      const hidden = playToEnd(startHumanMatch({ opponentId: null, seed }))
      const chosen = playToEnd(startHumanMatch({ opponentId: hidden.opponent!.id, seed }))
      expect(hidden.rounds).toEqual(chosen.rounds)
    }
  })
})
