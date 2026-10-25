# Ear — two separately sourced singers: vocal acoustics, NOT timed phonemes
25 October 2026. Teatro/Ear owns assessment; Sing's instrument remains
unchanged. All original audio, reference manifests and classifier receipts
stay private under `/tmp`, outside Git and the publishing estate.

## Why this evidence exists

The previous genuinely timed human-singing phone references are two
tracks by **one** singer, Project AI-dol / Lotte V. The new source-blind
phoneme-and-both-boundaries diagnostic on those tracks reported
23.80% / 18.39% strict F1 at 50ms, with phone sequence error rates
69.54% / 75.47%. That is neither a phoneme recognizer nor speaker
generalization. A differently sourced singer must not be manufactured
by renaming a recording or treating synthetic TTS voices as humans.

This research milestone independently establishes **two different dataset
singer IDs** under VocalSet's declared CC BY 4.0 source license,
and evaluates their actual audio with Ear's **unchanged** native Apple
SoundAnalysis v1 model. It intentionally does NOT claim they have
independently audited phonetic identities or per-phone start/end times.

## Licensing and provenance before touching recordings

Primary dataset: **VocalSet: A Singing Voice Dataset**, version 1.1,
Julia Wilkins, Prem Seetharaman, Alison Wahl and Bryan Pardo (2018),
DOI https://doi.org/10.5281/zenodo.1203819.
Source: https://zenodo.org/api/records/1203819 .
Verified official Zenodo metadata **id 1203819**, `license.id=cc-by-4.0`,
one `VocalSet11.zip` 2,077,243,579-byte file, published archive checksum
`md5:0c09396242f946e7111ad7d8fc649b81`.
Copyright and performer-identification assertions beyond the deposit's
declared rights have **not** been independently audited; the importer
does not grant singer cloning, training, commercial voice-asset reuse or
further redistribution rights.

The competitor dataset **GTSinger** has phoneme-level TextGrid annotations,
but its original `dataset_license.md` adds **CC BY-NC-SA 4.0**, an
indemnity obligation and an affirmative employer-authority representation.
**M4Singer** likewise demands noncommercial use, indemnity and
employer-authority acceptance. Those agreements have NOT been accepted
on the author's/company's behalf, and **no samples** were imported from
either. Links to original notices:
https://github.com/AaronZ345/GTSinger/blob/main/dataset_license.md
and https://github.com/M4Singer/M4Singer/blob/master/dataset_license.md .
The existence of a downloadable file or detailed annotations does not
constitute permission to make it a Sing production voice.

## Actual owner-runner installation and bounded acquisition

`scripts/ear_private_vocalset_holdout.py` declares the two speaker-folder
IDs and exact ZIP entry paths *before* classifier inference.
An ordinary read-only Python HTTP range reader accesses only ZIP central
directory and the two chosen member spans from the official Zenodo API.
It refuses unbounded reads, a substituted host, a changed license,
changed record ID/ZIP metadata, unexpected member formats and
a total ZIP network transfer beyond 16 MiB. ZIP extracts use Python's
per-member CRC check. No third-party package, full archive, training
weights, new service or GitHub CI was installed.

**Actual transferred bytes: 2,635,963** (about 2.6 MB) out of a published
2.077 GB archive, from four full ZIP-index byte-range requests plus
the needed selected-member blocks. The entire ZIP MD5 is listed as
**upstream metadata only**: since the archive was not downloaded,
its full checksum has NOT been independently recomputed.
Each individually extracted WAV has been **SHA-256 verified**, plus its
ZIP member CRC and mono PCM duration/format.

Private original references (both straight-vowel-A scales, 44.1kHz mono):

| Dataset singer folder | ZIP member source | Original private PCM SHA-256 | Duration |
| --- | --- | --- | ---: |
| `female9` | `FULL/female9/scales/straight/f9_scales_straight_a.wav` | `d82ce344ad264b91924b823b046e6ec2779c8e5dcc7d26b89f5cddeadb0d3e7f` | 7.79152 s |
| `male2` | `FULL/male2/scales/straight/m2_scales_straight_a.wav` | `c18627d88576898b6b3a4f54a57b87a51a466e0382fc3e58ba4ccc69f16aaf7e` | 10.52807 s |

