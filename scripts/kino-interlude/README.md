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
