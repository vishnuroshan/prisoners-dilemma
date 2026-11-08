export default function Introduction() {
  return (
    <>
      {/* TODO(source): who first posed the dilemma and the prisoner story. Commonly credited to Merrill Flood and Melvin Dresher (RAND, 1950) and Albert Tucker; not verified, so not stated. */}
      <p className="mt-4">
        The prisoner&rsquo;s dilemma describes two players who each do better by acting against the
        other, yet both do worse when both act that way. In the usual telling, two suspects are
        questioned in separate rooms. Each can stay silent or testify against the other. Testifying
        shortens a suspect&rsquo;s own sentence whatever the other does, but if both testify, both
        serve longer than if both had stayed silent.
      </p>
      <p className="mt-4">
        On this site, staying silent is the move Cooperate and testifying is the move Defect.
        Sentences become payoffs, set out in the <a href="#payoffs">Payoffs</a> section.
      </p>
      <p className="mt-4">
        In a single round, Defect is the better move whatever the opponent does. The iterated
        prisoner&rsquo;s dilemma repeats the round between the same two players over a match. A move
        can then be answered in the next round: a defection can be punished, and cooperation can be
        returned. Whether cooperation holds depends on the strategies that meet.
      </p>
      <p className="mt-4">
        The site is inspired by Robert Axelrod&rsquo;s computer tournament of the iterated
        prisoner&rsquo;s dilemma, reported in{' '}
        <cite>Effective Choice in the Prisoner&rsquo;s Dilemma</cite> (Journal of Conflict
        Resolution, 1980). Entrants submitted strategies, and Axelrod played them against one
        another.
      </p>
      {/* TODO(source): number of entries, match length, and round-robin format of the 1980 tournament. Not stated until checked against Axelrod (1980). */}
      <p className="mt-4">
        The tournament here is not the original field of entries. Several of its ten strategies were
        not entries in 1980; the <a href="#strategies">Strategies</a> section gives each one&rsquo;s
        origin. You choose which strategies take part and how many rounds each match lasts, and you
        can play a match against any of them yourself.
      </p>
    </>
  )
}
