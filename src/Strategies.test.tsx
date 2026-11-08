// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { listStrategies } from './engine'
import Strategies from './Strategies.tsx'

afterEach(cleanup)

test('lists all 10 strategies by name', () => {
  render(<Strategies />)

  const names = screen.getAllByRole('term').map((term) => term.textContent)
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

test('shows each strategy’s description and origin from the engine', () => {
  render(<Strategies />)

  for (const { description, origin } of listStrategies()) {
    expect(screen.getByText(description)).toBeTruthy()
    expect(screen.getAllByText(origin, { exact: false }).length).toBeGreaterThan(0)
  }
})
