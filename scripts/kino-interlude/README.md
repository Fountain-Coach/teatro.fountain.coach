# Kino After Dark — Teatro Interlude 01

Original 112 BPM dance interlude, Csound-rendered from five scores into five AAC stems. The standalone source-owned HTML/SVG/Web Audio route is site/interludes/kino/.
The photograph of Kino International informs the visual palette and façade geometry; the stage SVG is newly authored, not a copy of the photo.

## Scope
- Csound renders the actual five sound stems. The browser mixes those stems with Play/Pause/Stop, channel faders, mute and three presets.
- This is a studio-rendered Csound composition, NOT an admitted native CsoundTeatroScenario run or a MIDI2/Ear/live signal proof.
- Browser audio starts only after a user gesture.
- link_first_readings.py inserts a single interlude link after the existing First Readings work into the established Linotype template; it does NOT create a second reader, second literary work, or published edition.
- Stage on the existing owner WLAN only. Production requires independent authorization.

## Regeneration
python3 scripts/kino-interlude/render.py (requires Csound, Python and macOS afconvert). 32 bars, 112 BPM, 4/4, ~68.571 s loop. Five score CSDs, five AACs and manifest.json stay source-bound.

## Stage projection
Read exactly the active estate/index.html as input, then run python3 scripts/kino-interlude/link_first_readings.py before.html after.html. Check all unaffected bytes and retain the previous immutable WLAN release; add only the Teatro route and First Readings link.

## Audio verification
The five rendered original Csound stems each reported zero performance errors and nonzero overall amplitudes on 2026-11-05. Browser playback and staged readback require their own evidence.
