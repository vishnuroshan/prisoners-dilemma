# Product Specification: Iterated Prisoner's Dilemma Web Application

## 1. Overview

This project aims to recreate Robert Axelrod’s famous 1980 Iterated Prisoner's Dilemma (IPD) computer tournament as an interactive, accessible web application. The platform will educate users on game theory, allow them to simulate tournaments among classic and novel algorithmic strategies, and enable them to play against these strategies themselves.

## 2. Core Objectives

- **Educate:** Provide a clear, concise explanation of the Prisoner's Dilemma and the significance of Axelrod's original experiment.
- **Simulate:** Build a robust, client-side tournament engine capable of running thousands of iterations instantly.
- **Analyze:** Generate insightful, data-rich charts mirroring the Key Performance Indicators (KPIs) from the original research.
- **Interact:** Allow users to step into the game and play against specific or random algorithms.
- **Design:** Maintain a highly minimalist, clean, and academic yet modern aesthetic (avoiding glowing, gradient-heavy "AI" tropes).

## 3. Game Mechanics & Payoff Matrix

The application will use the standard IPD payoff matrix. For any given round:

- **T (Temptation to Defect):** 5 points (Player Defects, Opponent Cooperates)
- **R (Reward for Mutual Cooperation):** 3 points (Both Cooperate)
- **P (Punishment for Mutual Defection):** 1 point (Both Defect)
- **S (Sucker's Payoff):** 0 points (Player Cooperates, Opponent Defects)

_Rule condition:_ $T > R > P > S$ and $2R > T + S$.
_Tournament setup:_ A round-robin tournament where every strategy plays every other strategy (including a clone of itself) for a set number of rounds (e.g., 200).

## 4. Player Programs (The Strategies)

### 4.1 Original Axelrod Tournament Strategies (Phase 1)

- **Tit for Tat (Anatol Rapoport):** Cooperates on the first move, then replicates the opponent's previous move.
- **Always Defect (ALLD):** Defects on every single turn.
- **Always Cooperate (ALLC):** Cooperates on every single turn.
- **Friedman / Grudger:** Cooperates until the opponent defects once, then defects forever.
- **Joss:** Plays like Tit for Tat, but randomly defects 10% of the time to try and exploit the opponent.
- **Random:** Flips a coin (50/50) to cooperate or defect.

### 4.2 Expanded / Modern Strategies (Phase 2)

- **Tit for Two Tats:** Forgiving version of Tit for Tat. Only defects if the opponent defects twice in a row.
- **Pavlov (Win-Stay, Lose-Shift):** If the last move resulted in 3 or 5 points, repeat the choice. If it resulted in 0 or 1 point, change the choice.
- **Detective:** Analyzes the opponent. Plays Cooperate, Defect, Cooperate, Cooperate. If the opponent ever retaliated with a Defect, it plays Tit for Tat. If the opponent never retaliated, it plays Always Defect.
- **Forgiving Tit for Tat:** Plays Tit for Tat, but occasionally (e.g., 5% of the time) cooperates after an opponent's defection to break cycles of mutual retaliation.

## 5. Application Features & User Flow

### 5.1 Landing & Education

- A brief, readable introduction to the dilemma (e.g., two criminals interrogated in separate rooms).
- Explanation of the payoff matrix.
- Introduction to Axelrod's tournament.

### 5.2 The Tournament Mode

- **Configuration:** User can select which bots to include in the tournament and set the number of rounds (default: 200).
- **Execution:** A prominent "Run Tournament" button. The engine runs the simulation instantly in the browser.
- **Results Dashboard:** Displays the charts and KPIs (detailed in Section 6).

### 5.3 Human vs. Bot Mode

- User selects an opponent from a dropdown (or chooses "Random / Hidden" for a blind test).
- User plays step-by-step using "Cooperate" or "Defect" buttons.
- Running score is displayed, comparing the human's performance to the bot's.

## 6. Analytics & KPIs (Data Visualization)

Based on Axelrod's findings, the results dashboard will feature the following charts:

1. **Total Score Leaderboard (Bar Chart):** The most fundamental metric. Who accumulated the most points across all match-ups?
2. **Pairwise Matchup Matrix (Heatmap):** A grid showing how many points Strategy A scored against Strategy B. This reveals which strategies are exploitative and which are mutually beneficial.
3. **Cooperation Rate Over Time (Line Chart):** Tracks the percentage of cooperative moves in the tournament as rounds progress. Does the environment devolve into defection or stabilize into cooperation?
4. **Distribution of Move Types (Pie/Doughnut Chart):** The percentage of turns that ended in Mutual Cooperation, Mutual Defection, or Betrayal across the whole tournament.

## 7. UI / UX Guidelines

To avoid the "AI-generated" look, the design will be intentionally stripped back, focusing on typography, whitespace, and clear data.

- **Color Palette:** Monochromatic base (Off-white background `#F9F9F9`, dark charcoal text `#1A1A1A`) with strict accent colors for the game states (e.g., Muted Blue for Cooperation, Burnt Orange/Red for Defection).
- **Typography:** A clean, geometric sans-serif (e.g., Inter, Helvetica Neue, or Roboto Mono for data tables to give a programmatic feel).
- **Layout:** CSS Grid-based. Distinct, sharp-cornered containers with subtle 1px borders instead of heavy drop shadows or glassmorphism.
- **Data Vis:** Clean, flat charts without 3D effects or excessive animations.

## 8. Technical Stack Recommendations

- **Frontend Framework:** React.js, Vue 3, or Svelte (Svelte is highly recommended for lightweight, vanilla-feeling bundles).
- **Styling:** Tailwind CSS (configured for strict, minimalist utility classes) or standard CSS Modules.
- **Tournament Engine:** Vanilla TypeScript. (All logic can run efficiently on the client-side; no backend database is required unless you want global human leaderboards later).
- **Charting Library:** Recharts (if React) or Chart.js for simple, customizable, flat charts.

## 9. Hosting & Deployment Strategy

Because the application relies heavily on client-side simulation (the user's browser runs the tournament engine), a traditional backend server is not required.

- **Primary Recommendation: Cloudflare Pages.**
  Since you already prefer the Cloudflare ecosystem, **Cloudflare Pages** is the absolute best fit. It is designed specifically for static sites and Single Page Applications (SPAs) built with React, Vue, or Svelte. It will pull your code directly from GitHub, build it, and deploy it across Cloudflare's global edge network for lightning-fast loading.

## 10. Quality Assurance & Testing Strategy

Mathematical accuracy is the highest priority for the tournament engine. The testing suite (e.g., using Vitest) must rigorously cover the game theory logic independently of the UI.

- **Unit Tests (The Core):**
  - _Payoff Matrix Validation:_ Assert that every combination of Cooperate/Defect yields the exact predefined point values.
  - _Strategy Isolation Tests:_ Feed mocked, static histories of past moves to each strategy program and assert their next move. For example, test that "Tit for Tat" correctly echoes a defection on turn 5 if the opponent defected on turn 4.
  - _Engine Integrity:_ Run a headless 200-round match between two deterministic bots (e.g., Always Cooperate vs. Always Defect) and assert the exact final score matches the mathematical absolute.
- **Property-Based Testing:**
  - Use a library like `fast-check` to fuzz the tournament engine with randomized move histories and round lengths to ensure no edge cases crash the score aggregator.
- **End-to-End (E2E) Tests:**
  - Use Playwright or Cypress to test the user flow. Automate a browser to select specific strategies, press run, and verify the charting library receives the correct data payload.

## 11. Repository Structure & Documentation

### 11.1 README.md

The README should serve as the entry point for both users wanting to understand the experiment and developers wanting to run it locally. It must include:

- **Project Title & Description:** A brief explanation of Robert Axelrod's 1980 experiment.
- **Live Demo:** Link to the Cloudflare Pages deployment.
- **Features:** List the tournament engine, available historical strategies, and the analytics dashboard.
- **Tech Stack:** (e.g., React, TypeScript, Vite, pnpm, Cloudflare Pages).
- **Local Setup:** Clear instructions to clone, install dependencies (`pnpm install`), run the dev server (`pnpm run dev`), and run the test suite (`pnpm test`).
- **Adding a Strategy:** A brief code snippet showing the standard interface required to build and inject a new custom strategy into the engine.

### 11.2 Project License

**MIT License.** Because the goal is to make this accessible to everyone, the MIT License allows students, educators, and other developers to freely read, fork, and learn from the implementation without restrictive legal friction.

### 11.3 Repository Management

To maintain code quality and encourage outside contributions, set up the following:

- **`.github/workflows/ci.yml`:** A GitHub Actions pipeline that automatically runs the test suite and linter on every push and pull request. This guarantees no one breaks the tournament math.
- **`CONTRIBUTING.md`:** A guide for developers outlining how to propose new features or add unique strategies by adhering to the defined TypeScript interface.
- **`eslint.config.js` and `.prettierrc`:** Enforce strict code formatting to ensure the codebase remains clean and readable as the project grows.

## 12. Next Steps for Development

1. **Engine Development:** Code the TypeScript models for the `Tournament`, `Match`, and `Strategy` interfaces.
2. **Test Driven Development (TDD):** Write the unit tests for the payoff matrix and base strategies before wiring them up.
3. **Bot Coding:** Implement the Phase 1 strategies.
4. **UI Scaffolding:** Build the basic layout and the Human vs. Bot interface.
5. **Tournament Integration:** Connect the engine to the UI and implement the chart rendering.
