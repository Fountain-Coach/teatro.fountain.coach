# Ear — real singing phoneme ID plus timing, source blind and NOT qualified
25 October 2026 · Teatro / Ear owns recognition evidence, Sing owns the
instrument, and the author alone approves publication.

## Decision

**A new independently executable, source-blind phone-identity-plus-time
verifier is implemented and integrated into Ear's private execution graph.
It runs on source-blind decoder output and the existing published, hashed
human singing annotations.** Recognition still **fails**. Neither a phone
sequence nor a timed phoneme boundary is certified as a listener would
hear it. The performance results below are comparisons to the original
published *human-curated but not independently reaudited* time labels.

The issue exposed by Sing's macOS voice cohort remains independent:
a phoneme sequence/timing label for the chosen Karen `la mi na` source
was only provisionally derived from source activity. Human-rated speech
references have phoneme goodness scores but do **not** have published
phone start/end labels. It would be dishonest to silently turn either
into independently verified phoneme ground truth.

The existing human-sung sources are only one singer, with creator-specific
voice/model-use restrictions and copyrighted songs. They are admitted
**for private evaluation only**, not a reusable voice bank, singer license,
training corpus, album, estate or public edition.

## New executable contract

`scripts/ear_private_phone_boundary_gate.py` accepts the original,
fully completed **PocketSphinx 5.1.1 source-blind audio-only** all-phone
receipt and **separately hashed human-sung HTK 100ns** reference manifest.
Decoder model and individual acoustic files are checked against the
already pinned independent model SHA digests. Every original WAV
and label file must still match its separately pinned upstream SHA.

No score, phoneme target, phone label, word, lyric, speaker ID or reference
boundary enters decoding. The reference label data becomes visible
**only after inference** as input to the new evaluator.

The evaluator preserves the **unaltered** strict phoneme edit-distance
metrics from the original all-phone receipt, then matches **exact phone
identities** with a deterministic, minimum-edit one-to-one sequence
alignment. It never uses reference time to select ambiguous matching
phone identities: optimistic reference-time forced alignment is forbidden.

A strict timed phone is correct only when:
1. Its phoneme *symbol* matches the published reference in the
   post-inference one-to-one sequence alignment.
2. Its **start time AND end time** are each within the **same fixed
   threshold** of the published reference boundaries.

Research comparisons at **50 ms and 100 ms**, declared in source before
the first real measurement, are computed as precision, recall and F1
against **all reference phones and all raw hypothesized phones**.
A research F1 target **0.80** is explicit; this is **not** authorization
to call phoneme recognition or human listening qualified. No
percentage from lexical ASR, VAD, SoundAnalysis, or the score plane
can be substituted for correct timed phonemes.

The recognizer runs in the already installed local
`/tmp/ear-phoneme-venv/bin/python`, backed by the already pinned
PocketSphinx acoustic model. This is the existing research binary
and not a dependency added to the normal instrument, MIDI2 transport,
production host or publisher. Source and result WAV/HTK/JSON receipts
remain private under `/tmp`; none enters Git. All Ear output fields
explicitly remain `phonemeIdentityRecognitionQualified=false`,
`humanTimedLabelsIndependentlyReaudited=false`,
`independentSecondSinger=false`, `mediaPublished=false`.

## Source-addressed real results

Pinned published human-sung source: Project AI-dol / Lotte V,
upstream source commit `517c98a02f95c1b4c371a9cc9678ab3a974222a9`.
One singer and two *different songs*, not different singers.
The two WAVs total **100.29 seconds** and have **563** original HTK
intervals, including breaths/silences and **462 speech-phone intervals**.
Labels are human-curated published annotations, **not** a newly
independently audited transcript/phone-time truth.

The prior audio-only source-blind receipt SHA-256 is
`fc0ff7903f959209e7a380febf54a1f62fa6326019ae4795acfd4b006b6ec714`.
The original reference manifest SHA-256 is
`eacd0db460df8bdd5ef48643284d70908f83cd76c97209b20f316d525575b2cc`.
Original raw phone error rates are exactly unchanged.

