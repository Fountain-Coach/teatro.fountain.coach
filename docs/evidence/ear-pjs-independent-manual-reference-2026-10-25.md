# Ear — an independently human-reannotated second singing source
25 October 2026 · Teatro/Ear owns reference and inference evaluation.
Sing, MIDI2 and midi2sampler remain unchanged. **Not a qualified
multi-singer phoneme recognizer.**

## Development outcome

Added a second real **singing source** from a different owning corpus
and an **independent human revision** of its phoneme identities and
timestamps. The subject is a Japanese song, distinct from the prior
human-sung English Project AI-dol / Lotte V reference. The PJS dataset
and the manual-label repo assert their own attribution and CC BY-SA 4.0
rights. The sources were selected **before** running the native Apple
sound model, and no source was swapped after seeing its results.

**IMPORTANT:** Ear's existing PocketSphinx 5.1.1 all-phone experiment is
based on an **English / CMU-style phoneme inventory**. PJS uses Japanese
romaji symbols, with distinctions that are case-sensitive. Using the
English decoder on this new reference and scoring its phone error rate
as if it were Japanese would fabricate a recognition result. No
Japanese source-blind phone decoder was installed or used here.

These two *separately sourced* human performances have not undergone
independent real-world identity verification. The external human
reannotation is an independent second *labeling pass*, NOT a third
adjudicator's verified phoneme truth. Thus the prior single-language,
singer-disjoint phoneme-recognition acceptance gate remains **BLOCKED**.

## Source rights checked before ingest

Original archive: **PJS: Phoneme-balanced Japanese Singing-voice
corpus, version 1.1**, Junya Koguchi & Shinnosuke Takamichi (2020).
Official author page:
https://sites.google.com/site/shinnosuketakamichi/research-topics/pjs_corpus
 explicitly declares **CC BY-SA 4.0**, including non-commercial and
commercial use, with attribution and ShareAlike conditions for
adaptations. The author also links to the independent manual relabel.

Original public archive is the authors' original Google Drive file:
`PJS_corpus_ver1.1.zip`, Google Drive object
`1hPHwOkSe2Vnq6hXrhVtzNskJjVMQmvN_`, nominal size **275,179,158**
bytes. No full archive was downloaded or full archive SHA claimed.
The bounded importer used **2,287,254 bytes** of HTTP partial-content
ranges to recover only predeclared members, with their original ZIP
CRC-32 and their independently recorded SHA-256. No arbitrary
archive paths were extracted; no third-party package was installed.

Second independent label source:
https://github.com/UtaUtaUtau/pjs-manual-labels
The author's README declares that singing-only HTK phonemes were
re-labeled manually with vLabeler to repair original annotation
mistakes, and declares **CC BY-SA 4.0** for the revision. Exact
immutable source revision:
`022d09bffeda9ca122d59a9e5ebfcedd98f5709a`,
file `v2/pjs001.lab`. It is a third party to the PJS original
recording, not a separate singer.

**Rights scope adopted here**: private listening-independent acoustic
and annotation diagnostics with provenance/attribution. The importer
does NOT authorize publication of the 16s WAV, new voicebank samples,
commercial vocal cloning, training a Singer instrument or making a
Satzfunk recording from it. Any actual public redistribution or
adaptation must separately satisfy the original CC BY-SA licensing,
attribution and applicable performers' rights.

## Exact private primary inputs

All material stays under
`/tmp/ear-pjs-manual-timed-20261025/` only.

| Owned item | SHA-256 |
| --- | --- |
| PJS `pjs001_song.wav` (16 sec, 48 kHz, 24-bit mono, archive CRC `65fea510`) | `cbd14289cea8c5cd2e7a859076a2448f852143f8e5868b7cb655270764cf4f3a` |
| Original PJS `pjs001.lab` (archive CRC `e17ceb2a`) | `864b4178871538f19125128945a6a1f03c690e215df064a247496508981bd4bf` |
| Independently manually relabeled `v2/pjs001.lab` | `a00d794e580c6210d2eb6cfb31511b75ada1f145b6fe954f3131270f8b81bf11` |
| Pinned manual label author's README | `d4ff8822e33d141a6eb3f8a34e3853a77002a996f572e8794ae46f727ec1dc05` |

The original 16.0-second WAV is bit-identical in every comparison.
Original published HTK labels cover about **15.733 seconds** and
include four `pau` intervals. The independent v2 labels extend
through **16.0 seconds** and distinguish pauses `SP` from an
audible breath `AP`. These are reference-annotation differences, NOT
changes to the audio or transcript.

**No phoneme labels were passed to the Apple acoustic classifier.**

## Original-versus-independent-human annotation audit

A deterministic, minimum-edit, one-to-one sequence alignment is
performed **only after the two immutable human/reference files
have been loaded**. Phone symbols are matched **exactly in their
original case**, without converting a Japanese nasal `N` to
lowercase `n`, inventing English ARPABET equivalents or interpreting
the original source labels as correct model output. Pause/breath
symbols are excluded for the *identity* comparison only.

| Source comparison | Measured value |
| --- | ---: |
| Original HTK total intervals | 75 |
| Manual v2 HTK total intervals | 78 |
| Original non-pause phones | **71** |
| Independently revised non-pause phones | **73** |
| Exact one-to-one aligned phone identities | **71** |
| Extra/inserted non-pause phones in revised version | **2** |
| Median absolute start-boundary revision, on matched symbols | **241.349 ms** |
| Median absolute end-boundary revision, on matched symbols | **238.204 ms** |
| Matched phones with either boundary changed by more than 50ms | **71 / 71** |

