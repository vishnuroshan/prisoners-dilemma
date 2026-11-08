import { useState, type FormEvent } from 'react'
import { CooperationFigure } from './charts/CooperationFigure.tsx'
import { LeaderboardFigure } from './charts/LeaderboardFigure.tsx'
import { OutcomeFigure } from './charts/OutcomeFigure.tsx'
import { PairwiseFigure } from './charts/PairwiseFigure.tsx'
import { listStrategies, runTournament, type TournamentReport } from './engine'
import { randomSeed } from './randomSeed.ts'

const strategies = listStrategies()

type RunResult =
  | { seed: number; rounds: number; strategyCount: number; report: TournamentReport }
  | { error: string }

const inputClass = 'mt-1 w-full border border-ink bg-paper px-2 py-1'

export default function Tournament() {
  const [selectedIds, setSelectedIds] = useState(() => strategies.map(({ id }) => id))
  const [rounds, setRounds] = useState('200')
  const [seed, setSeed] = useState('')
  const [result, setResult] = useState<RunResult | null>(null)
  const report = result && 'report' in result ? result : null

  function toggle(id: string) {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))
  }

  // The engine is the single validator, so native form validation is off (noValidate).
  function run(event: FormEvent) {
    event.preventDefault()
    const runSeed = seed === '' ? randomSeed() : Number(seed)
    try {
      const config = { strategyIds: selectedIds, rounds: Number(rounds), seed: runSeed }
      setResult({
        seed: runSeed,
        rounds: config.rounds,
        strategyCount: selectedIds.length,
        report: runTournament(config),
      })
    } catch (error) {
      if (!(error instanceof RangeError)) throw error
      setResult({ error: error.message })
    }
  }

  return (
    <div className="grid flex-1 gap-8 lg:min-h-0 lg:grid-cols-[16.25rem_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)]">
      <form noValidate onSubmit={run} className="flex flex-col gap-4 lg:min-h-0">
        <fieldset className="flex flex-col lg:min-h-0">
          <legend>Strategies</legend>
          <div className="mt-1 lg:min-h-0 lg:overflow-y-auto">
            {strategies.map(({ id, name }) => (
              <label key={id} className="flex min-h-7 items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(id)}
                  onChange={() => toggle(id)}
                  className="size-4 accent-ink"
                />
                {name}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block">
          Rounds
          <input
            type="number"
            min={1}
            max={1000}
            step={1}
            value={rounds}
            onChange={(e) => setRounds(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          Seed
          <input
            type="number"
            min={0}
            max={4294967295}
            step={1}
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            aria-describedby="seed-hint"
            className={inputClass}
          />
          <span id="seed-hint" className="mt-1 block text-sm text-muted">
            Leave blank for a random seed.
          </span>
        </label>
        <button type="submit" className="self-start border border-ink px-3 py-1">
          Run Tournament
        </button>
        <p role="status">
          {report &&
            `Tournament finished: ${report.strategyCount} ${report.strategyCount === 1 ? 'strategy' : 'strategies'}, ${report.rounds} rounds, seed ${report.seed}.`}
        </p>
        {result && 'error' in result && <p role="alert">{result.error}</p>}
      </form>

      {/* Borders between the quadrants draw the matrix cross; the outer edges stay open. */}
      <div className="grid *:border-ink max-lg:*:not-last:border-b lg:min-h-0 lg:grid-cols-2 lg:grid-rows-2 lg:*:nth-[-n+2]:border-b lg:*:odd:border-r">
        {report ? (
          <>
            <LeaderboardFigure report={report.report} />
            <PairwiseFigure report={report.report} />
            <CooperationFigure report={report.report} />
            <OutcomeFigure report={report.report} />
          </>
        ) : (
          <>
            <p className="p-4">
              Pick strategies, then press Run Tournament to fill these four charts.
            </p>
            {[1, 2, 3].map((quadrant) => (
              <div key={quadrant} className="hidden lg:block" />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
