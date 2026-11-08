// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import Introduction from './Introduction.tsx'

afterEach(cleanup)

test('says the site is inspired by Axelrod’s tournament, never a recreation of it', () => {
  const { container } = render(<Introduction />)

  expect(container.textContent).toMatch(/inspired by Robert Axelrod’s/)
  expect(container.textContent).not.toMatch(/recreat/i)
})
