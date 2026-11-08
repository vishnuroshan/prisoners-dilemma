import { useState, type FormEvent } from 'react'
import { listStrategies, runTournament, type TournamentReport } from './engine'

const strategies = listStrategies()

type Outcome = { seed: number; report: TournamentReport } | { error: string }

function randomSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0]
}

export default function Tournament() {
  const [selectedIds, setSelectedIds] = useState(() => strategies.map(({ id }) => id))
  const [rounds, setRounds] = useState('200')
  const [seed, setSeed] = useState('')
  const [outcome, setOutcome] = useState<Outcome | null>(null)

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
      setOutcome({ seed: runSeed, report })
    } catch (error) {
      if (!(error instanceof RangeError)) throw error
      setOutcome({ error: error.message })
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

      {outcome && 'error' in outcome && (
        <p role="alert" className="mt-4">
          {outcome.error}
        </p>
      )}

      {outcome && 'report' in outcome && (
        <div className="mt-4">
          <p className="font-mono">Seed: {outcome.seed}</p>
          <table className="mt-2 border-collapse font-mono">
            <caption className="text-left">Leaderboard</caption>
            <thead>
              <tr className="border-b border-ink">
                <th className="pr-4 text-left">Rank</th>
                <th className="pr-4 text-left">Strategy</th>
                <th className="text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {outcome.report.leaderboard.map(({ strategyId, name, score }, _, entries) => (
                <tr key={strategyId}>
                  {/* Tied scores share a rank (entries are sorted highest first). */}
                  <td className="pr-4">{entries.findIndex((e) => e.score === score) + 1}</td>
                  <td className="pr-4">{name}</td>
                  <td className="text-right">{score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
