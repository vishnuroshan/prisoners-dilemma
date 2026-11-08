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
