import { useEffect, useState, type FormEvent } from 'react'
import {
  listStrategies,
  playHumanMove,
  startHumanMatch,
  type HumanMatch,
  type MoveLetter,
} from './engine'

const strategies = listStrategies()
const HIDDEN = ''

const moveNames = { C: 'Cooperate', D: 'Defect' } as const
const moveColours = { C: 'text-cooperate', D: 'text-defect' } as const

function randomSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0]
}

/** Typing in a form control (the opponent select jumps by letter) must not play a move. */
function isFormControl(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && target.matches('input, select, textarea')
}

export default function Play() {
  const [opponentId, setOpponentId] = useState(HIDDEN)
  const [match, setMatch] = useState<HumanMatch | null>(null)
  const playing = match !== null && !match.over

  function start(event: FormEvent) {
    event.preventDefault()
    setMatch(startHumanMatch({ opponentId: opponentId || null, seed: randomSeed() }))
  }

  function play(move: MoveLetter) {
    setMatch((m) => (m && !m.over ? playHumanMove(m, move) : m))
  }

  useEffect(() => {
    if (!playing) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return
      if (isFormControl(event.target)) return
      const move = event.key.toUpperCase()
      if (move === 'C' || move === 'D') play(move)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [playing])

  return (
    <>
      <form onSubmit={start} className="mt-4 space-y-4">
        <label className="block">
          Opponent{' '}
          <select
            value={opponentId}
            onChange={(e) => setOpponentId(e.target.value)}
            className="border border-ink"
          >
            <option value={HIDDEN}>Hidden opponent</option>
            {strategies.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="border border-ink px-2">
          Start match
        </button>
      </form>

      {match && (
        <div className="mt-4 space-y-4">
          <p>Opponent: {match.opponent?.name ?? 'hidden'}</p>
          <p className="font-mono">
            Score: you {match.humanScore}, opponent {match.opponentScore}
          </p>
          <p>
            <button
              type="button"
              disabled={!playing}
              aria-keyshortcuts="C"
              onClick={() => play('C')}
              className="border border-ink px-2"
            >
              Cooperate
            </button>{' '}
            <button
              type="button"
              disabled={!playing}
              aria-keyshortcuts="D"
              onClick={() => play('D')}
              className="border border-ink px-2"
            >
              Defect
            </button>{' '}
            Keys: C cooperates, D defects.
          </p>
          {match.over && <p role="status">Match over after {match.rounds.length} rounds.</p>}
          <table className="border-collapse font-mono">
            <caption className="text-left">History</caption>
            <thead>
              <tr className="border-b border-ink">
                <th className="pr-4 text-left">Round</th>
                <th className="pr-4 text-left">You</th>
                <th className="text-left">Opponent</th>
              </tr>
            </thead>
            <tbody>
              {match.rounds.map(({ human, opponent }, i) => (
                <tr key={i}>
                  <td className="pr-4">{i + 1}</td>
                  <td className={`pr-4 ${moveColours[human]}`}>{moveNames[human]}</td>
                  <td className={moveColours[opponent]}>{moveNames[opponent]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
