// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { runTournament } from './engine'
import Payoffs from './Payoffs.tsx'

afterEach(cleanup)

test('the payoff matrix lists both players’ payoffs for every pair of moves', () => {
  render(<Payoffs />)

  const table = screen.getByRole('table', { name: /payoff matrix/i })
  const rows = within(table)
    .getAllByRole('row')
    .map((row) => [...row.querySelectorAll('th, td')].map((cell) => cell.textContent))

  expect(rows).toEqual([
    ['', 'Opponent cooperates', 'Opponent defects'],
    ['You cooperate', 'R = 3, R = 3', 'S = 0, T = 5'],
    ['You defect', 'T = 5, S = 0', 'P = 1, P = 1'],
  ])
})

test('each payoff is named with its symbol and value', () => {
  render(<Payoffs />)

  const terms = screen.getAllByRole('term').map((term) => term.textContent)
  expect(terms).toEqual([
    'Temptation (T) = 5',
    'Reward (R) = 3',
    'Punishment (P) = 1',
    'Sucker’s payoff (S) = 0',
  ])
})

test('the payoff matrix shows the payoffs the engine scores', () => {
  render(<Payoffs />)

  const table = screen.getByRole('table', { name: /payoff matrix/i })
  const [, ...bodyRows] = within(table).getAllByRole('row')
  const shown = bodyRows.map((row) =>
    [...row.querySelectorAll('td')].map((cell) => cell.textContent!.match(/\d+/g)!.map(Number)),
  )

  // One round of Always Cooperate and Always Defect plays every pair of moves once.
  const ids = ['always-cooperate', 'always-defect']
  const { pairwise } = runTournament({ strategyIds: ids, rounds: 1, seed: 1 })
  const score = (own: string, opponent: string) =>
    pairwise.find((cell) => cell.strategyId === own && cell.opponentId === opponent)!.score
  const scored = ids.map((own) =>
    ids.map((opponent) => [score(own, opponent), score(opponent, own)]),
  )

  expect(shown).toEqual(scored)
})
