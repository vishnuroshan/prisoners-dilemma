// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, expect, test } from 'vitest'
import App from './App.tsx'
import { axeViolations } from './testAxe.ts'

beforeEach(() => history.replaceState(null, '', '/'))
afterEach(cleanup)

const nav = () => screen.getByRole('navigation', { name: 'Screens' })
const currentLink = () =>
  within(nav())
    .getAllByRole('link')
    .find((link) => link.getAttribute('aria-current') === 'page')?.textContent
const screenHeading = () => screen.getByRole('heading', { level: 2 })

const nextHashChange = () =>
  new Promise((resolve) => window.addEventListener('hashchange', resolve, { once: true }))

/** Navigates like a link click: a new history entry, then the hashchange event. */
async function goTo(hash: string) {
  await act(async () => {
    location.hash = hash
    await nextHashChange()
  })
}

test('the top bar has the site title as the only h1 and links to the three screens by #hash', () => {
  render(<App />)

  expect(screen.getAllByRole('heading', { level: 1 }).map((h) => h.textContent)).toEqual([
    'Iterated Prisoner’s Dilemma',
  ])
  const links = within(nav())
    .getAllByRole('link')
    .map((link) => [link.textContent, link.getAttribute('href')])
  expect(links).toEqual([
    ['Learn', '#learn'],
    ['Tournament', '#tournament'],
    ['Play', '#play'],
  ])
})

test('Learn is shown when the URL has no hash, without moving focus', () => {
  render(<App />)

  expect(currentLink()).toBe('Learn')
  expect(document.title).toBe('Learn – Iterated Prisoner’s Dilemma')
  expect(within(screen.getByRole('main')).getByRole('heading', { level: 2 })).toBe(screenHeading())
  expect(document.activeElement).toBe(document.body)
})

test('changing the hash switches the screen, its title, and moves focus to its heading', async () => {
  render(<App />)

  await goTo('#tournament')

  expect(currentLink()).toBe('Tournament')
  expect(document.title).toBe('Tournament – Iterated Prisoner’s Dilemma')
  expect(screen.getByRole('button', { name: 'Run Tournament' })).toBeTruthy()
  expect(document.activeElement).toBe(screenHeading())
})

test('back returns to the previous screen', async () => {
  render(<App />)
  await goTo('#play')
  await goTo('#tournament')

  await act(async () => {
    history.back()
    await nextHashChange()
  })

  expect(currentLink()).toBe('Play')
})

test('an unknown hash shows Learn', async () => {
  render(<App />)
  await goTo('#play')

  await goTo('#nowhere')

  expect(currentLink()).toBe('Learn')
})

test('the skip link is the first focusable element and moves focus to the screen heading', () => {
  const { container } = render(<App />)

  const first = container.querySelector('a, button, input, select, textarea, [tabindex="0"]')
  expect(first?.textContent).toBe('Skip to content')
  fireEvent.click(first!)

  expect(document.activeElement).toBe(screenHeading())
  expect(location.hash).toBe('')
})

test.each(['#learn', '#tournament', '#play'])('%s ends with the byline footer', (hash) => {
  history.replaceState(null, '', hash)
  render(<App />)

  const footer = screen.getByRole('contentinfo')
  expect(footer.textContent).toBe('Made by Vishnu Roshan')
  const link = within(footer).getByRole('link', { name: 'Vishnu Roshan' })
  expect(link.getAttribute('href')).toBe('https://www.vishnuroshan.com/')
  expect(link.getAttribute('target')).toBeNull()
})

test.each(['#learn', '#tournament', '#play'])('%s has no axe violations', async (hash) => {
  history.replaceState(null, '', hash)
  const { container } = render(<App />)

  expect(await axeViolations(container)).toEqual([])
})
