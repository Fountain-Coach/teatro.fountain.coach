# Ball / Plank / Impulse — rotating physical Csound instrument

**Score identity:** `teatro.ball-plank-impulse-synth-ab.rehearsal.01`  
**Status:** Scenario 0.1 source candidate, NOT admitted into the native Scenario runner and NOT yet an observed 3D-to-Csound/iPad performance.  
**Authoritative machine-readable score:** [ball-plank-impulse-synth.live.json](ball-plank-impulse-synth.live.json).

## What the performer encounters

The Teatro Stage dominates the iPad in landscape. It is the existing three-sided paper stage, without the default puppet and without the techno mixer as its main interface. It slowly rotates when idle. It contains two physically independent instruments: world A has a heavier matte ball and wooden plank; world B has a lighter matte ball and brighter glass/metal sounding plank. The source soundtrack is **not a recording** and **not a sequencer**. Both scenes excite the existing Csound sound-first synth (six ADSR voices per patch, two independent patch instances, crossfade and Ear observation).

No automatic ball drop follows the camera. A deliberate reader/performer gesture starts audio; dropping, throwing or tilting a physical body can create a collision. The sound is caused by *actual physics contact*, with identity, contact time, normal speed, strike position and declared mapping, not by an animation easing curve or click-track.

## Human score (Csound Teatro 0.1)

```text
GIVEN  Ball.A.01 and Plank.A.01 on the canonical Stage
       Ball.B.01 and Plank.B.01 on the same Stage
       the retained sound-first Csound A/B synth and Ear

WHEN collision(Ball.A.01, Plank.A.01)
     Ball.A.01 EXCITES Plank.A.01
     Ball.A.01.normalVelocity 0..7 m/s
       MAPS_TO Plank.A.01.excitation 0..1 normalized
     Plank.A.01 EXCITES Synth.{Kick,Snare,Metal,Bass,Chord,Air}.A

WHEN collision(Ball.B.01, Plank.B.01)
     Ball.B.01 EXCITES Plank.B.01
     Ball.B.01.normalVelocity 0..7 m/s
       MAPS_TO Plank.B.01.excitation 0..1 normalized
     Plank.B.01 EXCITES Synth.{Kick,Snare,Metal,Bass,Chord,Air}.B

Ear.Synth.01 LISTENS_TO Synth.Crossfade.01
```

The JSON is the complete typed score. The text above is its legible projection, not a separate dialect. Retained Csound instruments 101–106 and 201–206 receive gates, 190/290 combine the two sound graphs, 900 performs the existing equal-power A/B stereo crossfade, and Ear observes actual post-crossfade PCM. A collision is one source event, *not* six separately invented instruments or six separate physics events.

## The physical-to-musical mappings

| Observed property | Existing Csound consequence |
| --- | --- |
| Normal contact speed 0–7 m/s | Contact excitation 0–1, bounded and clamped |
| Contact impulse and short pulse | ADSR gates, 60 ms on and explicit off; refractory 85 ms per ball |
| Point of contact on plank | Existing `tone` control 0.16–0.90 |
| Sounding plank tension | Existing `pitch` control 0.14–0.82 |
| Material persistence (damping) | Existing `release` control 0.04–0.85 |
| Contact strength | Existing patch `master` control 0.18–0.83 |
| Surface roughness | Existing patch `drive` control 0.05–0.48 |

All values are authoring ranges, not an acoustic measurement of physically realistic materials. The existing orchestra is retained exactly; no physical-model Csound opcode is surreptitiously substituted. No claim is made that a bright material itself computes actual modal resonance. A later acoustic development must be separately measured.

## Scene gestures

**Drop/throw:** drag a ball and release; physics computes approach and collision.  
**Tilt:** move the selected physical plank, changing contact conditions.  
**Orbit:** drag empty stage (or observe slow idle rotation); camera-only, absolutely no audible event.  
**Mutate:** evolve continuous material and existing synth timbre over a chosen 2/4/8/16 seconds; never randomize a gate, contact, identity or routing.  
**Clone:** copy one world's *static* physical/sound configuration into the other; never duplicate a collision already occurring.  
**Crossfade:** hear the actual independent A/B outputs through Csound 900.  
**Inspect:** long-press to disclose typed facts, not a permanent patch board.  
**Stop:** release all ADSR gates, mute and close AudioContext, stop Ear measurements.

A scene's rotation is not an ADSR or MIDI controller. The user must be able to visually orbit independently of a physically audible tilt.

## Runtime binding and acceptance boundary

Existing source: `Fountain-Coach/midi2-gpu-fabric@83d9fc27a8f4cba8a5c2aa63cca81f53d9d19573` `apps/teatro-stage-web/src/techno/{synthCsound,synthModel,SynthDeck}.tsx/ts`. Its sound-first synth and A/B/Ear facilities are preserved.

Required remaining live work:

1. Bind canonical TeatroStageEngine real physical contact events/positions/normal velocities to the declared Ball/Plank ports on the source-owning stage.
2. Correlate physics event time to the AudioWorklet clock and dispatch an actual *short excitation gate* and mapped sound controls, with a verified gate-off.
3. Bind material state, scene clone and seeded mutation through the same existing A/B patch model.
4. Admit the Scenario through its native governed runtime; a bounded source checker alone cannot authorize the effect or establish FountainStore terminal receipts.
5. Verify a physical iPad gesture, live Csound PCM, real Ear output, camera-vs-tilt separation, and Stop. Browser desktop rehearsal is not equivalent to iPad acceptance.

No production publication, public URL, new host, private manuscript mutation or copyrighted recording is implied by this source artifact.

## Reuse in a story

The instrument is intentionally **story-neutral**. A Linotype Teatro Insert can later reference this same `scenarioID` and a *specific source edition + folio/passage anchor*. Each insert chooses a performance viewpoint and initial material preset, not another synth or another grammar. Reader-initiated Play/Stop, focus return, capability status, sound-rights checks, and an accessible non-playing description are prerequisites for treating it as a reading surface. This is a possible future book projection, **not yet an inserted or published folio**.
