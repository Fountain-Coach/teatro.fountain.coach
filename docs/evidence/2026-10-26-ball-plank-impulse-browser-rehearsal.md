# Ball / Plank / Impulse — independent browser source and audio witness

**Date:** 26 October 2026  
**Scope:** owner Mac, isolated source Git worktrees, private `localhost:5188` development rehearsal. **Not** owner-WLAN staging, **not** public publication, **not** physical iPad acceptance, **not** native governed Scenario admission.

## Source ownership

- Canonical Scenario candidate: [`ball-plank-impulse-synth.live.json`](../../scenarios/csound-teatro/ball-plank-impulse-synth.live.json) on `codex/teatro-ball-plank-impulse-20261026`; status `candidate-unadmitted`, grammar 0.1, identity `teatro.ball-plank-impulse-synth-ab.rehearsal.01`.
- Existing ADSR synth retained from `Fountain-Coach/midi2-gpu-fabric@83d9fc27a8f4cba8a5c2aa63cca81f53d9d19573`.
- New **web rehearsal implementation**: `Fountain-Coach/midi2-gpu-fabric` branch `codex/teatro-ball-plank-audio-stage-20261026`, source latest `48d316a623f94902b289302288b9067d9a097531`.
- No new Csound orchestra, no second WebAudio synthesizer, no new publisher, no custom non-0.1 predicate. Existing Csound 12 synth voices, A/B patch graphs, crossfade, Ear and stop are reused.
- Stage uses existing Three.js/Cannon-ES Teatro web stack and canonical Teatro room vocabulary. Ball/Plank collision events are derived from physics, not camera rotation.

## Checks

- Vite production build: **PASS** (57 transformed modules; chunk size warning remains).
- Focused Vitest: **13/13 PASS**, including 4 source impact-mapping tests, 6 existing synth patch model tests and 3 original Csound source tests.
- TypeScript `--noEmit`: historical unrelated errors remain in `src/engine/physics.ts`, `src/engine/puppetRig.ts`, `src/reframe`, `src/ui/StageView.tsx`; **no newly introduced source-path errors** in `ImpulseStageView.tsx`, `impulseMapping.ts` or `SynthDeck.tsx` were reported.
- Browser: headless **Google Chrome** on owner Mac, 1180 × 820 desktop performance; portrait viewport 820 × 1180 was also tested with document scroll width exactly 820 and a visible 764 px wide Stage. This is **not** native physical iPad Safari proof.
- Camera ORBIT while no ball has fallen: contact counter stayed 0; no unsolicited Csound excitation.
- Scene A: real Cannon contact receipt `collision.a.1`. With the original Csound AudioWorklet running, independent Ear showed measured PCM **RMS 0.0438** and **peak 0.0925** in the two-world acceptance.
- Scene B **isolated test**: crossfade slider value **100 (B)**; pre-run A contact absent; deliberate B drop produced `collision.b.1`; **A contact remained null**, and Ear independently observed real output **RMS 0.0933**, **peak 0.2388**. This distinguishes B's own Csound output from another A bounce.
- Clone selected A/B patch and Soft Mutate were operated without a page failure; source controls remained the existing A/B/Csound controls. No quantitative fidelity witness for physical mutation timing is claimed.
- Stop closed the browser output context and the UI independently read back **RMS 0.0000 / peak 0.0000**; no uncaught browser exceptions in final independent B test.
- The first browser attempt missed a physical contact because the physics clock was coupled to the render loop. This was **not accepted**. Physics was then separated from rendering (120 Hz fixed step, 60 Hz timer, bounded catchup, no hidden-tab event burst), the source was rebuilt and the subsequent A/B browser witnesses above passed.
- Source screenshot at `/Users/benedikteickhoff/Developer/teatro-ball-plank-stage-20261026/impulse-stage-evidence-v2.png` documents visual staging only; it is **not** a published or user-distributable screenshot.

## Claim boundary

**Supported:** authored full Scenario 0.1 candidate; real browser audio from actual A and B physics events into existing Csound AudioWorklet and Ear observation; camera remains silent; bounded Stop returns silent Ear; responsive desktop/portrait smoke test.

**Not supported:** the universal native Csound Teatro grammar parser or admission receipt, typed FountainStore terminal proof, hardware MIDI2 or MIDI-CI negotiation, physical iPad Safari trusted HTTPS/gesture acceptance, independently measured Apple audio-session interrupt behavior, production or owner-WLAN staging publication, or a source-addressed playable insertion into N.'s story.

The source checker for the original Composing-by-Ear fixture is NOT reused as a false native admission certificate. The next true boundary is the native Scenario admission and physical iPad witness, followed by optional story/Press handoff.

## Story reuse

The supplied 14-page raster edition of N.'s *Outside Has No ViewBox* was read for later compositional placement, not edited. See [the source-addressed four-stop insert **proposal**](../proposals/2026-10-26-ball-plank-outside-inserts.md). Exact Linotype manuscript identity and provenance must be resolved before any insertion or publication. No song audio or quotation has been imported.
