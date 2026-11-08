// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
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
