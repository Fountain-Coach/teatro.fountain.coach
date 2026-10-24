# Ear independently compares speech-derived singing — 24 October 2026

**Owner:** Fountain-Coach/teatro.fountain.coach — original shipped Ear worklet and private browser comparison. **Upstream implementation:** Fountain-Coach/sing, experimental `Experiments/SpeechToSing` renderer; sample-DSP owner Fountain-Coach/midi2sampler.

**Scope:** A real, independent acoustic development witness from two SHA-verified WAVs. **NOT** a speech/phoneme recognizer, human intelligibility verdict, publication, OpenAI audio capture, physical output, production deployment, or second MIDI plane.

## Fixture and exact private identities

An original, source-controlled four-note MIDI 2.0 Sing score `la mi na`, with a single sustained `la` phoneme across two pitches, ran through two independent audio engines:

| Renderer | Audio SHA-256 | Private origin |
| --- | --- | --- |
| Original procedural, articulated | `1d285c6b0a9dd2f7b7be58aac1509b5f55bcac5e3636c530cbec25f20db8f505` | Sing's original native procedural formant voice |
| Experimental sampled/resynthesis | `42b79af5aec3ff1efbcae0b3caf9e43ab2adab4cdd4149376b9cad5329704d6b` | Sing experimental PSOLA-like resynthesis of locally spoken macOS `say` test source, not OpenAI |

The speech input's own SHA-256 is `0112aaf01cf6c83d9c695b908f4211b376ce8b5b0e04654995aff447fb44bdbb`. It contains separately recorded short syllables with **heuristic/provisional** onset/vowel boundaries — never claim that these are independently identified phonemes or an authorized reusable voice bank.

Both audition WAVs are **48,000 Hz mono PCM16, 249,600 frames (5.2 seconds)**. Do not commit their media to Git or publish them on the estate.

## Real browser Ear execution

Mac Google Chrome 155 headless, private `127.0.0.1` audio graph with actual `AudioBufferSourceNode` inputs. Exact shipped Ear worklet extracted from its repository bundle and SHA-pinned to `4f1d800fd5518975c0bc98a5fb0ace93eaa726d8731bf330a8eff59a9d115427`. The same independent, **test-only** Ear singing feature worklet used in the original three-take test ran in parallel and never created a second MIDI transport.

The test checked both SHA-256 digests **inside the browser before decoding**, explicit graph source and timestamp identity, shipped Ear PCM windows and original fixed-note placeholder, spectral feature windows and `AudioContext` cleanup.

| Observation | Procedural articulated | Speech-derived |
| --- | ---: | ---: |
| Shipped Ear active windows | 487 | 446 |
| Supplemental feature windows | 500 | 500 |
| Shipped Ear note number | fixed 48 placeholder | fixed 48 placeholder |
| `la` first vowel diagnostic pitch | 260.9 Hz (confidence 0.9976) | 260.9 Hz (0.9970) |
| `la` second-note melisma pitch | 333.3 Hz (0.9774) | 333.3 Hz (0.9780) |
| `mi` vowel diagnostic pitch | 387.1 Hz (0.9721) | 387.1 Hz (0.9804) |
| `na` vowel diagnostic pitch | 333.3 Hz (0.9774) | 333.3 Hz (0.9751) |

The source score pitches are approximately 261.63 / 329.63 / 392.0 / 329.63 Hz. The diagnosed pitches are coarse autocorrelation estimates. The observed difference in **active-window counts** indicates differing dynamics/silence; the signals are **not** certified equivalent in timbre, onset, pronunciation or audible realism.

The first resynthesis candidate returned low confidence for `mi` (0.221) and no recognized pitch for `na`. Sing repaired a source-grain phase coherence defect (cycling unaligned naturally spoken source pulses) by repeating one phase-anchored steady-vowel grain. **Ear ran the exact output again**, with updated SHA and the independent high-confidence values above. This is a meaningful independent engineering feedback loop, not proof of listener-recognizable syllables.

**Final browser result:** `status=passed`; `AudioContext.state=closed`; original Ear worklet real observed PCM; `recognizesPhonemes=false`; no listener/phoneme verification; no public media. Test-only Chrome media autoplay flags enable the private headless graph; they do not change the published browser runtime.

## Deterministic reproduction on an authorized Mac

Generate the source and two candidate private WAVs from the **Sing** implementation and source-pinned `midi2sampler` first (see `Experiments/SpeechToSing/README.md`). From **Teatro's owner**:

```sh
python3 scripts/prepare_speech_source_ear.py \
  --procedural /tmp/sing-speech-procedural.wav \
  --speech-derived /tmp/sing-speech-hybrid.wav \
  --stage /tmp/sing-ear-speech-comparison

# Start one localhost HTTP fixture on 8198 and a dedicated, headless Chrome
# CDP endpoint on 9237 with --autoplay-policy=no-user-gesture-required.
# Both must be stopped at the end of this private regression.
node --check scripts/verify_speech_source_ear.mjs
node scripts/verify_speech_source_ear.mjs /tmp/sing-ear-speech-comparison
```

The exact automated regression above **passed on Mac 24 October 2026**, and temporary localhost test services were stopped. The committed verifier writes JSON report to stdout; the private inspected report remained under `/tmp/sing-ear-speech-final-report.json`.

## Boundary and next work

The current Ear observes signal, diagnostic pitch and spectral envelope only. It does **not** recognize `la mi na`; original `ear.ump.note=48` is a constant placeholder, not the detected note. A recognizer with independently labelled spoken/sung reference, confusables, negatives, confidence and abstention remains in [Ear issue #1](https://github.com/Fountain-Coach/teatro.fountain.coach/issues/1). Future formant-retention and voice-naturalness tests are also required. No OpenAI API call was made in this test (no `OPENAI_API_KEY` in connected environment). Sing development acceptance and separate author/editorial publication authority are not conflated.
