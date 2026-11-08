// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import Tournament from './Tournament.tsx'

afterEach(cleanup)

const run = () => fireEvent.click(screen.getByRole('button', { name: 'Run' }))
const shownSeed = () => screen.getByText(/^Seed: \d+$/).textContent

function leaderboardRows() {
  const table = screen.getByRole('table', { name: 'Leaderboard' })
  return within(table)
    .getAllByRole('row')
    .slice(1)
    .map((row) =>
      within(row)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    )
}

/** Leaves only the named strategies ticked. */
function tickOnly(...names: string[]) {
  for (const checkbox of screen.getAllByRole<HTMLInputElement>('checkbox')) {
    if (names.includes(checkbox.labels?.[0].textContent?.trim() ?? '')) continue
    if (checkbox.checked) fireEvent.click(checkbox)
  }
}

test('running with the defaults shows a leaderboard table ranked by score', () => {
  render(<Tournament />)

  const checkboxes = screen.getAllByRole<HTMLInputElement>('checkbox')
  expect(checkboxes.every((checkbox) => checkbox.checked)).toBe(true)
  expect(screen.getByRole<HTMLInputElement>('spinbutton', { name: 'Rounds' }).value).toBe('200')
  run()

  const scores = leaderboardRows().map(([, , score]) => Number(score))
  expect(scores).toHaveLength(checkboxes.length)
  expect(scores).toEqual(scores.toSorted((a, b) => b - a))
})

test('offers the stochastic strategies', () => {
  render(<Tournament />)

  for (const name of ['Random', 'Joss', 'Forgiving Tit for Tat']) {
    expect(screen.getByRole('checkbox', { name })).toBeDefined()
  }
})

test('offers the deterministic strategies', () => {
  render(<Tournament />)

  for (const name of ['Tit for Tat', 'Grudger', 'Tit for Two Tats', 'Pavlov', 'Prober']) {
    expect(screen.getByRole('checkbox', { name })).toBeDefined()
  }
})

test('ticked strategies and rounds set the tournament', () => {
  render(<Tournament />)

  tickOnly('Always Cooperate')
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Rounds' }), { target: { value: '10' } })
  run()

  expect(leaderboardRows()).toEqual([['1', 'Always Cooperate', '30']])
})

test('an entered seed is used and shown with the results', () => {
  render(<Tournament />)

  fireEvent.change(screen.getByRole('spinbutton', { name: /Seed/ }), { target: { value: '42' } })
  run()

  expect(shownSeed()).toBe('Seed: 42')
})

test('each run without an entered seed uses a fresh random seed', () => {
  render(<Tournament />)

  run()
  const first = shownSeed()
  run()

  expect(shownSeed()).not.toBe(first)
})

test('an invalid config shows the error instead of results', () => {
  render(<Tournament />)

  tickOnly()
  run()

  expect(screen.getByRole('alert').textContent).toBe('Select at least one strategy.')
  expect(screen.queryByRole('table')).toBeNull()
})
