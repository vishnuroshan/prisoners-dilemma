import { useEffect, useState, type FormEvent } from 'react'
import {
  listStrategies,
  playHumanMove,
  startHumanMatch,
  type HumanMatch,
  type HumanRound,
  type MoveLetter,
} from './engine'
import { PayoffMatrix } from './PayoffMatrix.tsx'
import { randomSeed } from './randomSeed.ts'

const strategies = listStrategies()
// A <select> value is a string, so this option value stands for the null opponent id.
const HIDDEN_OPTION = ''

const pastTense = { C: 'cooperated', D: 'defected' } as const
const squareColours = { C: 'bg-cooperate', D: 'bg-defect' } as const

/** Typing in a form control (the opponent select jumps by letter) must not play a move. */
function isFormControl(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && target.matches('input, select, textarea')
}

function describeRound(index: number, { human, opponent }: HumanRound): string {
  return `Round ${index + 1}: you ${pastTense[human]}, they ${pastTense[opponent]}`
}

/** What the live region says after the latest round: the moves, the scores, and any reveal. */
function announcement(match: HumanMatch | null): string {
  const last = match?.rounds.at(-1)
  if (!match || !last) return ''
  const played = match.rounds.length
  const round = `${describeRound(played - 1, last)}. You ${match.humanScore}, opponent ${match.opponentScore}.`
  if (!match.over) return round
  return `${round} Match over after ${played} rounds. Your opponent was ${match.opponent?.name}.`
}

function Square({ move }: { move: MoveLetter }) {
  return (
    <span className={`grid size-5 place-items-center text-xs text-paper ${squareColours[move]}`}>
      {move}
    </span>
  )
}

/** One square per move, you above the opponent, with a text list for screen readers. */
function History({ rounds }: { rounds: readonly HumanRound[] }) {
  return (
    <div>
      <p id="history-label">History</p>
      <div className="mt-1 flex gap-2">
        <div aria-hidden="true" className="grid grid-rows-2 gap-0.5 text-xs text-muted">
          <span className="leading-5">You</span>
          <span className="leading-5">Opponent</span>
        </div>
        <ol aria-labelledby="history-label" className="flex min-h-10.5 flex-wrap gap-0.5">
          {rounds.map((round, i) => (
            <li key={i}>
              <span aria-hidden="true" className="grid grid-rows-2 gap-0.5">
                <Square move={round.human} />
                <Square move={round.opponent} />
              </span>
              <span className="sr-only">{describeRound(i, round)}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

const buttonClass = 'border px-3 py-1 disabled:border-muted disabled:text-muted'

export default function Play({ active }: { active: boolean }) {
  // null picks a Hidden opponent, as in HumanMatchOptions.
  const [opponentId, setOpponentId] = useState<string | null>(null)
  const [match, setMatch] = useState<HumanMatch | null>(null)
  const playing = match !== null && !match.over
  const last = match?.rounds.at(-1)

  function start(event: FormEvent) {
    event.preventDefault()
    setMatch(startHumanMatch({ opponentId, seed: randomSeed() }))
  }

  function play(move: MoveLetter) {
    setMatch((m) => (m && !m.over ? playHumanMove(m, move) : m))
  }

  useEffect(() => {
    if (!playing || !active) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return
      if (isFormControl(event.target)) return
      const move = event.key.toUpperCase()
      if (move === 'C' || move === 'D') play(move)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [playing, active])

  return (
    <div className="grid flex-1 gap-8 lg:min-h-0 lg:grid-cols-[16.25rem_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)]">
      <div className="flex flex-col gap-4">
        <form onSubmit={start} className="flex flex-col gap-4">
          <label className="block">
            Opponent
            <select
              value={opponentId ?? HIDDEN_OPTION}
              onChange={(e) =>
                setOpponentId(e.target.value === HIDDEN_OPTION ? null : e.target.value)
              }
              className="mt-1 block w-full border border-ink bg-paper px-2 py-1"
            >
              <option value={HIDDEN_OPTION}>Hidden opponent</option>
              {strategies.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="self-start border border-ink px-3 py-1">
            Start match
          </button>
        </form>
        {match && (
          <div className="space-y-2">
            <p>Opponent: {match.opponent?.name ?? 'hidden'}</p>
            {match.over && (
              <>
                <p className="text-sm text-muted">{match.opponent?.origin}</p>
                <p>Match over after {match.rounds.length} rounds.</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-6">
        <p className="text-xl">
          {match
            ? `You ${match.humanScore} / Opponent ${match.opponentScore}`
            : 'Start a match to play.'}
        </p>
        <PayoffMatrix
          highlighted={last ? `${last.human}${last.opponent}` : null}
          highlightLabel="last round"
        />
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <button
            type="button"
            disabled={!playing}
            aria-keyshortcuts="C"
            onClick={() => play('C')}
            className={`${buttonClass} border-cooperate text-cooperate`}
          >
            Cooperate (C)
          </button>
          <button
            type="button"
            disabled={!playing}
            aria-keyshortcuts="D"
            onClick={() => play('D')}
            className={`${buttonClass} border-defect text-defect`}
          >
            Defect (D)
          </button>
          <span className="text-sm text-muted">Keys: C cooperates, D defects.</span>
        </div>
        <History rounds={match?.rounds ?? []} />
      </div>
      <p role="status" className="sr-only">
        {announcement(match)}
      </p>
    </div>
  )
}
