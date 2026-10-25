# Composing by Ear — original Sing → Ear → MIDI 2.0 → Csound Teatro

**25 October 2026 · Historical recorded-source acoustic experiment, not a live Csound Teatro Scenario. No public deployment or host MIDI bridge.**

**Semantic correction (25 October):** This browser run began from a **previously rendered Sing WAV**. It measured real Ear windows, emitted real browser-local MIDI 2.0 UMP controller events, and changed an actual Csound AudioWorklet's `wind_mix` parameter. It did **not** connect the independently running Sing instrument to Ear, did **not** admit an authored Csound Teatro Scenario via its DSL, and did **not** create a live playable patch. The Csound wind sound is an engine output, **not Sing**; the Scenario is a relationship contract, **not an FCIS instrument**. These measurements remain valid only as finite acoustic evidence. The live, unadmitted grammar 0.1 candidate and source-driven patch visualization are separately owned in [scenarios/csound-teatro/README.md](../../scenarios/csound-teatro/README.md). Do not reuse this recording proof to claim live execution.

## Author's goal and observed implementation

The author chose **composing by ear**, expressly *not* a teaching or pronunciation-correction scenario. The finite experiment makes one existing original Sing vocal performance cause a second real sound by passing a genuine measured Ear feature through the already-established local MIDI 2.0 UMP event representation to a declared real Csound control port. An independent control recording omits only the mapping. The author can audition both.

The original 48,000 Hz, 5.2-second, 249,600-frame Sing articulated WAV has SHA-256 `1d285c6b0a9dd2f7b7be58aac1509b5f55bcac5e3636c530cbec25f20db8f505`. It is an original self-authored synthetic voice. The existing Teatro Ear worklet SHA-256 is `4f1d800fd5518975c0bc98a5fb0ace93eaa726d8731bf330a8eff59a9d115427`. The fixture refuses a source/worklet digest mismatch; neither binary is committed to Teatro Git.

### Existing owners, no invented new engine

- **Sing**: original musical audio/score and source identity.
- **Teatro Ear**: the actual extracted source-pinned `ear-analysis` AudioWorklet, measuring 1024-frame windows of the explicitly connected WAV through `AudioBufferSourceNode`.
- **midi2**: existing `site/assets/linotype/book-midi2.mjs` `createBookMidi2`, `unpackControlChange`, 64-bit MIDI 2.0 UMP Channel Voice CC **74** (group 0, channel 0, full 32-bit controller value). No parallel custom JSON bus or physical port.
- **Csound Teatro**: actual existing `site/assets/book-csound-host.js` `BookCsoundHost` and **@csound/browser AudioWorklet**, with the existing `wind_mix` control channel. No detached actor Csound stub, no replacement oscillator, no MIDI 1.0 fallback.
- **Teatro Ear on Csound output**: separately observed windowed Csound output as actual `ear.ump` events.
- **Audio recorder**: a bounded AudioWorklet that captures actual Csound PCM, making it possible to audition the two outputs; this recorder is not a second Ear, audio engine or MIDI transport.
- **SatzfunkPlayer**: an existing editorial listening implementation that can eventually receive the source-addressed composed audio, but it was **not** secretly inserted into this first local renderer acceptance. The existing private Teatro audition presents real `<audio>` controls and an honest evidence witness.

### Finite semantic mapping

```text
Source:          Ear RMS amplitude from original Sing, linear 0..0.20
Carrier:         repository MIDI 2.0 64-bit CC74 / group0 / channel0
Timing:          original Ear source timestamps; at most one emission / 75 ms
Mapping:         clamped linear transfer to Csound wind_mix 0.25..1.0
Scene policy:    private one-way rehearsal; Csound output not fed into source control
Execution:       source-addressed packet sequence accepted by existing local UMP bus
                  then real Csound.setControlChannel(wind_mix)
Observation:     real Csound output worklet's separately observed audio
```

