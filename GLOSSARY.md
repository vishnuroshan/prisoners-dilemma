# Iterated Prisoner's Dilemma

An interactive, Axelrod-inspired environment where strategies compete in round-robin tournaments and a human can play against them.

## Language

### Play

**Move**:
A player's choice in a round: Cooperate or Defect.
_Avoid_: Action, choice, turn

**Round**:
One simultaneous exchange of moves between two players.
_Avoid_: Turn, iteration, step

**Match**:
A sequence of rounds between two players.
_Avoid_: Game, duel, bout

**Self-match**:
A match between a strategy and a clone of itself.
_Avoid_: Mirror match

**Tournament**:
A round-robin set of matches in which every selected strategy plays every other one and itself.
_Avoid_: Simulation, run, iteration

### Participants

**Strategy**:
A rule that decides a player's next move from the history of the match.
_Avoid_: Bot, program, algorithm, AI

**Player**:
One side of a match, held by either a strategy or the human.
_Avoid_: Bot, participant, contestant

**Human**:
The user, playing a match against a strategy.
_Avoid_: User (in game context), player one

**Hidden opponent**:
A strategy picked at random for a human match and revealed only when the match ends.
_Avoid_: Blind opponent, mystery bot

### Scoring

**Payoff**:
The points one player earns from one round: Temptation (5), Reward (3), Punishment (1), or Sucker's payoff (0).
_Avoid_: Reward (as a general term), points per turn

**Score**:
The sum of a player's payoffs over a match or a tournament. In a self-match only one side counts.
_Avoid_: Points total, fitness

**Outcome**:
The result of a round: Mutual Cooperation, Mutual Defection, or Betrayal (one cooperates, one defects).
_Avoid_: Result, move type
