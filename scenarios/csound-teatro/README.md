# Csound Teatro Scenario — Composing by Ear (live candidate)

**25 October 2026.** This is a **source candidate**, not a new FCIS instrument,
an admitted Scenario, or a live Csound execution receipt.

## Authority and decision

[Governance 151 — Csound Teatro: Speaking Sound in Space](https://governance.fountain.coach/chapters/151-csound-teatro-speaking-sound-in-space/)
states the Csound Teatro semantic grammar **0.1** and separates authorial
relation, typed ports, mapping, Scenario admission, engine execution,
MIDI 2.0 operation and Ear verification. The published chapter explicitly
describes its status as a proposal grounded in the initial Ball/Plate/Ear
fixture. We have not located an accepted executable grammar parser and native
admission driver in the currently inspected repos; the only current
`Fountain-Coach/domain-reasoning` `CsoundTeatroExecutionRequest` is a typed
admission-plan seam whose `UnconnectedCsoundTeatroDriver` refuses execution.

**Decision:** The requested live composition uses *existing* grammar 0.1
predicates `LISTENS_TO`, `MODULATES`, and `MAPS_TO`, with typed properties,
source and target domains, units, clamp, event timing, and Scenario constraints.
This **does not establish a vocabulary gap**, so we MUST NOT add new DSL
predicates or invent another MIDI 2.0 control language merely to make the
example work. If a subsequent native adapter demonstrates a missing semantic
construct, extend the owning grammar/version **before** adding engine code
that depends on that construct.

The versioned JSON in [composing-by-ear.live.json](composing-by-ear.live.json)
is a **candidate machine-readable projection** of that documented grammar.
The authoring check
`scripts/csound-teatro/validate-scenario.mjs` validates a bounded subset
for this one example; it is NOT the normative full grammar parser, a Scenario
Runner, an FCIS-KIT, a capability admission decision or runtime authority.

## Live patch roles

- **Sing.01** — independent `Fountain-Coach/sing` FCIS instrument,
  source `SingVoice.RealtimeSinger`. A physical/current PCM output must be
  connected to Ear, not loaded from `articulated.wav` or another recording.
- **Ear.Sing.01** — FCIS observing instrument listening to live Sing.
  Its actually measured RMS is a numeric source; the shipped note 48 is a
  fixed placeholder, therefore ignored.
- **Wind.Field.01** — a declared FIELD, with Csound engine
  `BookCsoundHost`. It is neither Sing nor an independently invented
  FCIS instrument. The Scenario targets the existing `wind_mix` port.
- **Ear.Wind.01** — a separate output observation; its audio measurement
  does not silently feed back into the source mapping.
- **Csound Teatro Scenario** — the authority over the relationship and
  mapping, not a fifth instrument.
- **MIDI 2.0** — the existing owned 64-bit UMP Channel Voice CC74 event plane,
  group 0, channel 0, with full-width controller value, source identity,
  ordered sequence and bounded update rate. No parallel JSON command plane,
  CoreMIDI or MIDI 1 fallback.

## Canonical meaning as grammar 0.1 projection

```text
Ear.Sing.01 LISTENS_TO Sing.01

Ear.Sing.01 MODULATES Wind.Field.01

Ear.Sing.01.rms 0..0.2 normalized-linear-rms
  MAPS_TO
Wind.Field.01.wind_mix 0.25..1 normalized
  [linear, clamp, event, 75 ms]

Ear.Wind.01 LISTENS_TO Wind.Field.01
```

The JSON Scenario has explicit `GIVEN`, `TRANSFORM`, `CONSTRAINTS`,
`EXPECT`, and `VERIFY`; its mutating scope is one Csound engine control port
under rehearsal admission. A sound/PCM event and its measurement remain
distinct. Audio capture is optional evidence, never the engine or playback
source. No signal flows merely because a relation is drawn.

The visual projection is
`scripts/csound-teatro/patch.html`; it reads the **same JSON** and renders
only its four entities and three relations. It reports *candidate, not
admitted*, so it does not draw fake activity meters or enable a nonfunctional
Start button. Its source authoring checks and real-browser projection checks
pass without making a production, live-runtime or native MIDI 2.0 claim.

## Exact missing runtime operation

Before the live Scenario can be admitted:

1. Bind the actual native Sing RealtimeSinger PCM source to an Ear input on
   the requested host, with an observed shared audio-clock or governed
   transport. The currently available Sing macOS adapter plays to a physical
   output; it does not establish an accepted browser PCM link.
2. Reuse the existing native Csound Teatro Scenario admission/lifecycle
   boundary (and FountainScenarioKit where it is already the adopted runtime)
   rather than self-approving from this authoring checker.
3. Compile the *admitted* mapping to the existing MIDI 2.0 UMP controller
   dispatch, correlate packet sequences and the Csound port effects, and
   verify the independent Ear output measurement in the same live session.
4. Offer deliberate Start and Stop and inspect the actual live trace in the
   patch. Replaying the two previous Csound recordings cannot satisfy this
   acceptance.

The previous private `/teatro/experiments/composing-by-ear/` WLAN v36 page
remains a **static two-recording audition**, which verifies only the bounded
acoustic influence of Ear and MIDI 2.0 on Csound *when a prerecorded Sing WAV
was the input*. It must not be advertised as the working live patch. That
experiment remains useful evidence; its history is not rewritten.

## Development acceptance (source and semantics only)

```sh
node scripts/csound-teatro/check-scenario.mjs \
  scenarios/csound-teatro/composing-by-ear.live.json
node --test scripts/csound-teatro/validate-scenario.test.mjs
```

This source review found **no demonstrated need to extend the predicate
vocabulary yet**. It DID identify the missing live native PCM adapter and the
unimplemented Csound Teatro Scenario admission/engine binding. Neither is
silently replaced by an independently authored web player or invented clock.

## SatzfunkPlayer source candidate (25 October 2026)

The separate SatzfunkPlayer source repository now contains a reusable browser
media component with a host-owned Web Audio output seam. This Teatro-owned
candidate is stored at
[scenarios/satzfunk-player/ear-wind.candidate.json](../satzfunk-player/ear-wind.candidate.json)
and uses the existing Csound Teatro Scenario 0.1 structure. It treats
SatzfunkPlayer as the source-owning instrument and the host-admitted edition
track as its input; the media file itself is not promoted to instrument
identity.

The candidate remains unadmitted. The current owner MIDI2 IDL
Fountain-Coach/midi-backplane@25e5ac3b9169856258ac030ef0ba9131c347defe
(schema 0.2.0) has no Player playback, source-audio routing, or Player
lifecycle topic. The Teatro build now imports the Player package from its
owner checkout, pinned to commit
`7dd23cd397dc1c5b43983f3c54ec1377ffdd22b8`; the build rejects a dirty or
mismatched Player checkout and records module digests. Its reader loader only
registers the custom element. No track is admitted or instantiated in First
Hearing. The receiving Ear binding, Ear-to-Csound runtime edge, native
Scenario admission, audible Csound effect, and live witness are still absent.
The proposed Player audio path uses Web Audio; MIDI2 remains unused here. Do
not dispatch an assumed CC or use an unrelated stage topic as a substitute.
