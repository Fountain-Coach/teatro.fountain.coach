# Ear: speech-derived singing — lexical gate and vowel envelope (24 October 2026)

**Owner:** Teatro / Ear. **Upstream:** Sing's unchanged 4-note/3-syllable MIDI 2.0 score, original procedural articulated singer and the separately compiled, sample-derived research renderer with `midi2sampler` DSP.

**Development verdict:** The speech-derived singing sound passes Ear's pitch witness, but **fails a source-blind lexical transcription test**. Vocal naturalness, independently recognized phonemes, source-speaker identity, formant trajectories and human intelligibility remain **unqualified**. No publication.

## Why the new gate is needed

The original acoustic witness accurately recovered all four pitches in browser AudioWorklets. But accurate pitch does not imply recognized words or preserved voice characteristics.

A fully local macOS 26+ `SpeechTranscriber` (Apple Speech framework) was compiled and run independently of Sing and its score. Its `en_US` model was **already installed**; no cloud query, external model download or new speech-training pipeline was used. Ear's transcriber receives only one private, SHA-identified WAV at a time — **never target lyrics**. An independent post-inference comparison script evaluates a small, declared pronunciation-equivalent spelling set; it is not a phonetic recognizer or human listening study.

## Actual source-blind lexical results

| Recording | Source identity | Independent Apple transcription |
| --- | --- | --- |
| Original macOS spoken control | `0112aaf01cf6c83d9c695b908f4211b376ce8b5b0e04654995aff447fb44bdbb` | “La, me, nah.” |
| Original speech-derived singing | `42b79af5aec3ff1efbcae0b3caf9e43ab2adab4cdd4149376b9cad5329704d6b` | “Love” |
| Existing procedural articulated baseline | `1d285c6b0a9dd2f7b7be58aac1509b5f55bcac5e3636c530cbec25f20db8f505` | no transcript |
| Longer 230-ms naturally spoken prelude | `aae8d04af8590ee58506a17eb836ed00c79a5ef47c228f91468cb676732bffaa` | “Me. Nah.” |
| Longer 300-ms naturally spoken prelude | `61f6400c16cf20be44c43aa1cbd1ce7b46b11ad533e0378dec23fc410ff5767a` | “Me. Nah.” |

The 230-ms variant was also SHA-verified inside the actual original Ear browser worklet and test-only feature worklet. Its measured pitch sequence was 260.9, 333.3, 387.1, 333.3 Hz, with pitch proxy confidence 0.9971, 0.9781, 0.9802, 0.9750. Four target notes remain intact, but **the full lyric target still fails**.

Per-syllable diagnostic recordings returned “Love”, “Me”, “No” for the sung take, against source spoken “Law”, “Me”, “Nah”. These are recognition diagnostics, not asserted phoneme sequences. Short nonspeech/noise and model linguistic priors may cause omissions or substitutions: never infer human perception directly from a single recognizer's transcript.

## Independent negative controls

- Reordered `la na me` spoken with the system's own voice: **“La nami.”**, not the original phrase.
- Changed consonant `ma me na`: **“Mamina.”**, not the original phrase.
- Four seconds silence: no transcript.
- Four seconds deterministic low-level noise: no transcript.

The positive spoken reference passes a narrowly scoped lexical variant `la me nah`; all four controls fail that same target. Therefore, the current synthetic phrase has a **working lexical diagnostic**, not a validated phoneme recognizer. The experimental singer does **not** pass the lexical gate. Ear's [phoneme recognition issue #1](https://github.com/Fountain-Coach/teatro.fountain.coach/issues/1) remains open.

## Broad spectral vowel envelope (not voice identity)

`scripts/ear_private_envelope.py` computes a fixed 2048-point Hann Fourier transform, 1024-frame hop, 170 Hz broad smoothing and 25 mean-centered log-spectral bands from 250 Hz upward. The score is consulted only to select matching temporal analysis windows **after audio generation**. This is a coarse amplitude-invariant vowel-envelope proxy, not formant measurement, speaker identification, perceptual quality or naturalness.

| Output region | Sample-derived vs original spoken source | Procedural vs spoken source |
| --- | ---: | ---: |
| first `la` note | 0.9897 | 0.9723 |
| second `la` note (melisma) | 0.9879 | 0.9674 |
| `mi` | 0.9905 | 0.6077 |
| `na` | 0.9638 | 0.9486 |

A different-vowel negative reference has substantially lower similarity (0.351, 0.301, 0.237, 0.163 respectively). This is consistent with broad *vowel-spectrum* retention in the sampled renderer despite failed whole-phrase recognition; it does **not** establish a persistent naturalistic voice.

## Reproducible entire graph, not scattered anecdotes

`scripts/run_private_speech_gate.py` is one execution command that:

1. stages two SHA-checked private audio sources, runs the **actual shipped original Ear browser AudioWorklet** and separately scoped test feature worklet in private Chrome/HTTP on loopback, then closes and terminates the services;
2. creates private spoken confusable/silence/noise controls; compiles and runs Apple's on-device SpeechTranscriber (with no target lyrics);
3. evaluates the post-inference phrase-specific lexical and negative-control gate; measures sampled/procedural spectral envelope comparisons to the source; cross-checks SHA identities across Ear/browser/Python;
4. writes a source-addressed, private JSON receipt in `/tmp`. Staged audio and browser profile are removed on exit. Source recordings remain privately caller-owned in `/tmp`.

From the Teatro owner (on macOS 26+, Apple `en_US` already installed):

```sh
python3 scripts/test_ear_private_lexical_gate.py -v
python3 scripts/test_ear_private_envelope.py -v

python3 scripts/run_private_speech_gate.py \
  --score ../sing/examples/sustained-melisma.json \
  --manifest /tmp/sing-speech-macos.json \
  --spoken /tmp/sing-speech-macos.wav \
  --procedural /tmp/sing-speech-procedural.wav \
  --speech-derived /tmp/sing-speech-hybrid.wav \
  --receipt /tmp/ear-private-speech-gate-baseline.json
```

An independent run using `/tmp/sing-speech-prelude-230.wav` and a separate receipt was also completed. Both recorded `browser=passed`, `lexical-gate-blocked`, `phonemeRecognition=NOT_IMPLEMENTED`, `testServicesTerminated=true`. The final receipts remain in private `/tmp`, never in public Git.

**What this means for instrument development:** preserve the original articulated baseline, do not silently promote the extended prelude. Continue improving phonetic transitions while leaving vowels/pitches stable. Only a separately qualified phoneme recognizer with held-out controls, and a distinct perceptual/voice-identity procedure, can support wider claims. Do not ask the author to serve as the development test instrument. Public performance/edition permission remains separate.
