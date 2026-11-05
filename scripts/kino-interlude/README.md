# Kino After Dark — Teatro Interlude 02

The formerly staged five-stem chord/lead dance study was rejected by the writer. V2 removes all those stems; there is no pad/chord source and no substitute backbeat arrangement.

## A playable Kino International sequencer

The cinema's sixteen illuminated ground-floor windows ARE the sequencer. Touch windows to toggle sample triggers and audition a slice. Playing steps yield real MIDI 2.0 UMP noteOn/noteOff packets (group 0 / channel 9), encoded by the owner-native @fountain-coach/midi2 protocol module (0.12.8) and decoded back to the locally scheduled sample engine. This verifies a typed browser software instrument; it is NOT native hardware discovery, an external MIDI transport, MIDI-CI negotiation, or a native Teatro Scenario admission. The viewport never claims those things.

"Randomize" creates a new crypto-seeded 16-step pattern including slice addresses and velocities. The sample instrument is tactile (pointer scan, 8 slice locations, grain duration, speed, reverse, level and owner-device local-audio import). Automatic audio playback never occurs. The same original Linotype reader/First Readings handoff remains unchanged from v153.

## Sample custody

The original source is **Shaders, Track 4, Benedikt Eickhoff**, from the 43 already published source media at https://satzfunk.fountain.coach/media/bandcamp-20261024/shaders/40479.mp4. The original as-published MP4 digest is 24abb318154118c6e0bd182fdb1e9ea0260d4c207e51e878efa2143181b670f9. The **9-second excerpt** begins at 50 seconds, staged as an AAC derivative only on the owner-controlled WLAN. See assets/sample-provenance.json for digest/processing facts and status. The public original-media admission is NOT derivative-remix authorization; keep this derivative private. It is credited in the live interface.

## Development and checks

- Base route: site/interludes/kino/index.html
- Original scenario/score history preserved under scripts/kino-interlude/*.csd; the rejected .m4a stems removed from the v2 published route
- Layout: site/interludes/kino/assets/sampler-v2.css
- Local sample instrument: site/interludes/kino/assets/sampler-v2.mjs
- Owner-native UMP codec: site/interludes/kino/assets/midi2-ump.mjs, bundled from Fountain-Coach/midi2 midi2.js src/ump.ts without modifying that source
- Build transform: python3 scripts/kino-interlude/build_sampler_v2.py (run once against v1; the resulting html is source-checked in)
- Browser acceptance: Chromium on Mac, 820px iPad portrait and 390px phone, 16 windows, no legacy channel mixer, no horizontal overflow, sample audio played, random seed / slice assignment, touch waveform, reverse and Stop exercised

Scope remains staging only. Changes to any production estate, public Satzfunk media, original Reader runtime, authored essay text or any historical source are out of scope.

## Ear → MIDI 2.0 loopback → band echo (third study)

This is a bounded **software instrument** inside the current Kino browser sampler. It reuses the original `EarAnalysisProcessor` AudioWorklet, copied byte-for-byte from the already-established Teatro Ear source route (`4f1d800fd5518975c0bc98a5fb0ace93eaa726d8731bf330a8eff59a9d115427`). The Ear input is the dry, pre-echo PCM bus. In the fourth study it combines the sampler with Csound-rendered bass and hi-hats; no feedback audio is sent into Ear. Ear delivers measured RMS samples to the event receiver; note 48 in Ear's original telemetry is a placeholder and never used for pitch.

The sender maps Ear RMS with a quiet-source soft knee to MIDI 2.0 UMP CC74 (group 0, channel 0, uint32) using the pinned owner MIDI2 codec. The loopback receiver independently decodes, checks controller identity and monotonic sequences, and modulates a band-limited tape-delay echo with wow at 0.37 Hz, 402-ms delay, lowpass cutoff 440–5600 Hz, feedback no higher than 44% and wet no higher than 43%. Echo level and Color sliders remain direct owner controls, but Ear drives the movement. Stop silences all sources, sets echo wet and feedback to zero, and prevents further MIDI control updates. No hidden new transport, no extra audio source, no chords/pads.

**Proof:** Mac Chromium local browser: actual Ear RMS observed at 0.0032, UMP CC74 count ≥5 over a short run, modulated lowpass ~1386 Hz and feedback ~24%, browser-responsive 820/390 px, bounded Stop with stable terminal Ear output. This is measured PCM-to-control and local Web Audio echo emulation, **not** native Csound Scenario admission, external MIDI interoperability, an independent physical iPad listening witness or new public publishing rights. The unchanged First Readings Linotype link and all already accepted stage content must remain byte-for-byte preserved in staging.


## V156: Csound bass and hi-hat swing pocket

The writer requested a dance feel without pads or chords. Three original Csound one-shots (single D2 bass hit, closed and open hi-hat) are generated with `python3 scripts/kino-interlude/render_groove.py`, with their exact digests in `assets/groove/sources.json`. They are scheduled as mono bass notes and alternating open/closed hats on the sampler's existing 112 BPM AudioContext clock. The bass and hat share the original dry PCM Ear input and therefore trigger the *same* source-measured MIDI 2.0 CC74 echo modulation as the interactive Satzfunk sampler; no independently invented second Ear or MIDI transport. Swing delays the odd eighth steps by 0–16.25% of a beat, giving eighth-note ratios from 50:50 to 66.25:33.75. Levels and mute are individual; both are encoded as UMP note events on channel 1/9. No chords/pads, no MIDI hardware claims, no changes to the Linotype reader. Stop must silence all groove voices and echo feedback.

### Preview-compatible audio format

The owner-WLAN preview refuses any WAV inside a served release. Original Csound-rendered WAV one-shots are therefore retained **only as Git sources** in `scripts/kino-interlude/source-renders/`; the three deployed one-shots are encoded as AAC/m4a, with source and derivative SHA-256 in `site/interludes/kino/assets/groove/sources.json`. The browser decoder and Web Audio scheduler are otherwise unchanged. Never relax the server's audio admissibility policy to accommodate a source WAV.
