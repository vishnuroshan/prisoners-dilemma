import axe from 'axe-core'

/**
 * Runs axe over a rendered tree and returns each violation as "rule-id: help". jsdom has no
 * layout or computed colours, so colour contrast is checked in the browser instead.
 */
export async function axeViolations(container: Element): Promise<string[]> {
  const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } })
  return results.violations.map(({ id, help }) => `${id}: ${help}`)
}