Private manifest:
`/tmp/ear-vocalset-ccby4-holdout-20261025/manifest.json`.
Its source labels say **the task is the vowel “a”**, not that any
specific phoneme started or ended at a witnessed second. VocalSet's
two different pseudonymous source IDs are recorded; we have NOT
independently verified the singers' real-world identities or asserted
that such identities are provably disjoint from Project AI-dol.

`scripts/run_private_vocalset_holdout.py` is the repeatable,
*development-owned* one-command scenario. It reads only the five
fixed, source-addressed audio sources, compiles the existing first-party
Swift native Apple SoundAnalysis verifier locally, passes only PCM to
the classifier (no labels, score or phone-target text), and then calls
`scripts/ear_private_vocalset_holdout_gate.py` for post-inference
validation and failure preservation. Its private outputs are
`/tmp/ear-vocalset-two-singer-native-events.json` and
`/tmp/ear-vocalset-two-singer-acoustic-witness-20261025.json`.
The second complete owner-run reproduced the **same** native
classification and evaluation receipts, without changing thresholds.

## Independent results — no cherry-picking

Apple SoundAnalysis v1, recorded OS
`Version 26.5.1 (Build 25F80)`.
Original, frozen decision: allowed labels **speech, singing, humming**,
minimum class score **0.5** per window, ≥2 windows and **at least
half** the windows vocal-positive. The model's class scores are not
calibrated phoneme probabilities; it can mistake music for voice.

| Audio-only condition | Vocal-positive / total | Pass original sound-event gate? |
| --- | ---: | --- |
| VocalSet `female9`, real vowel scale | **11 / 14 (78.6%)** | **YES** |
| VocalSet `male2`, real vowel scale | **9 / 20 (45.0%)** | **NO** |
| Original Project AI-dol `Spectrum`, human singer | **80 / 85 (94.1%)** | **YES** |
| Sing private WORLD frozen-spectrum | 0 / 9 | **NO** |
| Sing private WORLD evolving-spectrum | 2 / 9 | **NO** |

The held-out **male2 failure is retained without changing the choice,
source, model, threshold or wording**. Consequently
`allDatasetSingerAcousticChecksPass=false`.
These results demonstrate an additional recognition weakness:
even genuinely recorded human singing does not always clear the
native model's frozen vocal threshold.

No waveform was supplied as singing training data, copied into a
voice bank, transmitted to OpenAI APIs, inserted into Satzfunk or
published. Neither dataset singer provides independently verified
phone boundaries. This new witness therefore **does not extend**
the 2026-10-25 source-blind timed-phone result from one singer to
two speaker-disjoint, timed-phonetic references. That strict acceptance
gate remains **BLOCKED**.

## Verification and future gate

`scripts/test_ear_private_vocalset_holdout.py` contains **23 source
and correctness tests**: actual local WAV SHA and ZIP CRC, CC BY record
and file identity, restricted range reader, network bounds, failure
on substituted noncommercial license, source/manifest falsification,
speaker-ID swapping, claimed phone timing or voicebank use, model
source ID/order dependence, original native threshold and class
configuration, a faked positive result for male2, original synthetic
negative controls, missing phoneme authorization and no media release.

Independent old Ear tests must remain passing. This code does not
relax any phone word, vowel, singer, semantic execution, MIDI2, UI
or publication policy.

Reproduction on the authorized development Mac (engineering owns
setup; studio author is not asked to install software):

```sh
cd ~/Developer/teatro.fountain.coach
python3 scripts/run_private_vocalset_holdout.py
python3 scripts/test_ear_private_vocalset_holdout.py -q
```

**Next acceptance requirement, not presently satisfied:** a rights-cleared
collection with separately verified *actual performed* phoneme identities,
start and end times, independent annotation audit and at least two
genuinely separate real singers—then real, source-blind test audio,
speaker-disjoint model trials and preserved adversarial non-speech
negatives. The currently imported CC BY singer examples help evaluate
vocal presence, **not** phone recognition, pitch-quality certification
or word intelligibility.

Authored publication remains solely an editorial decision.
