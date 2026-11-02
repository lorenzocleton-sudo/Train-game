# Last Train — Art Style

Follow this for every visual from the very first scene. When in doubt: warm world, cold Dusk, readable on a phone.

## Vibe
Golden-hour melancholy. A beautiful, overgrown, empty world in warm light, the cozy safety of the train, and a cold black wall creeping in behind you. Quiet loneliness that turns into panic when the horn sounds.

## Rules
- **Look:** mid-poly stylized 3D, fixed isometric camera. Simplified but not blocky.
- **Shapes:** rounded edges and soft bevels. Cars, houses and props readable by silhouette alone. No razor-sharp low-poly facets, no tiny realistic details.
- **Textures:** hand-painted or simplified surfaces. Rust, dirt and moss painted in broad strokes, never photo textures.
- **Palette:** the world in warm, slightly faded golds, overgrown greens and rusted oranges. The train interior warmer and cozier than outside. The Dusk is deep black-purple with a faint glowing edge: **the ONLY cold colour in the game**.
- **Lighting:** low sun with long shadows. Mostly baked or faked for performance; one real-time light only, for the Dusk effect. Warm haze/fog.
- **Readability:** lootable objects glow softly; enemies (shadow creatures) are dark silhouettes with glowing eyes; doors and exits are lit.
- **Interiors:** roofs fade out when the player walks inside.
- **Assets:** one or two stylized post-apocalyptic packs from the same artist, in .glb (from Fab or similar). Never mix artists. Uniqueness comes from lighting, colour grading and the Dusk.
- **UI:** minimal and readable on a phone, warm cream text on dark translucent panels, tap targets at least 48 px.
- **Performance comes first:** if a visual choice breaks 30 fps on a budget Android phone, simplify it and note it in `docs/PROGRESS.md`.

## Screen layout
**Looting**
- Top: Dusk distance meter and horn timer.
- Top corner: weight bar.
- Bottom left: joystick.
- Bottom right: attack and context interact button.
- Edge arrow to the train when it is off screen.

**Train**
- Carriages side by side, swipe to scroll, tap a carriage for build mode.
- Bottom bar: Build, Crew, Craft, Map.
- Top: fuel, food, scrap, weight vs engine limit.

## How the current code implements this
All colours and light values live in `src/data/scene.json` (`palette`, `lighting`, `fog`).

| Rule | Implementation |
|---|---|
| Hand-painted textures | `src/render/paintedTexture.ts`: canvas texture with large soft colour patches and broad strokes (placeholder until the asset pack). Seeded, so it looks the same every load. |
| Soft bevels | `RoundedBoxGeometry` for placeholder props. |
| Low sun, long shadows | Directional sun at ~14° elevation (shadow ≈ 4× object height), shadow map rendered **once** (`shadowMap.autoUpdate = false`), i.e. baked at load. Shadows fall toward the Dusk. |
| One real-time light | The Dusk's pulsing violet `PointLight`; the only light that changes per frame. |
| Warm haze | `THREE.Fog` in warm haze colour + warm CSS vignette (`#grade`) as a free colour grade. |
| Dusk = only cold colour | `src/render/dusk.ts` shader: black-purple body, faint violet glowing, breathing edge. Not affected by fog, so it stays cold. Nothing else may use blue/violet hues. |
| UI | `--ui-text` cream, `--ui-panel` dark translucent, `--ui-tap-min: 48px` in `src/style.css`. |

## Checklist for every screenshot
1. Is anything other than the Dusk blue, violet or cold grey? Fix it.
2. Do shadows read long and warm-tinted, not black?
3. Are surfaces calm broad strokes, not noisy or photographic?
4. Can every object be read by silhouette alone at phone size?
5. Is UI text cream on dark translucent panels, and are tap targets ≥ 48 px?
