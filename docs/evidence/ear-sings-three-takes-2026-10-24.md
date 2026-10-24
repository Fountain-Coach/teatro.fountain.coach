# Ear listens to Sing — real AudioWorklet and independent candidate selection

**Date:** 24 October 2026

**Owner:** Fountain-Coach/teatro.fountain.coach (Ear runtime and listening boundary)
**Status:** Verified private browser scenario, **not** production Ear deployment, speech recognition or editorial publication

## Why this exists

The author explicitly directed that **Ear** choose a development baseline for the three Sing takes; this is not a human grading task. FCIS Chapter 138 owns Ear's explicitly connected Web Audio analysis boundary. Sing owns the generated voices and source score; Teatro owns the Ear listening implementation and witness.

Three private, self-authored synthetic 5.2-second 48 kHz mono WAVs from one identical Sing score were fed to an actual Chrome 155 Web Audio graph. **Both** the SHA-pinned *original* shipped Teatro Ear AudioWorklet and a supplemental, scoped acoustic feature processor observed each **AudioBufferSourceNode** through distinct explicit connections. These were three original native Sing outputs, not regenerated browser oscillators or synthetic counters.

## Precise authority

- The original shipping Ear worklet is embedded in `site/assets/book-csound-host.js`. The test harness extracts **exactly** that base64 source with `scripts/extract_shipped_ear.py` and refuses a changed digest. Original worklet SHA-256: `4f1d800fd5518975c0bc98a5fb0ace93eaa726d8731bf330a8eff59a9d115427`.
- The original Ear reports RMS, peak, silence and a single stream onset. Its outgoing ear.ump object includes a **fixed note number 48**, which is a placeholder and must **never** be described as a detected pitch or actual lyric recognition. It does not detect phonemes. This is a concrete limitation in the current deployed Ear.
- `scripts/ear-singing-features.worklet.js` is **supplemental TEST-ONLY analysis**, run beside original Ear, not in the published site. It measures spectral band balance, spectral change, windowed autocorrelation pitch and onset candidates. The output consists of private MessagePort diagnostic measurements; it does **not** create a second MIDI transport, issue fabricated notes, alter the shipped MIDI2 authority or claim an authorized new public runtime.
- Both observers share one versioned source identity and timestamp in the browser test; the browser's audio graph is explicitly connected. No microphone permission, external network inference, author-provided hearing response, user data or public media is required.
- Every observer connection, MessagePort and AudioContext is shut down after the private test. Evidence includes the AudioContext's final `closed` state.

## Exact private media identities (do not check audio into Git)

| Take | SHA-256 of 249,600-frame original PCM |
| --- | --- |
| plain | `f4826365089889eafef579f5e0b3cf6f77d7bf570fcc0fa6e1d5f85ef191cf24` |
| articulated | `1d285c6b0a9dd2f7b7be58aac1509b5f55bcac5e3636c530cbec25f20db8f505` |
| expressive | `b7390503bdcb4669235fc417e0d21f8008c578f59228ab7ee0817e3df3ff8d27` |

All three WAV hashes were checked in browser using `crypto.subtle.digest` before decoding for playback.

## Real-browser Ear witness, Chrome 155, 48 kHz, 1024-sample windows / 512-frame hop

| Take | Shipped Ear active windows | Supplemental feature windows | Spectral onset candidates | /m/ onset high-frequency energy share | /n/ onset high-frequency energy share |
| --- | ---: | ---: | ---: | ---: | ---: |
| Plain | 487 | 500 | 5 | 0.0103526 | 0.0003197 |
| Articulated | 487 | 500 | 5 | **0.0016679** | **0.0001376** |
| Expressive | 488 | 500 | 19 | 0.0016807 | 0.0006617 |

- /m/ high-band energy fell ~84% and /n/ ~57% in the articulated take compared with plain, while steady vowel bands remained effectively unchanged. The tests select **articulated** as the baseline for the next consonant-design iteration on this **declared acoustic proxy**, not as a proven human-intelligibility or lyric score.
- More spectral-onset candidates in the expressive take represent pitch/breath gestures and spectral movement: **19 is not a detected count of syllables**.
- The supplemental frequency detector recovered the broad four-note pitch contour (~261 Hz, ~330 Hz, ~392 Hz, ~330 Hz in the unexpressive score). Autocorrelation can make octave errors or fail on noisy material; the tests describe this as a diagnostic, not qualified note transcription.
- The original shipped Ear exposed roughly 13 silence windows per take and **one** onset event per take; this is not a genuine three-syllable onset detector.
- **No ASR or syllable recognition** was performed or claimed; macOS Speech on-device recognition support was detected, but authorization status remained `notDetermined` and no permission request or model inference was performed.
- No physical output loopback or real human hearing occurred. The real browser audio callback and nodes were exercised. The audio sinks were attenuated to ~1e-6 to avoid unsolicited audible output.

## Exact regression path on an authorized machine

    cd ~/Developer/teatro.fountain.coach
    python3 scripts/extract_shipped_ear.py /tmp/sing-ear-scenario/ear-original.js
    cp scripts/ear-singing-features.worklet.js /tmp/sing-ear-scenario/ear-features.js
    cp scripts/ear-singing-scenario.html /tmp/sing-ear-scenario/index.html
    # Before running, supply the three private exact-SHA Sing WAVs as:
    # /tmp/sing-ear-scenario/{plain,articulated,expressive}.wav
    # Start a localhost-only HTTP server on 8198 and a dedicated headless Chrome
    # debugging endpoint on 9237. Neither service should be left running.
    node --check scripts/ear-singing-features.worklet.js
    node --check scripts/verify_sing_ear.mjs
    node scripts/verify_sing_ear.mjs

The test `verify_sing_ear.mjs` checks original Ear source identity, 3 matched SHA256 media, both worklet windows, expected score pitch bands, per-onset spectral attenuation, steady vowels, distinct expressive spectral gestures, and cleanup. A failure is reported rather than a false listening verdict. Test fixtures are under scripts; no site assets, published edition, estate manifest or deployment were changed.

## Next owning capability

Ear needs independently calibrated consonant/phoneme recognition (for instance a locally admitted phonetic detector, with negative controls and no unapproved cloud processing) before it can pass **intelligible singing**. A signal meter and a spectral development proxy do not supply that guarantee. The author should not be tasked with manually choosing engineering variants; the author retains **editorial authority** over a published First Hearing, a different decision.