| Diagnostic | Spectrum (development) | Enjoy the Silence (same-singer separate song) |
| --- | ---: | ---: |
| Published reference speech phones | 197 | 265 |
| Source-blind hypothesized speech phones | 156 | 257 |
| Original strict phone error rate | 69.54% | 75.47% |
| Exact sequence-aligned phone identities | 63 | 79 |
| Identity-only F1, **without timing** | 35.69% | 30.27% |
| Identical phone and **both boundaries** at 50ms | **42** | **48** |
| **Strict timed phone F1 at 50ms** | **23.80%** | **18.39%** |
| Identical phone and both boundaries at 100ms | 50 | 58 |
| Strict timed phone F1 at 100ms | 28.33% | 22.22% |
| Median start-boundary error *among identity-matched phones only* | 25.0ms | 20.82ms |
| Median end-boundary error *among identity-matched phones only* | 15.0ms | 17.71ms |
| **80% F1 research target** | **Not met** | **Not met** |

Interpretation: the model often finds reasonably nearby boundaries
*for the relatively few matching phoneme identities*, but **most
reference phones are still missing or substituted**. The conditional
median timing numbers must never be generalized to incorrectly decoded
phones or taken as a valid phoneme-alignment model.

The prior non-speech control's original **one falsely hypothesized phone**
remains recorded. The existing separately held-out adversarial chirp
also remains an unresolved false positive under WebRTC activity
screening. No new step suppresses these or silently changes baseline
rates to create a pass.

## Independent reproductions

First real test with the exact original receipt:
```sh
cd ~/Developer/teatro.fountain.coach
/tmp/ear-phoneme-venv/bin/python \
 scripts/ear_private_phone_boundary_gate.py \
 --allphone /tmp/ear-allphone-full-eval.json \
 --human-sung-reference /tmp/ear-sung-human-timed-20261024/manifest.json \
 --report /tmp/ear-phone-boundary-witness-20261025.json
```

An independent **new decoder run** then processed the **same two original
human-sung WAVs in reverse order**, with a fresh model decoder for each WAV.
Both returned the **exact same full sequence of phoneme symbols and timed
decoder intervals**, byte-for-byte as structured data, as the previous
run. The boundary evaluator returned the **same two full witness records**.
Original stage labels never entered either decoder. The reversed
source-blind all-phone receipt is private:
`/tmp/ear-private-phone-reverse-decoder-20261025.json`,
SHA-256 `0947326cc76898e4b0b2ee172c6423631747017c88546d7adda618856a8c310e`.
This is repeatability on one pinned model/build, **not** generalization
to unseen singers or independent proof of human annotation correctness.

A new **23-test** `test_ear_private_phone_boundary.py` covers exact
and unmatched identities, start-only versus **both** boundaries,
duplicated predictions and edit-path ambiguity, deterministic
decoding order, invalid/overlapping timestamps, source/label hash
tampering, model fingerprint drift, forbidden reference-lyric input,
fake singer count, forged raw phone outputs and no-publication
assertions. The synthetic test vectors verify the **metric's arithmetic
only**, not natural speech-recognition quality.

## Integrated Ear workflow

`scripts/run_private_speech_gate.py` now automatically invokes the
new post-inference verifier **after** the existing `allphone.json`
is fully produced. It takes the exact model receipt and approved
private human singing reference; it cannot access or alter the
song reference during earlier decoding. The resulting
`humanSungPhoneBoundaries` field travels with the complete private
Ear end-to-end receipt. Its qualification, singer count and publication
flags are checked at the integration boundary.

This extension does not change:
- Sing source or the original authorized articulated baseline;
- Fountain-Coach/midi2 typed packet authority or midi2sampler;
- Ear's lexical aliases, phone decoder, training weights, VAD,
  source activity, singer data selection, acceptance thresholds,
  or independent AudioWorklet;
- Reframe, Satzfunk, EstatePublisher, GitHub CI or public media.

The next legitimate development milestone is an independently
audited, **rights-scoped phoneme-identity-and-timing reference** with
multiple real singers and a predeclared phone inventory. The above
fixed results provide a difficult, repeatable *diagnostic*, not
permission to promote synthetic voice rendering or to claim it
understands `la mi na`.
