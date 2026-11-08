import type { MoveLetter } from './engine'

// The engine keeps its payoff table internal (ADR 0001: four entry points), so the values are
// repeated here, once, from CLAUDE.md's game rules. Learn.test.tsx checks them against the engine.
export const PAYOFF = { T: 5, R: 3, P: 1, S: 0 } as const

/** A pair of moves, yours first: `CD` is you cooperate, they defect. */
export type MovePair = `${MoveLetter}${MoveLetter}`

const payoffs: Record<MovePair, readonly [number, number]> = {
  CC: [PAYOFF.R, PAYOFF.R],
  CD: [PAYOFF.S, PAYOFF.T],
  DC: [PAYOFF.T, PAYOFF.S],
  DD: [PAYOFF.P, PAYOFF.P],
}

const MOVES = ['C', 'D'] as const
const verbs = { C: 'cooperate', D: 'defect' } as const
const moveColours = { C: 'text-cooperate', D: 'text-defect' } as const

function Verb({ move }: { move: MoveLetter }) {
  return <span className={moveColours[move]}>{verbs[move]}</span>
}

interface PayoffMatrixProps {
  /** The cell to mark, or null for none. */
  highlighted: MovePair | null
  /** Screen-reader text for the marked cell, for example "last round". */
  highlightLabel?: string
  /** When set, cells take keyboard focus and report hover and focus (null on leaving). */
  onExplore?: (pair: MovePair | null) => void
  /** Set the cells larger, for the Play screen where the matrix is the play surface. */
  large?: boolean
}

/** The 2x2 payoff matrix: your moves as rows, theirs as columns, each cell "yours, theirs". */
export function PayoffMatrix({ highlighted, highlightLabel, onExplore, large }: PayoffMatrixProps) {
  const cellSize = large ? 'py-8 text-hero' : 'py-6 text-display'
  const explore = (pair: MovePair | null) => onExplore && (() => onExplore(pair))
  return (
    <table className="w-fit border-collapse">
      <caption className="mb-3 text-left text-sm">
        Payoffs for each pair of moves, yours first
      </caption>
      <thead>
        <tr>
          <td />
          {MOVES.map((they) => (
            <th key={they} scope="col" className="px-4 pb-2 text-center font-normal">
              They <Verb move={they} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {MOVES.map((you, row) => (
          <tr key={you}>
            <th scope="row" className="pr-4 text-left font-normal">
              You <Verb move={you} />
            </th>
            {MOVES.map((they, column) => {
              const pair: MovePair = `${you}${they}`
              const marked = pair === highlighted
              return (
                <td
                  key={they}
                  tabIndex={onExplore ? 0 : undefined}
                  onMouseEnter={explore(pair)}
                  onMouseLeave={explore(null)}
                  onFocus={explore(pair)}
                  onBlur={explore(null)}
                  // A fixed width keeps the bold marked cell from shifting the columns.
                  className={`w-[3.5em] px-2 ${cellSize} text-center whitespace-nowrap transition-colors -outline-offset-4 motion-reduce:transition-none sm:w-[4em] ${
                    column === 0 ? 'border-r border-ink' : ''
                  } ${row === 0 ? 'border-b border-ink' : ''} ${marked ? 'bg-mark font-bold' : ''}`}
                >
                  {payoffs[pair].join(', ')}
                  {marked && highlightLabel && <span className="sr-only">, {highlightLabel}</span>}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
