// The engine keeps its payoff table internal (ADR 0001: four entry points), so the values are
// repeated here, once, from CLAUDE.md's game rules. Payoffs.test.tsx checks them against the engine.
const PAYOFF = { T: 5, R: 3, P: 1, S: 0 } as const
const { T, R, P, S } = PAYOFF

/** A payoff as the matrix shows it, for example `T = 5`. */
function label(symbol: keyof typeof PAYOFF): string {
  return `${symbol} = ${PAYOFF[symbol]}`
}

export default function Payoffs() {
  return (
    <>
      <p className="mt-4">
        In each round both players choose a move at the same time, without seeing the other
        player&rsquo;s move. The pair of moves decides each player&rsquo;s payoff. Each cell below
        lists your payoff first, then the opponent&rsquo;s.
      </p>

      <table className="mt-4 border-collapse font-mono">
        <caption className="text-left">Payoff matrix (you, opponent)</caption>
        <thead>
          <tr className="border-b border-ink">
            <td />
            <th scope="col" className="px-4 text-left">
              Opponent cooperates
            </th>
            <th scope="col" className="px-4 text-left">
              Opponent defects
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className="pr-4 text-left">
              You cooperate
            </th>
            <td className="px-4">
              {label('R')}, {label('R')}
            </td>
            <td className="px-4">
              {label('S')}, {label('T')}
            </td>
          </tr>
          <tr>
            <th scope="row" className="pr-4 text-left">
              You defect
            </th>
            <td className="px-4">
              {label('T')}, {label('S')}
            </td>
            <td className="px-4">
              {label('P')}, {label('P')}
            </td>
          </tr>
        </tbody>
      </table>

      <dl className="mt-4">
        <dt className="font-mono">Temptation (T) = {T}</dt>
        <dd className="pl-6">You defect while the opponent cooperates.</dd>
        <dt className="mt-2 font-mono">Reward (R) = {R}</dt>
        <dd className="pl-6">Both players cooperate.</dd>
        <dt className="mt-2 font-mono">Punishment (P) = {P}</dt>
        <dd className="pl-6">Both players defect.</dd>
        <dt className="mt-2 font-mono">Sucker&rsquo;s payoff (S) = {S}</dt>
        <dd className="pl-6">You cooperate while the opponent defects.</dd>
      </dl>

      <p className="mt-4">
        The values satisfy T &gt; R &gt; P &gt; S. Whatever the opponent does, defecting earns more
        in a single round: {T} instead of {R} against Cooperate, {P} instead of {S} against Defect.
        Yet two players who both defect earn {P} each, while two who both cooperate earn {R} each.
        That gap is the dilemma.
      </p>
      <p className="mt-4">
        The values also satisfy 2R &gt; T + S. Taking turns to exploit each other earns {T + S} over
        two rounds, less than the {2 * R} that steady mutual cooperation earns.
      </p>
      <p className="mt-4">
        A player&rsquo;s score is the sum of their payoffs over a match or a tournament. In a
        self-match only one side counts.
      </p>
    </>
  )
}
