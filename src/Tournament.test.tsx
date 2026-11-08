// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import Tournament from './Tournament.tsx'

afterEach(cleanup)

const run = () => fireEvent.click(screen.getByRole('button', { name: 'Run' }))
const shownSeed = () => screen.getByText(/^Seed: \d+$/).textContent

const strategyCheckboxes = () =>
  within(screen.getByRole('group', { name: 'Strategies' })).getAllByRole<HTMLInputElement>(
    'checkbox',
  )

/** Ticks exactly the named strategies, whatever the registry holds. */
function selectOnly(...names: string[]) {
  for (const box of strategyCheckboxes()) {
    const wanted = names.includes(box.labels?.[0]?.textContent?.trim() ?? '')
    if (box.checked !== wanted) fireEvent.click(box)
  }
}

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

test('running with the defaults ranks every strategy by score', () => {
  render(<Tournament />)

  expect(strategyCheckboxes().every((box) => box.checked)).toBe(true)
  expect(screen.getByRole<HTMLInputElement>('spinbutton', { name: 'Rounds' }).value).toBe('200')
  run()

  const rows = leaderboardRows()
  expect(rows.map(([rank]) => rank)).toEqual(rows.map((_, i) => String(i + 1)))
  expect(rows).toHaveLength(strategyCheckboxes().length)
  const scores = rows.map(([, , score]) => Number(score))
  expect(scores).toEqual([...scores].sort((a, b) => b - a))
})

test.each(['Tit for Tat', 'Grudger', 'Tit for Two Tats', 'Pavlov', 'Prober'])(
  '%s can be selected',
  (name) => {
    render(<Tournament />)

    expect(screen.getByRole('checkbox', { name })).toBeDefined()
  },
)

test('ticked strategies and rounds set the tournament', () => {
  render(<Tournament />)

  selectOnly('Always Cooperate', 'Always Defect')
  fireEvent.change(screen.getByRole('spinbutton', { name: 'Rounds' }), { target: { value: '10' } })
  run()

  expect(leaderboardRows()).toEqual([
    ['1', 'Always Defect', '60'],
    ['2', 'Always Cooperate', '30'],
  ])
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

  selectOnly()
  run()

  expect(screen.getByRole('alert').textContent).toBe('Select at least one strategy.')
  expect(screen.queryByRole('table')).toBeNull()
})
