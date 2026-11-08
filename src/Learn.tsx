import { useState } from 'react'
import { listStrategies, type StrategyInfo } from './engine'
import { PAYOFF, PayoffMatrix, type MovePair } from './PayoffMatrix.tsx'

const strategies = listStrategies()
const { T, R, P, S } = PAYOFF

const explanations: Record<MovePair, string> = {
  CC: `Both cooperate: each player earns the Reward, ${R}.`,
  CD: `You cooperate and they defect: you get the Sucker’s payoff, ${S}, and they get the Temptation, ${T}.`,
  DC: `You defect and they cooperate: you get the Temptation, ${T}, and they get the Sucker’s payoff, ${S}.`,
  DD: `Both defect: each player earns the Punishment, ${P}.`,
}

export default function Learn() {
  const [explored, setExplored] = useState<MovePair | null>(null)
  const [strategy, setStrategy] = useState<StrategyInfo | null>(null)

  return (
    <div className="grid flex-1 gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,70ch)_minmax(0,1fr)]">
      <div className="max-w-text space-y-3">
        <p>
          Run tournaments between strategies for the iterated prisoner&rsquo;s dilemma, or play a
          match yourself. The site is inspired by Robert Axelrod&rsquo;s 1980 computer tournament.
        </p>
        {/* TODO(source): who first posed the dilemma and the prisoner story. Commonly credited to Merrill Flood and Melvin Dresher (RAND, 1950) and Albert Tucker; not verified, so not stated. */}
        <p>
          The prisoner&rsquo;s dilemma describes two players who each do better by acting against
          the other, yet both do worse when both act that way. In the usual telling, two suspects
          are questioned apart: staying silent is the move Cooperate, testifying against the other
          is the move Defect. Both move at once, and the pair of moves sets each player&rsquo;s
          payoff. Whatever the opponent does, Defect earns more in a single round, yet two players
          who both defect earn {P} each where two who cooperate earn {R}.
        </p>
        <p>
          The iterated game repeats the round over a match, so a defection can be punished and
          cooperation returned. A score is the sum of a player&rsquo;s payoffs; in a self-match only
          one side counts.
        </p>
        {/* TODO(source): number of entries, match length, and round-robin format of the 1980 tournament. Not stated until checked against Axelrod (1980). */}
        <p>
          Axelrod reported his tournament in{' '}
          <cite>Effective Choice in the Prisoner&rsquo;s Dilemma</cite> (Journal of Conflict
          Resolution, 1980): entrants submitted strategies, and he played them against one another.
          The ten strategies here are not the original field; several were not entries in 1980. This
          site was inspired by{' '}
          <a href="https://www.youtube.com/watch?v=mScpHTIi-kM">
            Veritasium&rsquo;s video on game theory and the prisoner&rsquo;s dilemma
          </a>
          .
        </p>
      </div>

      <div className="min-w-0">
        <PayoffMatrix highlighted={explored} onExplore={setExplored} />
        <p role="status" aria-label="Outcome explanation" className="mt-3 max-w-text">
          {explored
            ? explanations[explored]
            : 'Hover over or focus a cell to see what that outcome means.'}
        </p>

        <h3 className="mt-8 text-lg">Strategies</h3>
        <p className="mt-1 max-w-text">
          A strategy decides each move from the history of the match alone. It never knows how many
          rounds remain or which strategy it faces.
        </p>
        <ul
          aria-label="Strategies"
          className="mt-2 grid grid-cols-2 gap-x-6 text-sm sm:grid-cols-3"
        >
          {strategies.map((strategy) => (
            <li key={strategy.id}>
              <button
                type="button"
                onMouseEnter={() => setStrategy(strategy)}
                onMouseLeave={() => setStrategy(null)}
                onFocus={() => setStrategy(strategy)}
                onBlur={() => setStrategy(null)}
                className="min-h-6 text-left underline decoration-dotted underline-offset-2"
              >
                {strategy.name}
              </button>
            </li>
          ))}
        </ul>
        {/* Descriptions and origins show one at a time so the screen fits without scrolling. */}
        <div role="status" aria-label="Strategy explanation" className="mt-2 max-w-text text-sm">
          {strategy ? (
            <>
              <p>
                <b>{strategy.name}</b>: {strategy.description}
              </p>
              <p className="text-muted">{strategy.origin}</p>
            </>
          ) : (
            <p>Hover over or focus a strategy to see how it plays and where it comes from.</p>
          )}
        </div>
      </div>
    </div>
  )
}
