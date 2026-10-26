# Teatro stage UX: the composition is not a Linotype page

Open for any mock, prototype, live patch visualization, interaction, or redesign request.

## Canonical experiential boundary

TeatroStageEngine owns the geometry, physics and camera of the **three-sided paper stage**: floor 30 x 20 units, walls 20 high, door to the right/rear, orthographic orbit/zoom, Fadenpuppe marionette rig, deterministic snapshots. Its specs use paper `#f4ead6`, ink `#111111`, hairline geometry and soft non-volumetric illumination. Recheck `Fountain-Coach/TeatroStageEngine/spec/` before coding; these example constants are not a substitute for current specs.

Teatro Stage Web uses React/TypeScript and Three.js with Cannon-ES (source `Fountain-Coach/midi2-gpu-fabric/apps/teatro-stage-web/src/**`). The current host exposes `ThreeStageView`, StageEngine snapshots and a small diagnostic panel. The older `src-legacy/**` is reference-only. The implementation may have incomplete MIDI/CI paths; do not infer a native MIDI 2.0 connection from a string called `midi2` in a UI or a wrapper of MIDI 1 messages.

`TeatroStageEngine/spec/authoring/teatro-stage-editor.md` calls for:
- **Stage view** dominating the canvas; orbit by dragging empty space, zoom via wheel/pinch; manipulate declared physical actors rather than arbitrary geometric parts.
- **Time bar** for playhead, bounded record, scrub, source-addressed snapshots; never an invented DAW multitrack timeline.
- **Small inspector**, hidden by default, revealing selected semantic entity, relation, mapping, properties, capability negotiation, timing and evidence.

## How a cable-free Csound Teatro stage should feel

- A Scenario is the score. The stage visualizes **what exists and changes over time**: Sing's presence/source, the observed Ear field, Csound's resonant wind FIELD, independent output observation, and musical/spatial consequences. These are **proposed projections** until the actual stage engine supports the needed field primitives and runtime bindings.
- Relations are inferred **only from the authored admitted Scenario**, never from the physical proximity of figures. Auditory and semantic relations may use subtle in-scene marks, selectable halos or trajectories, but must not masquerade as literal cables or create extra instrument identities.
- A musician can select the wind field or a listening relation and inspect the exact predicate, ports, range, MIDI 2.0/Ci fact, source, selected endpoint and measured value without opening a control rack. A missing binding remains visibly unresolved, never animated as a fictitious signal.
- Motion and colour changes require real stage state or an explicitly labeled **design simulation**; play controls that are not bound to a runtime cannot claim audible output. Provide an accessible textual explanation of every important visual relation.
- No new puppet, WebGL engine, shader-based hidden model, UI-only music mapping or uncontrolled autopatcher. Extend the canonical stage spec only if the requested experience truly needs a new admitted primitive.

## Failure pattern to prevent

A dark rectangular HTML panel containing four instrument boxes, lines, a mapping inspector, status badges and a "live" button is a **Linotype-like technical document/mock**, even if its labels name Teatro. It can be useful as *documentation*, but it is **not** a Teatro stage projection. The difference is a source-backed scene and runtime in space/time, not just a palette swap.

## Proof on the requested surface

- **Visual-only request**: one canonical source-addressed scene or prototype using current stage source, correct room/camera/interaction, deterministic input/labelled simulated relations; no claim of audio or automatic MIDI-CI.
- **Live patch request**: actual admitted Scenario, original source, real Csound output and Ear evidence, typed MIDI 2.0 transport/correlation and bounded Stop. A pretty prototype is insufficient.
- **Book page request**: hand off the source-owned scene to Linotype; see [Linotype collaboration](linotype-handoff.md). Do not make the stage use the book's composition UI.
