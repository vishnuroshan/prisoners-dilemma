// The engine keeps its payoff table internal (ADR 0001: four entry points), so the values are repeated here from CLAUDE.md's game rules.
const T = 'T = 5'
const R = 'R = 3'
const P = 'P = 1'
const S = 'S = 0'

export default function Payoffs() {
  return (
    <>
      <p className="mt-4">
        In each round both players choose a move at the same time, without seeing the other&rsquo;s
        choice. The pair of moves decides each player&rsquo;s payoff. Each cell below lists your
        payoff first, then the opponent&rsquo;s.
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
              {R}, {R}
            </td>
            <td className="px-4">
              {S}, {T}
            </td>
          </tr>
          <tr>
            <th scope="row" className="pr-4 text-left">
              You defect
            </th>
            <td className="px-4">
              {T}, {S}
            </td>
            <td className="px-4">
              {P}, {P}
            </td>
          </tr>
        </tbody>
      </table>

      <dl className="mt-4">
        <dt className="font-mono">Temptation (T) = 5</dt>
        <dd className="pl-6">You defect while the opponent cooperates.</dd>
        <dt className="mt-2 font-mono">Reward (R) = 3</dt>
        <dd className="pl-6">Both players cooperate.</dd>
        <dt className="mt-2 font-mono">Punishment (P) = 1</dt>
        <dd className="pl-6">Both players defect.</dd>
        <dt className="mt-2 font-mono">Sucker&rsquo;s payoff (S) = 0</dt>
        <dd className="pl-6">You cooperate while the opponent defects.</dd>
      </dl>

      <p className="mt-4">
        The values satisfy T &gt; R &gt; P &gt; S. Whatever the opponent does, defecting earns more
        in a single round: 5 instead of 3 against Cooperate, 1 instead of 0 against Defect. Yet two
        players who both defect earn 1 each, while two who both cooperate earn 3 each. That gap is
        the dilemma.
      </p>
      <p className="mt-4">
        The values also satisfy 2R &gt; T + S. Taking turns to exploit each other earns 5 over two
        rounds, less than the 6 that steady mutual cooperation earns.
      </p>
      <p className="mt-4">
        A player&rsquo;s score is the sum of their payoffs over a match or a tournament. In a
        self-match only one side counts.
      </p>
    </>
  )
}
