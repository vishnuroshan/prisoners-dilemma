// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from './App.tsx'

test('table of contents links to every section by #anchor', () => {
  render(<App />)

  const contents = screen.getByRole('navigation', { name: 'Contents' })
  const sections = ['Introduction', 'Payoffs', 'Strategies', 'Tournament', 'Play']

  for (const name of sections) {
    const href = within(contents).getByRole('link', { name }).getAttribute('href')
    const heading = screen.getByRole('heading', { level: 2, name })
    expect(href).toBe(`#${heading.closest('section')?.id}`)
  }
})