**Interpretation:** even with 71 phone identities corresponding in
sequence, an independently authored timing revision moved their
boundaries substantially. The difference may include global timing
conventions and changed pause treatment; this measurement does NOT
prove either annotator is universally right, and these figures
are **not** recognition precision, recall or F1. They demonstrate
the need to pin and audit which annotation authority is being used.

## Real unmodified source-blind vocal-acoustic test

Ear's already built Apple SoundAnalysis v1 evaluator ran on the
preselected PJS WAV, original Project AI-dol human-singer control,
and the two preselected VocalSet controls. No expected label, note,
score, lyric or phoneme was supplied to the classifier.

| Recording | Original native vocal-positive windows | Threshold status |
| --- | ---: | --- |
| PJS Japanese real human song | **24/31** | PASS |
| Prior English human-sung `Spectrum` | **80/85** | PASS |
| Original VocalSet `female9` | **11/14** | PASS |
| Original VocalSet `male2` | **9/20** | FAIL (preserved) |

Frozen threshold: SoundAnalysis `speech`, `singing` or
`humming` above class score .5 in at least half of two or more
windows. These are audio-event estimates, **not independent phone
identities or calibrated scores**.

Private original output:
`/tmp/ear-pjs-two-singer-native-20261025.json`.
Private full comparator witness:
`/tmp/ear-pjs-independent-label-witness-20261025.json`.

## Executable Ear ownership and integrity

- `scripts/ear_private_pjs_manual_source.py` enforces both upstream
  CC BY-SA notices, exact ZIP-origin and manually revised label
  SHA-256, CRC, predeclared ZIP members, 10 MiB network ceiling,
  48kHz/24-bit original source PCM, pinned independent GitHub commit,
  and no overwrite when a private record drifts.
- `scripts/ear_private_pjs_label_gate.py` parses original and revised
  HTK 100-ns timestamps with strictly sequential positive intervals
  and original WAV duration limits; compares **label versions only**,
  never model recognition, and verifies the exact native SoundAnalysis
  results on all four source SHA identities.
- `scripts/run_private_pjs_manual_reference.py` is the one-command
  repeatable Ear-owned development scenario. It compiles the existing
  first-party macOS classifier, reruns it source-blind on the same WAVs,
  and **refuses** a changed previous native result or label audit
  receipt. It never changes Ear's original English recognition route.
- `scripts/test_ear_private_pjs_manual_reference.py` checks rights,
  source and labels, separate human authorship without fictional
  third adjudicator, label parsing, case-sensitive symbols, original
  WAV time bounds, identity and interval differences, SHA forgery,
  model-language mismatch, unchanged acoustic controls, source-blind
  input rules, bounded archive ranges and no media/voicebank claims.

Private reproduction:

```sh
cd ~/Developer/teatro.fountain.coach
python3 scripts/ear_private_pjs_manual_source.py --fetch
/tmp/ear-phoneme-venv/bin/python scripts/run_private_pjs_manual_reference.py
/tmp/ear-phoneme-venv/bin/python scripts/test_ear_private_pjs_manual_reference.py -q
```

No author-side installation, grading or download requested; the
development workflow owns these prerequisites. There is **no** GitHub
CI, CoreMIDI, second MIDI plane, modified original Sing source,
released WAV, voice clone, model fine-tune or EstatePublisher action.

## Corpus prospectus: do not silently elevate adjacent sources

- **NUS-48E** is a strong *future* English reference: it describes 12
  singing subjects, original manual phone timing and a second reviewer
  checking another annotator's track. But its distribution rights
  and any required owner agreement are not sufficiently confirmed for
  automated company ingestion. **No NUS audio/labels fetched.**
  Primary paper:
  https://smcnus.comp.nus.edu.sg/archive/pdf/2012-2013/2013_05-Pub-NUS-48E.pdf
- **Annotated-VocalSet** is CC BY 4.0 but its added timestamps are
  **musical note onsets/offsets, pitches and lyrics**, not independently
  timed consonant+vowel phone boundaries. Do not rename note timings
  to phoneme evidence.
  https://doi.org/10.5281/zenodo.7061507
- **ACV-001 and ACV-002** are manually checked singing phoneme
  labels with CC BY-SA declarations, but both voice presentations
  belong to the **same singer**. Do not count them as two.
  https://github.com/Archivoice/ACV-001
  https://github.com/Archivoice/ACV-002
- **GTSinger, M4Singer, CSD** have additional terms, often
  noncommercial / consent / indemnity clauses. Do not accept
  those agreements or import their models/recordings on behalf
  of the company.

## Still missing before source-blind sung-phone recognition

A **same-phone-inventory, source-blind** model independently tested
against multiple performers, calibrated phone start and end accuracy,
a different singer held out for testing, explicit independent auditor
provenance, and the original non-speech negative controls passing.
The new Japanese reference can support a future Japanese model
evaluation once that model and inventories are admitted, but cannot
upgrade the existing English PocketSphinx phone-recognition result.

Ear compares source sound; Sing remains the owner of instrumentation;
the studio author retains publication authority.
