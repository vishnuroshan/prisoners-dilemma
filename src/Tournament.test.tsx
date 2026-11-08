// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import Tournament from './Tournament.tsx'

afterEach(cleanup)

const run = () => fireEvent.click(screen.getByRole('button', { name: 'Run' }))
const shownSeed = () => screen.getByText(/^Seed: \d+$/).textContent

/** Every row of the figure's table of exact numbers, header row included. */
function figureTableRows(name: RegExp) {
  const table = within(screen.getByRole('figure', { name })).getByRole('table')
  return within(table)
    .getAllByRole<HTMLTableRowElement>('row')
    .map((row) => Array.from(row.cells, (cell) => cell.textContent))
}

const leaderboardRows = () => figureTableRows(/^Leaderboard/).slice(1)

test('running with the defaults shows a leaderboard table ranked by score', () => {
  render(<Tournament />)

  expect(screen.getByRole<HTMLInputElement>('checkbox', { name: 'Always Cooperate' }).checked).toBe(
    true,
  )
  expect(screen.getByRole<HTMLInputElement>('checkbox', { name: 'Always Defect' }).checked).toBe(
    true,
  )
  expect(screen.getByRole<HTMLInputElement>('spinbutton', { name: 'Rounds' }).value).toBe('200')
  run()

  expect(leaderboardRows()).toEqual([
    ['1', 'Always Defect', '1200'],
    ['2', 'Always Cooperate', '600'],
  ])
})

test("the pairwise scores figure tabulates each row strategy's score against each column strategy", () => {
  render(<Tournament />)

  run()

  expect(figureTableRows(/^Pairwise scores/)).toEqual([
    ['', 'Always Defect', 'Always Cooperate'],
    ['Always Defect', '200', '1000'],
    ['Always Cooperate', '0', '600'],
  ])
})

test('ticked strategies and rounds set the tournament', () => {
  render(<Tournament />)

  fireEvent.click(screen.getByRole('checkbox', { name: 'Always Defect' }))
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

  fireEvent.click(screen.getByRole('checkbox', { name: 'Always Cooperate' }))
  fireEvent.click(screen.getByRole('checkbox', { name: 'Always Defect' }))
  run()

  expect(screen.getByRole('alert').textContent).toBe('Select at least one strategy.')
  expect(screen.queryByRole('table')).toBeNull()
})
