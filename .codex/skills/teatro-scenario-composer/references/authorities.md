# Teatro source ownership, current verification, and drift

Read this reference on all scenario creation, implementation, and audit tasks. **Sources listed here are discovery starting points, not frozen acceptance evidence.** Inspect current branch, SHA, published Governance and runtime before editing or claiming correctness.

| Concern | Source authority / entrance | Not its authority |
| --- | --- | --- |
| FCIS semantics | `Fountain-Coach/Reframe-Refactoring/docs/151-csound-teatro-speaking-sound-in-space.md`; current publication at `https://governance.fountain.coach/chapters/151-csound-teatro-speaking-sound-in-space/` | An illustrator, renderer, prose prompt, generated Csound text |
| Transport-neutral MIDI 2.0 plane | `Fountain-Coach/Reframe-Refactoring/docs/150-one-midi2-instrument-plane-multiple-governed-transports.md` | Particular RTP/UDP binding as instrument identity |
| MIDI 2.0 and MIDI-CI implementation | `Fountain-Coach/midi2` (`Sources/MIDI2`, `Sources/MIDI2CI`, `MIDI2Transports`, and JavaScript companion) | Implicit audio-stream routing, universal hardware interoperation |
| Csound Teatro Scenario candidate | `Fountain-Coach/teatro.fountain.coach/scenarios/csound-teatro/composing-by-ear.live.json` | Native admission, real-time source bridge, Csound output acceptance |
| Existing bounded source validator | `Fountain-Coach/teatro.fountain.coach/scripts/csound-teatro/validate-scenario.mjs`, `check-scenario.mjs`, `package.json` script `check:csound-teatro` | Fully admitted native grammar parser or runtime effects |
| Stage semantics and specs | `Fountain-Coach/TeatroStageEngine/spec/**`, especially room, camera, rig, style, authoring, snapshots | Source interpretation or audio engine |
| Web stage host | `Fountain-Coach/midi2-gpu-fabric/apps/teatro-stage-web/src/**` with React/TypeScript, Three.js, Cannon-ES; source `src-legacy/**` reference-only | Authoritative semantic Scenario, published route, Linotype reader |
| Teatro umbrella | `Fountain-Coach/Teatro` (Swift Core, Audio, GUI and Telemetry; rendering and output family) | Replacement of the distinct `TeatroStageEngine` stage semantics |
| Source edition and browser Csound | `Fountain-Coach/teatro.fountain.coach` built `site/assets/book-csound-host.js`, edition metadata, Stage embed | The original `Sing` instrument; proof of live Sing-to-Ear PCM |
| Store and editorial authority | FountainStore/Reframe for source, evidence and editorial membership; Fountain Press for Linotype composition; EstatePublisher for static preview and publication | Ability of a static page to authorize instrument effects |

## Domain versus repository drift

On 2026-10-25, the served `https://teatro.fountain.coach/` root was observed as **Teatro Stage Web** while the default-branch `Fountain-Coach/teatro.fountain.coach/site/index.html` held a Linotype Bookshelf projection. The queried `/editions/stage/` and `/editions/first-hearing/` public URLs returned 404. This is a **point-in-time discrepancy**, not permission to rewrite one as the other or infer a deployment. Re-check route, active service, and relevant exact bytes before making claims or stage changes.

## Reuse decision

When a proposed visualization needs new stage concepts, start with the existing TeatroStageEngine specs and adapters; never fork a private WebGL/SVG stage authority. When a proposed relationship needs a new predicate, start with FCIS 151's versioned registry. When a new link needs a runtime connection, inspect the available transport/adapter first, not a new DSL. The project-specific mismatch between rendered pages and an active stage is a **projection choice**, not a reason to create another estate/publisher.

## Key links

- https://github.com/Fountain-Coach/TeatroStageEngine
- https://github.com/Fountain-Coach/midi2-gpu-fabric/tree/main/apps/teatro-stage-web
- https://github.com/Fountain-Coach/teatro.fountain.coach
- https://github.com/Fountain-Coach/Teatro
- https://github.com/Fountain-Coach/midi2
- https://github.com/Fountain-Coach/Reframe-Refactoring/blob/main/docs/101-teatro-stage-engine-semantic-scenography.md
- https://github.com/Fountain-Coach/Reframe-Refactoring/blob/main/docs/107-creating-the-canonical-teatro-stage-composition-layer.md
