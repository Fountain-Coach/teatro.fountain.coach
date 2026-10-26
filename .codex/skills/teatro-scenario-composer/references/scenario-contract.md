# Csound Teatro Scenario and negotiated bindings

Check actual chapter 151 grammar and registered schema from its current owner before drafting. Grammar 0.1 is finite. Never treat examples below as parser-ready alternate syntax or as an acceptance receipt.

## Basic fixture (Chapter 151)

```text
WHEN collision(Ball.01, Plate.01)
    Ball.01 EXCITES Plate.01

Ball.01.velocity 0..7 m/s
    MAPS_TO
Plate.01.excitation 0..1 normalized

Ear.01 LISTENS_TO Plate.01
```

This states semantic relationships; physics owns collision, Csound realizes excitation, Ear supplies independent measurement, and Scenario admission authorizes effects.

## Existing Composing by Ear candidate

Source: `Fountain-Coach/teatro.fountain.coach/scenarios/csound-teatro/composing-by-ear.live.json`. This is `CsoundTeatroScenario`, grammar 0.1, `candidate-unadmitted` as inspected on 2026-10-25.

- `Sing.01` — `INSTRUMENT`; source `SingVoice.RealtimeSinger`, native live PCM output; **source binding null** in candidate.
- `Ear.Sing.01` — `EAR`; listens to Sing's PCM and reports normalized-linear RMS through its owned analysis path.
- `Wind.Field.01` — `FIELD` realized by browser Csound, **not** Sing or a newly declared FCIS instrument; `wind_mix` control input.
- `Ear.Wind.01` — independent `EAR` for observing Csound's resulting audio.
- Semantic relations: `LISTENS_TO`, `MODULATES`, `LISTENS_TO`; an explicit `MAPS_TO` from Ear RMS domain `0..0.2` to `wind_mix` domain `0.25..1.0`, linear transfer, clamp, interpolation, event updates with 75 ms minimum interval.
- The candidate declares native MIDI 2.0 channel-voice control change, controller 74, group 0/channel 0, 32-bit controller value with bounded identity/sequence. This is **scenario-specific**, not an arbitrary default for new patches.
- `GIVEN`, `TRANSFORM`, `CONSTRAINTS`, `EXPECT`, `VERIFY` constrain identity, live source, event timing, allowed mutation, source vs engine, observations and silent Stop.

Important source note: the candidate defines `timingClock` as `browser-audio-clock`; inspect how the actual Sing source clock and Ear's AudioWorklet clock are bridged and correlated. Do not assume they are identical because both can sample at 48 kHz. Likewise, user-initiated Web Audio playback does not prove native Scenario admission.

## Binding admission responsibilities

Separate four operations even if a host performs them in one session:

1. **Discovery**: observe named endpoints and advertised Function Blocks, IDs, capabilities and interfaces via the existing MIDI 2.0 stack.
2. **Negotiation**: use MIDI-CI discovery, Profile, Property Exchange or Process Inquiry where supported; do not promote unadvertised capabilities.
3. **Scenario resolution and authorization**: match the authored predicates and typed ports to available peers, audio adapters and selected MIDI transports, with verified roles, timing and constraints; refuse ambiguity.
4. **Execution**: admit the exact Scenario/run with native receipt, then dispatch typed MIDI 2.0 operations and separately establish the valid PCM audio signal path to Ear/Csound. Correlate observations and Stop to the same run.

MIDI-CI does not create arbitrary audio cables or choose what music should mean. A diagram of automatically negotiated bindings is a **projection** of source and actual facts, not the authority for either.

## Minimal claim ledger

| State | Evidence required |
| --- | --- |
| Authored | Versioned Scenario source with stable identities and exact changed diff |
| Candidate valid | Owning source validator result, typed mappings, known unresolved bindings |
| Ready for admission | Matching live capabilities, resolved audio/MIDI bindings, approval/authorization facts |
| Admitted | Native Scenario admission receipt for exact run and input |
| Running | Actual effects and instrument/transport evidence for that admitted run |
| Observed | Ear measurements of real Csound output, provenance, timing and assertions |
| Completed | Correlated Stop/terminal evidence plus store receipts where required |
| Published | Separate EstatePublisher publication receipt and independent HTTPS readback |

### Focused source validation example

```bash
npm run check:csound-teatro
```

Run in the current `Fountain-Coach/teatro.fountain.coach` checkout when applicable. This is an existing limited checker, not a native runtime admission command. Do not invent or change its acceptance definition. For a live test, use the actual native Scenario runner and instrument/host adapters, and report precisely what each executable witness proved.
