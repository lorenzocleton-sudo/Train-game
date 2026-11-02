# Last Train — project rules (read every session)

Browser-based 3D mobile game. Design: `docs/DESIGN.md`. Visuals: `docs/STYLE.md`. Status: `docs/PROGRESS.md`.

## Rules
- TypeScript strict. Three.js only in `src/render`.
- `src/core` = game rules in plain TypeScript, never imports Three.js or the DOM. `src/ui` = HUD and touch controls. `src/data` = all tuning numbers as JSON.
- Mobile first: 30 fps on a budget Android phone.
- Every gameplay number in `src/data/*.json`, never hard-coded.
- A Vitest test for every game rule (`tests/unit`).
- Follow `docs/STYLE.md` for all visuals; the Dusk is the only cold colour.
- Touch controls first, keyboard only for testing.
- Build only the current step; update `docs/PROGRESS.md`.

## Before finishing
1. `npm run typecheck`
2. `npm test`
3. `npm run build && npm run e2e` (screenshots land in `screenshots/`)
4. Look at the screenshots yourself, check them against `docs/STYLE.md`, fix what looks wrong or off-style.
5. Open a pull request.

## Commands
- `npm run dev` — local dev server (`/Train-game/`).
- `npm run build` — typecheck + production build into `dist/` (Vite `base` = `/Train-game/` for GitHub Pages).
- `npm run e2e` — Playwright against `vite preview`; set `BASE_URL` to test a deployed URL instead.

## Deploy
- `.github/workflows/ci.yml`: on pull requests — typecheck, tests, build, Playwright smoke test.
- `.github/workflows/deploy.yml`: on push to `main` — build, push `dist/` to the `gh-pages` branch (Pages serves it), then Playwright smoke test against the live URL.
- Live: https://lorenzocleton-sudo.github.io/Train-game/
