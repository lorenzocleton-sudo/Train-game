# Last Train — Game Design Plan

> Note: the original Tech section (Unity, URP) and any Unity Asset Store mentions are overruled.
> The stack is TypeScript (strict) + Three.js + Vite, played in a mobile browser. See `CLAUDE.md`.

## Vision and essence

Logline: The world is being swallowed by a living darkness called the Dusk. You live on the last moving train: build it into a home, step off to loot abandoned towns, and get back aboard before the horn blows.

Genre: Isometric survival roguelite with train base-building. Mobile first (Android and iOS), portrait or landscape to be tested, 10 to 20 minute runs split into short stops.

Vibe: Golden-hour melancholy. A beautiful, overgrown, empty world in warm light, the cozy safety of the train, and a cold black wall creeping in behind you. Think quiet loneliness that turns into panic when the horn sounds.

### Design pillars
1. Greed versus survival. Every stop asks one question: one more house, or run back now?
2. The train is home. Building and decorating it should feel personal and safe, the opposite of the world outside.
3. Weight has a cost. Every carriage makes the train slower, so growth always brings the Dusk closer.
4. Readable at a glance. Phone screen first: clear silhouettes, glowing loot, one cold colour for danger.

Target player: Mobile players who like survival and base-building (fans of games like Dysmantle or Last Day on Earth) but want shorter sessions and a clear goal instead of an endless grind.

## World and story

The Dusk appeared without warning and rolls across the continent, swallowing everything it touches. Rail lines are the only routes still open, because the old trains can outrun it, barely.

- The player: a lone engineer who finds an abandoned locomotive at the start of the game.
- The goal: reach the Terminus, a rumoured city at the end of the line where the Dusk supposedly cannot enter.
- Storytelling: told through found notes, radio messages and survivor dialogue, never long cutscenes. Players who skip it still understand the game.
- The mystery: each act reveals more about what caused the Dusk. The final act answers whether the Terminus is real.

### Acts and biomes
| Act | Biome | Mood | New threat |
|---|---|---|---|
| 1 | Golden farmland and villages | Calm, lonely | Slow shadow crawlers |
| 2 | Flooded towns and bridges | Uneasy | Fast stalkers, broken track to repair |
| 3 | Overgrown city | Dense, tense | Hordes, rival scavengers |
| 4 | Burning forest to the Terminus | Desperate | The Dusk itself speeds up |

## Game loop

The core loop repeats at every station, and the horn run is its peak moment; the meta loop carries progress between runs.

### Core loop, step by step
1. Ride the line: manage crew, craft, handle random events while travelling.
2. Choose a stop: pick from 2 or 3 stations based on what the train needs.
3. Loot on foot: explore the map while the Dusk approaches.
4. Horn blows, run back: the tension peak. Greed versus survival.
5. Build and upgrade: turn loot into carriages, stations and gear.
6. Depart: the train's weight decides how much buffer you have before the next stop.

### Meta loop
When the Dusk catches the train, the run ends. Blueprints and memories carry over, so each new run starts slightly stronger and reaches further toward the Terminus.

## The train base

The train is a real, walkable base: you place stations on a grid inside each carriage, attach new carriages, and upgrade the engine. It is the only safe place in the game.

### Carriages
| Carriage | What it does | Unlock |
|---|---|---|
| Engine | Speed, Dusk buffer, how many carriages you can pull | Start |
| Crew car | Beds for survivors, morale | Start |
| Workshop | Craft weapons, tools, repair kits | Start |
| Cargo car | Storage space, so you can carry more loot | Act 1 |
| Kitchen | Turns raw food into meals, keeps crew healthy | Act 1 |
| Greenhouse | Grows food slowly while moving | Act 2 |
| Fuel refinery | Turns scrap and wood into fuel | Act 2 |
| Infirmary | Heals injured survivors | Act 2 |
| Turret car | Defends against attacks while moving | Act 3 |
| Radio car | Finds better stations and story signals | Act 3 |

### Building rules
- Each carriage has a fixed grid. You place stations (stove, bed, workbench, storage, generator) and decorations.
- Stations need power from a generator, so layout planning matters.
- Some stations get bonuses from neighbours, for example the kitchen next to the crew car raises morale.
- Decorations have no stats but make the train feel like home, which also gives players something to show off.

### The weight trade-off
Every carriage and heavy station adds weight. More weight means a slower train, so the Dusk is closer at every stop and you get less looting time. Engine upgrades raise the limit. This single rule stops players from building endlessly and ties base-building to the core tension.

## Looting

At each station you step off the train and explore a village, town or city block on foot, controlling your character directly, until the horn tells you to run back.

### Map types
| Map | Size | Time to clear | Loot | Danger |
|---|---|---|---|---|
| Village | Small | 2 to 3 min | Food, wood, basic scrap | Low |
| Town | Medium | 4 to 6 min | Tools, fuel, medicine | Medium |
| City block | Large | 6 to 10 min | Rare parts, blueprints, survivors | High |

The player picks the next stop from 2 or 3 options on a route map, based on what the train needs. Times are design targets, to be tuned in playtests.

### How maps are built
- Hand-made chunks, assembled randomly. Buildings and street sections are designed by hand (for example 20 houses, 10 shops, 8 street layouts) and combined differently every run.
- Every map feels designed, but no two stops are identical.
- Interiors open up when you enter, with the roof fading out, which is standard for isometric games.

### The horn timer
- The Dusk is visible on the horizon the whole time, getting closer.
- First horn: a warning. Second horn: the train starts rolling slowly.
- Get back in time and you keep everything. Miss it and you lose what you carried, plus an injured survivor or a costly rescue.

