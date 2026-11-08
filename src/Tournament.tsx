import { useState, type FormEvent } from 'react'
import { CooperationFigure } from './charts/CooperationFigure.tsx'
import { LeaderboardFigure } from './charts/LeaderboardFigure.tsx'
import { OutcomeFigure } from './charts/OutcomeFigure.tsx'
import { PairwiseFigure } from './charts/PairwiseFigure.tsx'
import { listStrategies, runTournament, type TournamentReport } from './engine'
import { randomSeed } from './randomSeed.ts'

const strategies = listStrategies()

type RunResult = { seed: number; report: TournamentReport } | { error: string }

export default function Tournament() {
  const [selectedIds, setSelectedIds] = useState(() => strategies.map(({ id }) => id))
  const [rounds, setRounds] = useState('200')
  const [seed, setSeed] = useState('')
  const [result, setResult] = useState<RunResult | null>(null)

  function toggle(id: string) {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))
  }

  // The engine is the single validator, so native form validation is off (noValidate).
  function run(event: FormEvent) {
    event.preventDefault()
    const runSeed = seed === '' ? randomSeed() : Number(seed)
    try {
      const report = runTournament({
        strategyIds: selectedIds,
        rounds: Number(rounds),
        seed: runSeed,
      })
      setResult({ seed: runSeed, report })
    } catch (error) {
      if (!(error instanceof RangeError)) throw error
      setResult({ error: error.message })
    }
  }

  return (
    <>
      <form noValidate onSubmit={run} className="mt-4 space-y-4">
        <fieldset>
          <legend>Strategies</legend>
          {strategies.map(({ id, name }) => (
            <label key={id} className="block">
              <input
                type="checkbox"
                checked={selectedIds.includes(id)}
                onChange={() => toggle(id)}
              />{' '}
              {name}
            </label>
          ))}
        </fieldset>
        <label className="block">
          Rounds{' '}
          <input
            type="number"
            min={1}
            max={1000}
            step={1}
            value={rounds}
            onChange={(e) => setRounds(e.target.value)}
            className="border border-ink px-1 font-mono"
          />
        </label>
        <label className="block">
          Seed (leave blank for a random seed){' '}
          <input
            type="number"
            min={0}
            max={4294967295}
            step={1}
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            className="border border-ink px-1 font-mono"
          />
        </label>
        <button type="submit" className="border border-ink px-2">
          Run
        </button>
      </form>

      {result && 'error' in result && (
        <p role="alert" className="mt-4">
          {result.error}
        </p>
      )}

      {result && 'report' in result && (
        <div className="mt-4">
          <p className="font-mono">Seed: {result.seed}</p>
          <LeaderboardFigure report={result.report} />
          <PairwiseFigure report={result.report} />
          <CooperationFigure report={result.report} />
          <OutcomeFigure report={result.report} />
        </div>
      )}
    </>
  )
}
