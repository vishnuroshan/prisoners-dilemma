// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { listStrategies } from './engine'
import Play from './Play.tsx'
import { axeViolations } from './testAxe.ts'

afterEach(cleanup)

const opponentSelect = () => screen.getByRole<HTMLSelectElement>('combobox', { name: 'Opponent' })
const start = () => fireEvent.click(screen.getByRole('button', { name: 'Start match' }))
const cooperate = () => screen.getByRole<HTMLButtonElement>('button', { name: 'Cooperate (C)' })
const defect = () => screen.getByRole<HTMLButtonElement>('button', { name: 'Defect (D)' })
const scores = () => screen.getByText(/^You \d+ \/ Opponent \d+$/).textContent
const announcement = () => screen.getByRole('status').textContent

/** An element's text without the parts hidden from assistive technology. */
function accessibleText(element: Element) {
  const copy = element.cloneNode(true) as Element
  copy.querySelectorAll('[aria-hidden="true"]').forEach((hidden) => hidden.remove())
  return copy.textContent
}

/** The history's text alternative, one entry per round. */
const historyRounds = () =>
  within(screen.getByRole('list', { name: 'History' }))
    .queryAllByRole('listitem')
    .map(accessibleText)

/** The matrix cells marked as the last round. */
const lastRoundCells = () =>
  within(screen.getByRole('table'))
    .getAllByRole('cell')
    .filter((cell) => cell.textContent?.includes('last round'))
    .map((cell) => cell.textContent)

function startAgainst(name: string) {
  fireEvent.change(opponentSelect(), {
    target: { value: listStrategies().find((s) => s.name === name)?.id },
  })
  start()
}

test('the opponent select offers a Hidden opponent and every strategy, Hidden first', () => {
  render(<Play active />)

  const options = within(opponentSelect())
    .getAllByRole('option')
    .map((option) => option.textContent)
  expect(options).toEqual(['Hidden opponent', ...listStrategies().map(({ name }) => name)])
  expect(opponentSelect().selectedOptions[0].textContent).toBe('Hidden opponent')
})

test('the buttons play moves and the history and running scores update each round', () => {
  render(<Play active />)
  startAgainst('Always Defect')

  fireEvent.click(cooperate())
  fireEvent.click(defect())

  expect(historyRounds()).toEqual([
    'Round 1: you cooperated, they defected',
    'Round 2: you defected, they defected',
  ])
  expect(scores()).toBe('You 1 / Opponent 6')
})

test('each round is announced politely with the moves and running scores', () => {
  render(<Play active />)
  startAgainst('Always Defect')

  fireEvent.click(cooperate())

  expect(announcement()).toBe('Round 1: you cooperated, they defected. You 0, opponent 5.')
})

test('the matrix marks the last round’s cell, in text as well as visually', () => {
  render(<Play active />)
  startAgainst('Always Defect')
  expect(lastRoundCells()).toEqual([])

  fireEvent.click(cooperate())
  expect(lastRoundCells()).toEqual(['0, 5, last round'])

  fireEvent.click(defect())
  expect(lastRoundCells()).toEqual(['1, 1, last round'])
})

test('the C and D keys play Cooperate and Defect, and are documented next to the buttons', () => {
  render(<Play active />)
  startAgainst('Always Cooperate')

  fireEvent.keyDown(document.body, { key: 'c' })
  fireEvent.keyDown(document.body, { key: 'D' })

  expect(historyRounds()).toEqual([
    'Round 1: you cooperated, they cooperated',
    'Round 2: you defected, they cooperated',
  ])
  expect(screen.getByText('Keys: C cooperates, D defects.')).toBeTruthy()
})

test('keys typed into the opponent select do not play moves', () => {
  render(<Play active />)
  startAgainst('Always Cooperate')

  fireEvent.keyDown(opponentSelect(), { key: 'c' })

  expect(historyRounds()).toEqual([])
})

test('keys do not play moves while the Play screen is not shown', () => {
  const { rerender } = render(<Play active />)
  startAgainst('Always Cooperate')
  rerender(<Play active={false} />)

  fireEvent.keyDown(document.body, { key: 'c' })

  expect(historyRounds()).toEqual([])
})

test('a Hidden opponent is revealed when the match ends and play stops', () => {
  render(<Play active />)
  start()

  expect(screen.getByText('Opponent: hidden')).toBeTruthy()
  for (let i = 0; i < 20 && !cooperate().disabled; i++) fireEvent.click(cooperate())

  const rounds = historyRounds().length
  expect(rounds).toBeGreaterThanOrEqual(10)
  expect(rounds).toBeLessThanOrEqual(20)
  expect(cooperate().disabled).toBe(true)
  expect(defect().disabled).toBe(true)
  const names = listStrategies().map(({ name }) => name)
  const revealed = screen.getByText(/^Opponent: /).textContent?.replace('Opponent: ', '')
  expect(names).toContain(revealed)
  expect(screen.getByText(`Match over after ${rounds} rounds.`)).toBeTruthy()
  expect(announcement()).toMatch(
    new RegExp(`Match over after ${rounds} rounds\\. Your opponent was ${revealed}\\.$`),
  )
})

test('a match in progress has no axe violations', async () => {
  const { container } = render(<Play active />)
  startAgainst('Tit for Tat')
  fireEvent.click(cooperate())

  expect(await axeViolations(container)).toEqual([])
})
