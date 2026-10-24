# Ear — source-blind all-phone recognizer, no forced alignment (24 October 2026)

**Owner:** Teatro / Ear. **Status:** source-only development, real audio-only phone hypotheses, **recognizer NOT QUALIFIED**, **no publication**.

## New implemented boundary

The existing independent Apple `SpeechTranscriber` returned only words. Ear now has a **real local phoneme decoder**, PocketSphinx 5.1.1's English `allphone` search, with acoustic and phonetic N-gram model files verified against source-pinned SHA-256 hashes. It receives only 16-kHz PCM16 after private resampling from each SHA-identified original audio file. It does **not** use the Sing score, MIDI2 notes, expected lyrics, target phoneme strings, phone-time references or forced-alignment functions. Only AFTER the complete decoding run has produced timed phone hypotheses does Ear read the independent published human-singing annotations to compute error statistics.

This is a local offline research experiment. The executable Python 3.13 virtual environment is under `/tmp/ear-phoneme-venv`, installed with a pinned wheel; the acoustic/phone models remain in that private environment, NOT the shipping Ear worklet or published estate. The pinned model is general speech-trained English, **not** optimized for singing. No new host, CoreMIDI, API key, cloud recognizer, server-side runtime or model-training pipeline was introduced.

PocketSphinx is a genuine **blind phoneme decoder**, not a forced aligner. It emits phone symbols and 10-ms frame-derived start/end timestamps. Segment `prob` is often 1.0 and cannot be interpreted as reliable posterior confidence: it is deliberately omitted from the gate. All raw hypotheses remain **unqualified** pending calibrated confidence and singer-disjoint testing.

## Independent test set and errors

Human-sung reference: two pinned real, human-sung English source WAV/HTK aligned pairs from Lotte V's Project AI❤dol Public English Dataset (source commit `517c98a02f95c1b4c371a9cc9678ab3a974222a9`), with full wav/label hashes, ~100.3 seconds total, 563 timed intervals, one singer. Label timing was curated and published, not independently re-audited by Ear. Comparison excludes explicitly marked breathing/silence (`SP/AP/EP/GS/vf`) from reference and `SIL/+SPN+` from decoded phone tokens, with exclusions recorded. All ARPABET-like phones otherwise remain in the strict Levenshtein comparison. A **separately labeled optional approximate** `AX→AH`, `DX→D`, `EN→N` view never replaces the strict result.

| Human singing | Reference content phones | Raw decoded phones | Edit operations | Phone error rate |
| --- | ---: | ---: | ---: | ---: |
| `Spectrum` (development) | 197 | 156 | 90 substitutions + 44 deletions + 3 insertions | **69.54%** |
| `Enjoy_the_Silence` (different song, SAME singer) | 265 | 257 | 164 substitutions + 22 deletions + 14 insertions | **75.47%** |

The error rate is measured by sequence edit distance divided by reference phone count; it is **not** independent-speaker generalization, not a full time-alignment accuracy assessment and not a listener-perceived intelligibility result. Both tracks are held out from decoder training (external packaged model); the second is not a held-out singer. **Reproducibility defect found and corrected:** an initial decoder reuse carried acoustic adaptation between input files, giving misleading order-dependent 73.10% / 76.98% error rates and two noise false positives. A freshly constructed decoder per WAV, tested by reversing the source order, gives the **revised final values above** and one independent noise false positive. Only these source-order-invariant results are admissible.

On Sing's current private source, the independent decoder outputs the rough sequence `L AO ... EY ... N AA` (5 phones) from spoken macOS source, and `L ... P IY B N EH` with prolonged unknown/noise regions (6 phones) from the speech-derived sung candidate. It does not recover the three `la mi na` syllables. Pitches and vowels measured elsewhere do not change this result. The Sing original articulated baseline remains authoritative.

## Negative controls — actual false-positive defect

| Source | Raw phone hypotheses | Result |
| --- | ---: | --- |
| Four seconds of pure silence | 0 | Properly abstained |
| Four seconds deterministic low-level noise | **1** (`F`) | **False positive — fail** |
| Pitched sine tone (~261 Hz) | 0 | Properly abstained |
| Pitched two-harmonic tone | 0 | Properly abstained |

