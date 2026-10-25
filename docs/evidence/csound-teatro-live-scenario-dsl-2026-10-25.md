# Composing by Ear — Csound Teatro Scenario DSL, source candidate

**25 October 2026 · Source validation and patch visualization. No live runtime admission.**

## Correction demanded by the author

The author rejected the previous implementation framing twice:

1. The wind-producing `BookCsoundHost` AudioWorklet is **not Sing**, and its output is not a new FCIS instrument merely because a Csound parameter changed. Sing and Ear remain distinct source-owning instruments.
2. A two-recording comparison cannot be presented as a live patch. An authored **Csound Teatro Scenario**, not an instrument, must govern the actual real-time relations and mappings.

The writer further directed that the **existing Csound Teatro DSL** be used, and extended *first* if the composition cannot be expressed by it. The test here is whether the actual chapter 151 grammar lacks an essential relation, not whether an invented new parser or transport would be convenient.

## Inspected authority

- [Governance 151, published](https://governance.fountain.coach/chapters/151-csound-teatro-speaking-sound-in-space/) — version 0.1 finite predicate vocabulary, typed entities, properties, ports, mappings, Scenario contract, validation, pre-effect admission, engine adapters, Ear observation, MIDI 2.0 lifecycle and verification.
- [Governance source](https://github.com/Fountain-Coach/Reframe-Refactoring/blob/main/docs/151-csound-teatro-speaking-sound-in-space.md) — described as a **proposal grounded in the initial Ball/Plate/Ear fixture**; this is distinct from a demonstrated live Sing–Ear runtime.
- [Domain Reasoning typed boundary](https://github.com/Fountain-Coach/domain-reasoning/blob/main/ReasoningHost/Sources/ScreenplayComposition/CsoundTeatroBoundary.swift) — `CsoundTeatroExecutionRequest` is **admission-plan only**; `UnconnectedCsoundTeatroDriver` explicitly refuses effects. It cannot be used as proof of live execution.
- [Teatro Book Csound host](https://github.com/Fountain-Coach/teatro.fountain.coach/blob/main/site/assets/book-csound-host.js), shipped source-owned `BookCsoundHost`, current `wind_mix` control port; [Sing](https://github.com/Fountain-Coach/sing) native `RealtimeSinger`, macOS PCM output, no accepted PCM-to-browser Ear adapter; [Ear + MIDI 2.0](https://github.com/Fountain-Coach/teatro.fountain.coach/blob/main/site/assets/linotype/book-midi2.mjs) local UMP path.

**Decision:** Grammar 0.1 already declares `LISTENS_TO`, `MODULATES`, `MAPS_TO`, typed domains/units and event mapping, sufficient to describe *this* compositional relationship. No evidence supports changing or duplicating the predicate vocabulary now. The gap is **native live connection and Scenario admission**, not the relation language. If we discover a genuinely missing construct during typed binding, extend the *owning grammar and version* before adding that execution effect.

## Authored candidate, not an FCIS instrument

The [machine-readable candidate](../../scenarios/csound-teatro/composing-by-ear.live.json) declares:

- `Sing.01` = native Sing FCIS instrument, bound source adapter **not yet present**.
- `Ear.Sing.01` = independent observing Ear.
- `Wind.Field.01` = FIELD realized by Csound, **not Sing** and not an FCIS instrument.
- `Ear.Wind.01` = separate output observation.
- `CsoundTeatroScenario` = the governed relationship contract, with `GIVEN`, `TRANSFORM`, `CONSTRAINTS`, `EXPECT`, `VERIFY`.
- The first mapping is `Ear.Sing.01.rms 0..0.2 normalized-linear-rms MAPS_TO Wind.Field.01.wind_mix 0.25..1 normalized`, linear, clamped, at most 14 event updates/s. The carrier is original 64-bit MIDI 2.0 CC74, group 0, channel 0, full-width value and ordered source identity; it does not decide the musical relationship.

The bounded authoring checker `scripts/csound-teatro/validate-scenario.mjs` uses only the documented 0.1 predicate vocabulary and rejects unknown entities, ports, units, invalid numeric domains, unsupported mapping policies, wrong FCIS identities, MIDI 1.0 substitutions, unadmitted publication, fake pitch/phoneme declarations and recorded Sing file substitutes. **It is not the fully accepted native grammar parser, Scenario Runner or execution admission authority.** Its output is `valid-candidate-not-admitted`, not `running`.

The patch visualization `scripts/csound-teatro/patch.html` reads the exact same JSON source and displays four typed entities, three declared relation cables, mapping policy and the three unresolved execution bindings. It does not create moving meters, simulate live audio or fabricate an admission receipt. The old two-take page remains separate offline acoustic evidence.

## Actual development checks

- `npm run check:csound-teatro` — **10/10** focused source tests passed and actual grammar 0.1 relation projection read back.
- Real localhost Chrome at 1200px desktop, 820px iPad portrait, 390px mobile — **three nodes-to-cable layouts passed**; four entities, three relation edges, three refusal reasons, zero horizontal overflow, zero browser errors, no media controls, **running=false, admitted=false**.
- Repository-wide `npm run check` remains **incomplete due to a pre-existing unrelated local directory mismatch**: the Teatro script attempts `/Users/benedikteickhoff/fountain-press/runtime/identity-circle.css` while the actual Fountain Press checkout is `/Users/benedikteickhoff/Developer/fountain-press/runtime/identity-circle.css`. No unrelated path fix, symlink or reader change was made to claim this as acceptance.
- No public release, estate stage update, MIDI transport replacement, native user permissions or physical sound device modifications were performed in this source correction.

## Next true execution seam

1. Identify the **accepted**, owner-provided live Sing PCM event/output adapter and its clock identity. The native `SingVoice.RealtimeSinger` currently has a macOS speaker adapter, not an observed feed into Ear's web AudioWorklet.
2. Bind that port to Ear while preserving Sing's source identity; **never** substitute `articulated.wav`.
3. Have the actual native Csound Teatro Scenario runtime admit this **exact** versioned model before effects; derive the MIDI 2.0 CC74 dispatch and Csound port update from that admission, **not** from the older hard-coded `MAP` in `scripts/composing-by-ear/compose.mjs`.
4. Make the resulting output audible while processing is underway, display actual real-time port and packet values, and have Ear separately observe Csound output. Verify writer-controlled Stop, source time, and terminal correlated evidence.
5. Only after that proof, project the live patch into the existing private WLAN estate. Do not call an offline comparison or a read-only diagram a fulfilled live patch.

This is a bounded semantic correction advancing the author's actual live composition, **not** completion of its runtime.
