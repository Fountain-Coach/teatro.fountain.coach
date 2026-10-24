# Ear — bounded phonetic reference: independent speakers and truthful abstention
24 October 2026

**Owning repository:** Teatro/Ear. **Instrument under test:** Fountain-Coach/Sing, built on typed MIDI 2.0 and pinned midi2sampler DSP. **Release:** NO MEDIA / NO PUBLICATION.

## Decision

**Full sung phoneme recognition remains BLOCKED.** No recognizer demonstrated correct source-blind recognition of `/l ɑ/, /m i/, /n ɑ/` against independently labelled, held-out speech and singing. The acoustic vowel test does produce promising **raw `/i/`-nucleus hypotheses**, but an additional speaker-disjoint witness missed two intended `/i/` examples. Therefore the externally admitted phoneme output remains **unknown** even where the internal research classifier hypothesizes `/i/`.

This is a real **negative acceptance result**: no author-operated listening grade, no fabricated recognition, no automatically admitted voice pack. Ear's word-level Apple SpeechTranscriber witness still rejects the whole sung phrase (previously reported `Love`), despite correct MIDI2 pitch and broadly preserved vowel spectrum.

## Independent reference construction

The reference audio was synthesized from macOS system `say` voices **outside Sing** and kept under `/tmp`. No OpenAI API access, model download, cloud request, CoreMIDI, new application runtime, server or public assets. Spoken English text prompts (e.g. `lah`, `mee`, `nah`) specify intended syllables **but are not independently human-corrected phoneme annotations**. This must not be described as ground-truth human phoneme recognition.

- Training: **36** isolated synthetic consonant/vowel samples, from four distinct voices (Fred, Daniel, Karen, Rishi), nine classes `la mi na ma ni li no lo mo`.
- Calibration: **32** inputs from *different* voices (Moira and Tessa), including consonant confusables, vowel-only prompts, silence and noise.
- Prior exploratory witness: **15** examples from Samantha, never used to train or calibrate. Samantha is the voice of Sing's own private spoken-source control, so this is *not* the final independent witness.
- Fresh post-threshold witness: **45** examples from three **additional** disjoint voices (Kathy, Aman, Kate Enhanced), including six unfamiliar syllables/vowel-only controls per voice. These voices were introduced **after** freezing the narrow vowel detector's decision thresholds. Aman required an explicitly documented `ahh` pronunciation for a wordless `ah` sample that was otherwise silent. The source manifest preserves exact actual prompts and SHA-256 hashes.
- No synthetic reference audio, generated private model, or voice bank is committed to Git. Only procedures, tests and this receipt summary are public source.

## Results, not wishes

