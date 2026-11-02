# Progress

## Done
- **Step 1 — project setup and first scene**
  - Vite + TypeScript (strict) + Three.js; Vitest unit tests; Playwright smoke test (portrait + landscape phone).
  - Folders: `src/core` (rules, no Three.js), `src/render`, `src/ui`, `src/data`, `public/assets`, `tests`, `docs`.
  - First scene: painted gold/green ground, softly bevelled rust cube, fixed isometric orthographic camera,
    low golden sun with a long baked-once shadow, warm fog + vignette, Dusk placeholder strip on the left
    (black-purple, breathing violet edge, the one real-time light), fps counter.
  - Fills the screen in portrait and landscape (`fitFrustum` keeps `viewSize` world units across the shorter side).
  - CI: typecheck, unit tests, build and Playwright on every PR. On every push to `main` the build is pushed to the
    `gh-pages` branch (GitHub Pages serves it) and Playwright opens the live URL and uploads screenshots.
  - Pages deploys from the `gh-pages` branch: enabling Pages with source "GitHub Actions" was not possible
    (API blocked from the dev sandbox; `GITHUB_TOKEN` may not create a Pages site), but pushing `gh-pages` enabled it automatically.

## Next
- Step 2 (proposal): player character with virtual joystick (bottom left), touch-first movement on the ground plane.
- Pick the stylized post-apocalyptic .glb asset pack (one artist) and add a loader in `src/render`.
- Measure fps on a real budget Android phone and record it here.

## Known bugs / notes
- fps shown in CI/headless screenshots comes from software rendering (SwiftShader) and is not representative of phones.
- Bundle is ~540 kB (136 kB gzip), mostly Three.js. Fine for now; tree-shake/split later if load time on mobile is slow.
- Performance choices: pixel ratio capped at 1.5, MSAA off on high-DPI screens, Lambert materials, shadow map rendered once.