This recognizer must **not** certify phonemes until both a separate calibrated, model-independent non-speech gate and held-out phone-identity confidence/abstention evaluation exist. The results are not promoted by filtering away hard controls. A recognizer returning 1.0 for internal `seg.prob` has not demonstrated confidence calibration.

## Private reproduction

From Teatro's owning repo on the authorized macOS host (Python 3.13 available, approximately 55 MB local model/venv; no CI):

```sh
sh scripts/setup_private_allphone.sh
/tmp/ear-phoneme-venv/bin/python scripts/test_ear_private_allphone.py -q
/tmp/ear-phoneme-venv/bin/python scripts/ear_private_allphone.py \
  --candidate /tmp/sing-speech-macos.wav \
  --candidate /tmp/sing-speech-hybrid.wav \
  --candidate /tmp/ear-sung-human-timed-20261024/Spectrum.wav \
  --candidate /tmp/ear-sung-human-timed-20261024/Enjoy_the_Silence.wav \
  --negative /tmp/ear-negative-silence.wav \
  --negative /tmp/ear-negative-noise.wav \
  --negative /tmp/ear-negative-musical-pure.wav \
  --negative /tmp/ear-negative-musical-harmonic.wav \
  --human-sung-reference /tmp/ear-sung-human-timed-20261024/manifest.json \
  --report /tmp/ear-allphone-full-eval.json
```

The established full Ear owner-runner `scripts/run_private_speech_gate.py` gained optional `--allphone-python /tmp/ear-phoneme-venv/bin/python` when the real human singing reference flag is present. It runs the unchanged actual browser AudioWorklet, Apple lexical negative controls, source-vowel envelope, human-rated speech, human singing timing and the new real phone decoding with source SHA crosschecks. It keeps temporary services and resampled audio private and cleans them up. This is an **offline analysis boundary**; the AudioWorklet rendering callback is never used for expensive inference.

In local tests: new all-phone unit suite has **12 cases passed**, including unaltered data hashes, silence/noise controls, decoder-label blindness, tamper/false-second-singer rejection and edit arithmetic. Existing Ear suites have 43 cases, yielding **55** total related tests.

## Second-singer research, not a fabricated qualification

- Current real singing reference has **only one** singer. A second song does not equal an independent singer, regardless of label accuracy.
- [ACV-001](https://github.com/Archivoice/ACV-001), a separately curated male singing corpus, advertises manually reviewed HTK labels under CC BY-SA 4.0; the GitHub metadata alone does NOT provide the required bounded, directly verified WAV/label pair, and the author warns of issues in English labels. Do not invent source hashes or a second singer.
- [GTSinger](https://github.com/liangsw20/GTSinger) has multiple singers and time-aligned phones but restricts derivative/commercial use under CC BY-NC-SA 4.0. **No audio or labels downloaded/used**; a business research activity must not assume commercial clearance.
- [NUS-48E](https://huggingface.co/datasets/guey-khala-mari/NUS-48E) and other research corpora have different source, research-only, annotation and licensing constraints; no independent singer reference is admitted without explicit review.

## Unresolved acceptance requirements

1. Legally clear, independently annotated singer(s) disjoint from Lotte V, plus verified timestamp-and-label corpus auditing. Audio/video/music/voice-model rights remain distinct.
2. Calibrated **actual phone-identity** confidence and a non-speech / abstention gate tested against silence, musical tones, noise, breaths and close phonetic confusables, including reordered `la mi na` syllables. No score or target enters inference.
3. Holdout singer phone error and phoneme onset/offset error measured with declared threshold selection independent of final witnesses. Currently ~70–75% phone sequence errors are far outside viable acceptance.
4. Repeat actual Ear browser graph on original SHA-verified private Sing WAVs with proper standalone model authority and test receipts, without claiming the worklet itself became a recognizer.
5. Source-only research does not grant edition/publication authority. No source WAV, labels, model, derived voice bank or First Hearing was published.

**Verdict:** a real local phoneme inference implementation now exists, but the independent recognizer remains **UNQUALIFIED**. Development should address speech-to-singing transition preservation and phoneme confusability before considering a singing voice an intelligible instrument.