| Source-independent task | Calibration | Earlier exploratory witness | New post-freeze voices | Decision |
| --- | --- | --- | --- | --- |
| Nine-class consonant–vowel acoustic label | 3/18 positive, 14/14 unfamiliar rejected | 2/9 positive, 6/6 unfamiliar rejected | Not promoted to new-speaker witness | **FAIL**: insufficient consonant recognition |
| Three-way coarse vowel category `ɑ / i / oʊ` | 22/30 correct, 2/2 nonspeech rejected | 12/15 correct | No final qualification | **FAIL**: dialect and /ɑ/ vs /oʊ/ ambiguity |
| Narrow, frozen `/i/` vowel-nucleus proxy | 8/8 intended /i/ detected, 0/24 other false positives | 4/4 intended /i/, 0/11 other false positives | **10/12 intended /i/**, **0/33** false positives | **FAIL**: 83.3% fresh-speaker sensitivity, below declared 95% gate |

The narrow `/i/` heuristic's thresholds were fixed at spectral similarity **≥ 0.84** and a nearest-other vowel similarity margin **≥ 0.075**, prior to generating the 45 new-speaker recordings. It did **not** lower the threshold to pass those voices. Both misses were explicit **abstentions**, from a too-short/insufficiently stable voiced region: `Aman li` and `Kate Enhanced ee`. These are reference-data and segmentation limitations; class correctness cannot be inferred on an abstention.

A separate synthetic pitched sine and two-harmonic tone were tested as non-speech negatives: neither produced an accepted `/i/` acoustic match. Source-blind amplitude segmentation identified three isolated sound regions in the *speech-derived* Sing WAV and only one broad region in the original procedural recording; **no syllable labels or MIDI score were passed to the detectors**.

## The actual private singing input

- Spoken source SHA `0112aaf01cf6c83d9c695b908f4211b376ce8b5b0e04654995aff447fb44bdbb`
- Singing sample SHA `42b79af5aec3ff1efbcae0b3caf9e43ab2adab4cdd4149376b9cad5329704d6b`
- Extended articulation variant SHA `aae8d04af8590ee58506a17eb836ed00c79a5ef47c228f91468cb676732bffaa`

The research-only `/i/` detector emitted the raw pattern `[unknown, i, unknown]` from both private 5.2-second singing takes, with independently detected syllable-sized islands around **0.005–2.105 s**, **2.145–3.305 s**, **3.345–4.805 s**. The score was *not* an inference input.

**Crucial:** because fresh-speaker recall did not pass 95%, the evaluator exposes the **admitted result `[unknown, unknown, unknown]`**. The raw middle `/i/` candidate is not certified phoneme recognition, an identified `mi` syllable, or proof of listener intelligibility. Consonant identity and vowel `/ɑ/` remain unresolved.

## Repeatable private reproduction

From the Teatro repository on an authorized macOS host with the system voices already present:

```sh
python3 scripts/test_ear_private_phonetic_probes.py -q
python3 scripts/ear_private_phonetic_corpus.py
python3 scripts/ear_private_cv_probe.py \
  --reference /tmp/ear-phonetic-cv-20261024/corpus.json \
  --candidate /tmp/sing-speech-hybrid.wav \
  --report /tmp/ear-private-cv-witness.json
python3 scripts/ear_private_vowel_probe.py \
  --reference /tmp/ear-phonetic-cv-20261024/corpus.json \
  --candidate /tmp/sing-speech-hybrid.wav \
  --report /tmp/ear-private-vowel-report.json
python3 scripts/ear_private_new_cv_witness.py
python3 scripts/ear_private_i_vowel_gate.py \
  --reference /tmp/ear-phonetic-cv-20261024/corpus.json \
  --novel-witness /tmp/ear-phonetic-new-voices-20261024/novel-corpus.json \
  --candidate /tmp/sing-speech-hybrid.wav \
  --report /tmp/ear-i-frozen-independent-witness.json
```

Only synthetic system voices and private source WAVs are used. The immutable Git source and reference manifests are separate; no generated corpus, private output, or credentials belong in public Git.

### One integrated Ear-owned acceptance run

The established full browser + native-lexical + vowel-spectrum witness now also accepts independent synthetic reference manifests, without silently promoting a phoneme classifier:

```sh
python3 scripts/run_private_speech_gate.py \
  --score ../sing/examples/sustained-melisma.json \
  --manifest /tmp/sing-speech-macos.json \
  --spoken /tmp/sing-speech-macos.wav \
  --procedural /tmp/sing-speech-procedural.wav \
  --speech-derived /tmp/sing-speech-hybrid.wav \
  --phonetic-reference /tmp/ear-phonetic-cv-20261024/corpus.json \
  --novel-phonetic-witness /tmp/ear-phonetic-new-voices-20261024/novel-corpus.json \
  --receipt /tmp/ear-integrated-phonetic-receipt-20261024.json
```

**Actual macOS execution passed the test harness** and produced that private unified JSON receipt: `browser=passed`, `status=lexical-gate-blocked`, `syntheticPhoneticProbe=NOT_QUALIFIED`, `phonemeRecognition=NOT_IMPLEMENTED`, `mediaPublished=false`, `testServicesTerminated=true`. Both source identities are crosschecked. This is not a success verdict for sung phonemes. Tested the additional 11 offline phonetic unit cases, 6 original Ear lexical cases and 5 independent envelope cases: **22/22 tests passed**, while the real *recognizer qualification itself failed*.

## Next acceptance requirement — **still open**

Ear requires independently phoneme-annotated natural speech and singing (proper licensing and performer consent), a validated recognizer whose inference does not receive expected lyrics, consonant and vowel onset/transition timing, held-out independent singers, negatives and near-confusables, reliable abstention and measured false positive/negative rates. A small, dialect-sensitive, macOS-TTS-trained acoustic template matcher is **not** that recognizer.

The naturalistic OpenAI speech-source adapter remains dry-run only, because no authorized API credential is present in the development environment. Rights to transform API-generated speech into a voice bank must be separately reviewed. No permission or author action is assumed; author retains editorial publication authority.

**Status:** independent phonetic engineering reference and fail-closed probe preserved; **Sing's original articulated baseline remains authoritative**. [Ear recognition issue #1](https://github.com/Fountain-Coach/teatro.fountain.coach/issues/1) must remain open.
