import { ESLint } from 'eslint'
import { beforeAll, expect, test } from 'vitest'

const eslint = new ESLint()

// Loading the config and its plugins takes seconds on a cold start.
beforeAll(() => eslint.calculateConfigForFile('src/App.tsx'), 30_000)

async function restrictedImportErrors(filePath: string, specifier: string) {
  const [result] = await eslint.lintText(`import '${specifier}'\n`, { filePath })
  return result.messages.filter((m) => m.ruleId === 'no-restricted-imports')
}

test.each([
  ['src/App.tsx', './engine/playRound.ts'],
  ['src/App.tsx', './engine/rng'],
  ['src/charts/adapter.ts', '../engine/metrics/score.ts'],
])('UI file %s may not import engine internal %s', async (file, specifier) => {
  expect(await restrictedImportErrors(file, specifier)).toHaveLength(1)
})

test.each([
  ['src/App.tsx', './engine'],
  ['src/App.tsx', './engine/index.ts'],
  ['src/charts/adapter.ts', '../engine/index'],
  ['src/engine/tournament.ts', './playRound.ts'],
])('%s may import %s', async (file, specifier) => {
  expect(await restrictedImportErrors(file, specifier)).toHaveLength(0)
})