### Enemies
- Shadow creatures that grow stronger and more frequent as the Dusk approaches.
- Rival scavengers from Act 3, who compete for loot.
- Enemies are dark silhouettes with glowing eyes, readable on a small screen.

### Controls
- Left thumb: virtual joystick to move.
- Right thumb: one attack button with auto-aim, one interact button that changes by context (loot, open, pick up).
- Hold to search containers. Inventory opens as a simple grid, and weight limits what you carry.
- Survivors can follow you as companions or stay to guard the train.

## Survivors and run structure

Survivors give the train life and the player something to lose; a run is one attempt to reach the Terminus, ending in arrival or the train falling to the Dusk.

### Survivors
- Found in towns and cities, or flagging down the train during events.
- Each has one trait, for example Mechanic (faster building), Scout (sees loot through walls), Medic, Cook, or Coward (runs back early).
- Needs: food, a bed and morale. Neglect them and they work slower or leave.
- Jobs: assign them to stations on the train, or bring one along when looting.
- They can be injured or die permanently within a run, which gives every risky stop real stakes.

### Run structure
- One run = 4 acts, about 6 to 8 stops per act.
- Each act ends at a large station event, for example holding the train together while track is repaired with the Dusk closing in.
- Between stops: travel scenes with random events (a stranger on the track, a fire in a carriage, a creature aboard), each with a choice.
- If the train is caught, the run ends. You keep blueprints and memories (permanent perks) for the next run.

### Meta progression
- Blueprints: unlock new carriage types and stations for future runs.
- Memories: small permanent perks, for example start with an extra survivor or a faster engine.
- Starting trains: unlockable locomotives with different playstyles, such as a heavy armoured train or a light, fast one.
- Story: each completed act reveals more of the Dusk mystery.

## Art style, audio and screen layout

The look is mid-poly stylized 3D with a fixed isometric camera: simplified but not blocky shapes, soft hand-painted textures, and golden-hour lighting doing most of the work. Full rules: `docs/STYLE.md`.

### Art rules
- Shapes: rounded edges and soft bevels. Cars, houses and props readable by silhouette alone. No razor-sharp low-poly facets, no tiny realistic details.
- Textures: hand-painted or simplified surfaces. Rust, dirt and moss painted in broad strokes, not photo textures.
- Palette: the world in warm, slightly faded golds, overgrown greens and rusted oranges. The train interior warmer and cozier. The Dusk is deep black-purple with a faint glowing edge, the only cold colour in the game.
- Lighting: low sun with long shadows. Mostly baked for performance, one real-time light for the Dusk effect.
- Readability: lootable objects glow softly, enemies are dark silhouettes with glowing eyes, doors and exits are lit.
- Assets: one or two stylized post-apocalyptic packs from the same artist (Fab, .glb) so the style stays consistent. Make the game unique through lighting, colour grading and the Dusk.

### Audio
- Train rhythm on the rails as the comforting base sound.
- Quiet ambient music while looting, rising in intensity as the Dusk gets closer.
- The horn is the signature sound: instantly recognizable, slightly scary.
- Muffled, distorted sounds near the Dusk edge.

### Screen layout
Looting screen:
- Top: Dusk distance meter and horn timer.
- Top corner: inventory weight bar.
- Bottom left: movement joystick.
- Bottom right: attack button and context interact button.
- Edge arrow pointing to the train when it is off screen.

Train screen:
- Side view or isometric view of the carriages, swipe to scroll along the train.
- Tap a carriage to enter build mode on its grid.
- Bottom bar: Build, Crew, Craft, Map.
- Top: fuel, food, scrap and weight versus engine limit.

Route map:
- Line with the next 2 or 3 station choices, each showing map type, expected loot and danger.
- The Dusk position drawn behind the train.

## Tech (OVERRULED)

~~Unity, URP.~~ Replaced by TypeScript (strict) + Three.js + Vite, deployed to GitHub Pages. What still applies:

- Performance targets: 30 fps on budget Android phones, with low, medium and high graphics settings.
- Techniques: baked lighting, LODs, texture compression, culling (the fixed camera helps), limited grass density on low settings.
- Saves: local save plus optional cloud save later.

## Monetization
- Free download with Act 1 playable, then a one-time unlock for the full game (about $3 to $5). No energy timers, no pay-to-win.
- Cosmetic train skins later if players ask for them.

## MVP (prove the fun first)
- Isometric camera and one stylized asset pack
- One train with 3 carriages: engine, crew car, workshop
- Grid building inside carriages with 5 stations
- One village map built from 6 to 8 chunks
- Walk, loot, one enemy type, the horn timer and the run back
- Weight trade-off working between train and Dusk distance
- Tested on a cheap Android phone

Kill test: if the run back to the train when the horn blows is not exciting after about 10 playtests, rework the core before adding content.

## Roadmap after the MVP
1. Vertical slice: Act 1 complete with survivors, events and 8 to 10 carriage stations.
2. Closed test with friends and a small community (Discord).
3. Acts 2 to 4, meta progression and story.
4. Soft launch in a few countries, tune balance, then global release.

## Risks
| Risk | Why it matters | Mitigation |
|---|---|---|
| Scope | Two games in one: base builder plus action looter | Strict MVP, cut features before adding |
| Touch controls | Joystick plus combat plus inventory often feels bad on phones | Auto-aim, one attack button, big tap targets |
| Performance | Detailed 3D on budget Android phones | Test on a cheap phone from day one |
| Mixed asset styles | Packs from different artists clash | One or two packs from the same artist |
| Name conflict | A game called Last Train Home exists (not verified) | Check stores and trademarks; alternatives: Duskline, Outrun the Dusk, Night Rail |