Ear's existing fixed note number **48 is a placeholder**, not detected pitch. The composition deliberately ignores it; there is no independent phoneme recognition, interpreted gesture contour, lyric inference, composer revision, MIDI 2.0 hardware delivery, or physical listener certification. The result is a genuine acoustic transformation by the existing measured amplitude, a first compositional mapping. The original source recording itself is **not** mixed into Csound's rendered soundtrack.

## Actual independently rerun browser proof

The first owner-local Chrome execution was performed with a single page and restarted Csound/Ear in two consecutive takes; the fresh Ear module failed with `AbortError: Unable to load a worklet's module` in the reused browser realm. The two takes were moved into **separate fresh isolated browsing documents** using same-origin, bounded, session-identified messages. This changed no Ear, MIDI, Csound, browser host, audio source or staging service. Both isolated executions now pass without browser exceptions.

Observed evidence for the final two-take run, original PCM before audition amplification:

| Property | Csound without Ear mapping | Csound composed by Ear |
| --- | ---: | ---: |
| Sing source Ear windows | 488 | 488 |
| MIDI 2.0 packets accepted | 61 | 61 |
| Csound parameter changes applied | 0 | **61** |
| Csound-output Ear windows | approx. 564 | approx. 564 |
| Raw Csound RMS | 0.0001825 | approx. 0.0005229 |
| Dropped or rejected UMP events | 0 | 0 |
| Captured Csound PCM | ~5.96 s, 48 kHz stereo | ~5.96 s, 48 kHz stereo |
| Both AudioContexts closed | Yes | Yes |

Measured **RMS ratio approximately 2.865×**. Both outputs were recorded directly from the real Csound AudioWorklet; the original in-page and sidecar browser output is not a synthetic counter. The two WAVs were saved privately in `/tmp/fc-composing-by-ear/evidence/` and SHA-pinned in `acceptance.json`. The original engine's audio is quiet: its recorded control peak was ~0.000763 and composed peak ~0.002322, so an **equal linear 120× gain applied after raw measurement** produced safe listenable audition files (under 0.9 absolute peak). Apple `afconvert` produced two verified 48 kHz, stereo AAC/M4A derivatives with identical ~5.957-second durations.

The code is intentionally small, owned only by `scripts/composing-by-ear/`. The original Teatro site and published edition are unchanged. The reproducible test command is `sh scripts/composing-by-ear/run-private-acceptance.sh`, which starts and stops its **existing localhost-only** Python fixture, validates original hashes, drives actual headless Chrome, writes private WAV/evidence, and produces the private audition assets. No GitHub CI or new daemon.

## Canonical owner-WLAN staging

The optional canonical **static proof** uses the existing registered Ubuntu owner-WLAN EstateShell on `192.168.8.50:8200`. It contains only the author-facing HTML and the two original **Csound-derived AAC** recordings, with SHA evidence and no private original WAV. This is deliberate: the staging server refuses `*.wav`, and native iPad Safari does not have an accepted trusted-HTTPS Csound worklet route on the LAN. A static audiobook-style comparison allows the owner to **hear the proven Csound results on iPad** without pretending that the tablet is executing the real-time engine. The macOS localhost Chrome execution is the actual real Csound+MIDI event witness.

**Boundary:** no public promotion, no additional website/host, no new semantic transport, no human-vocal analysis claim, no live iPad Csound acceptance, no uncontrolled feedback and no permanent service introduced.

## Governing evidence

- [FCIS Chapter 138](https://governance.fountain.coach/chapters/138-ear-is-the-web-audio-graphs-midi2-listening-boundary/) — explicit Web Audio Ear tap, measured MIDI 2.0 output, no invented note.
- [FCIS Chapter 151](https://governance.fountain.coach/chapters/151-csound-teatro-speaking-sound-in-space/) — relations, typed Csound instrument ports, admitted scenario mapping, observable execution.
- [Actual Ear's measured Sing evidence](ear-sings-three-takes-2026-10-24.md) — original Ear fixed-note limitation and exact audio SHA.
- Source owners `Fountain-Coach/sing`, `Fountain-Coach/teatro.fountain.coach`, and `Fountain-Coach/midi2` retain their separate contracts.
