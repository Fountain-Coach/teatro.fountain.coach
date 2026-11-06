# Kino After Dark — two Csound sound-craft source readings

**6 November 2026 — Original source candidate; editorial audition only.**

The writer rejected unrelated Sing A/B examples in *A Sound Must Earn Its Place*. The intended source comparison is one Kino scene, with the same score interpreted in two original Csound patches, played through the existing SatzfunkPlayer in the existing Fountain Press Reader.

- **Source:** `scripts/kino-interlude/render_sound_craft_contrast.py`; original score SHA-256 `21ae0eda6621d1b2ff90a1baaa792def576d7399da62cc90609022d854abda49`.
- **A literal:** dry oscillators and broadband noise, uniform envelopes and identical stereo channels; a deliberate rehearsal of the initially unsatisfactory approach.
- **B directed:** same five timed score events and air field, resonant materials, controlled partials, uneven attacks, stereo positioning and room response.
- **Render:** native Csound, 48,000 Hz stereo PCM, two 16.0 s scores; macOS `afconvert` AAC delivery. Overall output RMS 0.08193 and 0.08212 linear; different peaks and stereo. Whole-file RMS matching is not perceived-loudness certification.
- **Custody:** both CSDs, original WAV masters, AAC previews and exact digest manifest stay in the Teatro source owner. No actual Lou Donaldson or other commercial recording/samples, and no change to original Satzfunk Shaders remix rights.
- **Player:** existing SatzfunkMediaElement inside the original Fountain Press Reader. Source-intercepted true HTTPS browser preflight passed portrait 768×1024, landscape 1194×834 and phone 390×844, with both ~16.064 s AAC assets actually decoded and played for >1 s each, then stopped.
- **Limits:** browser test supplied candidate files in memory, not a v165 live release. Actual Csound offline-rendered sound is not native Csound Teatro Scenario admission or live browser Csound. Whether B is artistically better requires writer listening. No public production or physical iPad acoustic witness.

The earlier rejected Kino versions, published publisher, domain, original Reader and private v164 release remain unchanged.
