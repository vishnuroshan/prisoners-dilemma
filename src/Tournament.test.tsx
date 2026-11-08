// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import Tournament from './Tournament.tsx'

afterEach(cleanup)

const run = () => fireEvent.click(screen.getByRole('button', { name: 'Run Tournament' }))
const shownSeed = () => screen.getByText(/^Seed: \d+$/).textContent

/** Every row of the figure's table of exact numbers, header row included. */
function figureTableRows(name: RegExp) {
  const table = within(screen.getByRole('figure', { name })).getByRole('table')
  return within(table)
    .getAllByRole<HTMLTableRowElement>('row')
    .map((row) => Array.from(row.cells, (cell) => cell.textContent))
}

const leaderboardRows = () => figureTableRows(/^Leaderboard/).slice(1)

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

test("the pairwise scores figure tabulates each row strategy's score against each column strategy", () => {
  render(<Tournament />)

  tickOnly('Always Cooperate', 'Always Defect')
  run()

  expect(figureTableRows(/^Pairwise scores/)).toEqual([
    ['', 'Always Defect', 'Always Cooperate'],
    ['Always Defect', '200', '1000'],
    ['Always Cooperate', '0', '600'],
  ])
})

test('the cooperation rate figure tabulates the rate for each round', () => {
  render(<Tournament />)

  tickOnly('Tit for Tat', 'Always Defect')
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Rounds' }), { target: { value: '3' } })
  run()

  expect(figureTableRows(/^Cooperation rate by round/)).toEqual([
    ['Round', 'Cooperation rate'],
    ['1', '0.5000'],
    ['2', '0.3333'],
    ['3', '0.3333'],
  ])
})

test('the outcome distribution figure tabulates rounds per Outcome', () => {
  render(<Tournament />)

  tickOnly('Tit for Tat', 'Always Defect')
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Rounds' }), { target: { value: '3' } })
  run()

  expect(figureTableRows(/^Outcome distribution/)).toEqual([
    ['Outcome', 'Rounds', 'Share'],
    ['Mutual Cooperation', '3', '33.3%'],
    ['Mutual Defection', '5', '55.6%'],
    ['Betrayal', '1', '11.1%'],
  ])
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
