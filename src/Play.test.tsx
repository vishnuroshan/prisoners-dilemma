// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { listStrategies } from './engine'
import Play from './Play.tsx'

afterEach(cleanup)

const opponentSelect = () => screen.getByRole<HTMLSelectElement>('combobox', { name: 'Opponent' })
const start = () => fireEvent.click(screen.getByRole('button', { name: 'Start match' }))
const cooperate = () => screen.getByRole<HTMLButtonElement>('button', { name: 'Cooperate' })
const defect = () => screen.getByRole<HTMLButtonElement>('button', { name: 'Defect' })
const scores = () => screen.getByText(/^Score:/).textContent

function historyRows() {
  const table = screen.getByRole('table', { name: 'History' })
  return within(table)
    .getAllByRole('row')
    .slice(1)
    .map((row) =>
      within(row)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    )
}

function startAgainst(name: string) {
  fireEvent.change(opponentSelect(), {
    target: { value: listStrategies().find((s) => s.name === name)?.id },
  })
  start()
}

test('the opponent select offers a Hidden opponent and every strategy, Hidden first', () => {
  render(<Play />)

  const options = within(opponentSelect())
    .getAllByRole('option')
    .map((option) => option.textContent)
  expect(options).toEqual(['Hidden opponent', ...listStrategies().map(({ name }) => name)])
  expect(opponentSelect().selectedOptions[0].textContent).toBe('Hidden opponent')
})

test('the buttons play moves and the history and running scores update each round', () => {
  render(<Play />)
  startAgainst('Always Defect')

  fireEvent.click(cooperate())
  fireEvent.click(defect())

  expect(historyRows()).toEqual([
    ['1', 'Cooperate', 'Defect'],
    ['2', 'Defect', 'Defect'],
  ])
  expect(scores()).toBe('Score: you 1, opponent 6')
})

test('the C and D keys play Cooperate and Defect', () => {
  render(<Play />)
  startAgainst('Always Cooperate')

  fireEvent.keyDown(document.body, { key: 'c' })
  fireEvent.keyDown(document.body, { key: 'D' })

  expect(historyRows()).toEqual([
    ['1', 'Cooperate', 'Cooperate'],
    ['2', 'Defect', 'Cooperate'],
  ])
})

test('keys typed into the opponent select do not play moves', () => {
  render(<Play />)
  startAgainst('Always Cooperate')

  fireEvent.keyDown(opponentSelect(), { key: 'c' })

  expect(historyRows()).toEqual([])
})

test('a Hidden opponent is revealed when the match ends and play stops', () => {
  render(<Play />)
  start()

  expect(screen.getByText('Opponent: hidden')).toBeTruthy()
  for (let i = 0; i < 20 && !cooperate().disabled; i++) fireEvent.click(cooperate())

  const rounds = historyRows().length
  expect(rounds).toBeGreaterThanOrEqual(10)
  expect(rounds).toBeLessThanOrEqual(20)
  expect(cooperate().disabled).toBe(true)
  expect(defect().disabled).toBe(true)
  const names = listStrategies().map(({ name }) => name)
  const revealed = screen.getByText(/^Opponent: /).textContent?.replace('Opponent: ', '')
  expect(names).toContain(revealed)
  expect(screen.getByRole('status').textContent).toBe(`Match over after ${rounds} rounds.`)
})
