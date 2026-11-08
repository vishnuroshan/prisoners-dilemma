// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { listStrategies, runTournament } from './engine'
import Learn from './Learn.tsx'
import { axeViolations } from './testAxe.ts'

afterEach(cleanup)

const matrix = () => screen.getByRole('table', { name: /payoffs for each pair of moves/i })
const explanation = () => screen.getByRole('status', { name: 'Outcome explanation' }).textContent

/** The matrix as text, row by row, header row included. */
function matrixRows() {
  return within(matrix())
    .getAllByRole('row')
    .map((row) => [...row.querySelectorAll('th, td')].map((cell) => cell.textContent))
}

test('opens by saying what the site is and that it is inspired by Axelrod’s tournament, never a recreation of it', () => {
  const { container } = render(<Learn />)

  const [first] = container.querySelectorAll('p')
  expect(first.textContent).toBe(
    'Run tournaments between strategies for the iterated prisoner’s dilemma, or play a match yourself. The site is inspired by Robert Axelrod’s 1980 computer tournament.',
  )
  expect(container.textContent).not.toMatch(/recreat/i)
})

test('the introduction ends by crediting Veritasium’s video as the inspiration for the site', () => {
  render(<Learn />)

  const link = screen.getByRole('link', { name: /Veritasium’s video/ })
  expect(link.closest('p')?.textContent).toMatch(
    /This site was inspired by Veritasium’s video on game theory and the prisoner’s dilemma\.$/,
  )
  expect(link.getAttribute('href')).toBe('https://www.youtube.com/watch?v=mScpHTIi-kM')
  expect(link.getAttribute('target')).toBeNull()
})

test('the payoff matrix lists both players’ payoffs for every pair of moves', () => {
  render(<Learn />)

  expect(matrixRows()).toEqual([
    ['', 'They cooperate', 'They defect'],
    ['You cooperate', '3, 3', '0, 5'],
    ['You defect', '5, 0', '1, 1'],
  ])
})

test('the payoff matrix shows the payoffs the engine scores', () => {
  render(<Learn />)

  const [, ...bodyRows] = within(matrix()).getAllByRole('row')
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

test('focusing or hovering a cell explains that outcome, naming each payoff', () => {
  render(<Learn />)
  const [cc, cd, dc, dd] = within(matrix())
    .getAllByRole('cell')
    .filter((cell) => cell.tabIndex === 0)

  fireEvent.focus(cc)
  expect(explanation()).toBe('Both cooperate: each player earns the Reward, 3.')
  fireEvent.mouseEnter(cd)
  expect(explanation()).toBe(
    'You cooperate and they defect: you get the Sucker’s payoff, 0, and they get the Temptation, 5.',
  )
  fireEvent.focus(dc)
  expect(explanation()).toBe(
    'You defect and they cooperate: you get the Temptation, 5, and they get the Sucker’s payoff, 0.',
  )
  fireEvent.mouseEnter(dd)
  expect(explanation()).toBe('Both defect: each player earns the Punishment, 1.')
})

test('the explanation resets when the pointer leaves', () => {
  render(<Learn />)
  const [cc] = within(matrix())
    .getAllByRole('cell')
    .filter((cell) => cell.tabIndex === 0)

  fireEvent.mouseEnter(cc)
  fireEvent.mouseLeave(cc)

  expect(explanation()).toMatch(/^Hover over or focus a cell/)
})

test('lists every strategy by name', () => {
  render(<Learn />)

  const strategies = screen.getByRole('list', { name: 'Strategies' })
  const names = within(strategies)
    .getAllByRole('button')
    .map((button) => button.textContent)
  expect(names).toEqual([
    'Always Cooperate',
    'Always Defect',
    'Tit for Tat',
    'Grudger',
    'Tit for Two Tats',
    'Pavlov',
    'Prober',
    'Random',
    'Joss',
    'Forgiving Tit for Tat',
  ])
})

test('focusing or hovering a strategy shows its description and origin from the engine', () => {
  render(<Learn />)
  const shown = () => screen.getByRole('status', { name: 'Strategy explanation' }).textContent

  for (const [i, { name, description, origin }] of listStrategies().entries()) {
    const button = screen.getByRole('button', { name })
    if (i % 2 === 0) fireEvent.focus(button)
    else fireEvent.mouseEnter(button)
    expect(shown()).toBe(`${name}: ${description}${origin}`)
    fireEvent.blur(button)
    fireEvent.mouseLeave(button)
  }
  expect(shown()).toMatch(/^Hover over or focus a strategy/)
})

test('has no axe violations', async () => {
  const { container } = render(<Learn />)
  fireEvent.focus(screen.getByRole('button', { name: 'Tit for Tat' }))

  expect(await axeViolations(container)).toEqual([])
})
