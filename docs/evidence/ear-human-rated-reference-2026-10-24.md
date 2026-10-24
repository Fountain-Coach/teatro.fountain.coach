# Ear: independently human-rated pronunciation references — 24 October 2026

**Owning system:** Teatro / Ear. **Rehearsed instrument:** Sing, same typed MIDI 2.0 four-note score with midi2sampler's sampled-voice experiment. **Scope:** external evaluation only; no sample bank, model training, audio publication or author-operated listening verdict.

## Decision

Real human-recorded, expert-rated **speech reference evidence is now executable** in Ear. The additional independently selected *pronunciation challenge* exposes substantially higher word-transcription error than ordinary examples.

**Full singing phoneme recognition remains BLOCKED.** The human scores assess the *goodness of intended canonical phoneme pronunciation*, not a time-aligned observed phoneme stream. Apple's source-blind word ASR reports words, not consonant/vowel phone labels. Neither method qualifies automatic phoneme recognition or sung intelligibility.

## Source and usage scope

- **Original:** Zhang et al., *speechocean762: An Open-Source Non-native English Speech Corpus For Pronunciation Assessment*, Interspeech 2021. Upstream original source [OpenSLR SLR101](https://openslr.org/101/), CC BY 4.0; access to individual rows and WAVs from [mispeech/speechocean762](https://huggingface.co/datasets/mispeech/speechocean762).
- Original recording sources are human speakers; five human experts scored sentence, word and phone-level pronunciation quality. **These are aggregated judgments, not human-corrected phone timestamps.**
- Fixed, private, small subset: **12 ordinary utterances**, 2 distinct adult speakers in the original training split and 2 other adult speakers in the original test split; 1.3 MB of audio, **249 expert-rated phones**.
- Additional fixed **4 difficult utterances** selected by pre-existing *human* phone ratings, not Apple ASR or any Ear result; two new adult speakers from the train split and two other new adult speakers from the test split. 0.59 MB; **92 human phone ratings**, **16 below 1.5/2**, **6 explicit mispronunciation corrections**.
- In total **16 distinct human utterances, 8 separate speakers, 341 expert phone judgments**. All source audio, individual transcriptions, speaker pseudonyms, phone labels and model receipts are in private `/tmp`, not Git. Every WAV is full-file SHA-256 identified against its corresponding reference row. Cross-partition speaker leakage is rejected. No source recordings were altered to make them more singable.
- CC BY 4.0 enables attributed reuse under its terms, but **a speech research license is not an asserted performer grant to construct or distribute a recognizable cloned singing voice**. The Ear corpus is evaluation-only, and the code forbids promoting it into a Sing voice asset by default.

## Source-blind Apple word-transcription witness

Apple's previously installed `en_US` on-device SpeechTranscriber received only each WAV, **without the reference transcript, words, phone labels, Sing score or speaker identity**. After inference, Ear normalized both strings and used deterministic word-level edit distance.

| Private human material | Utterances | Reference words | Word edits | Word error rate |
| --- | ---: | ---: | ---: | ---: |
| Ordinary train-speaker reference | 6 | 41 | 2 | **4.88%** |
| Ordinary unseen test-speaker reference | 6 | 39 | 2 | **5.13%** |
| Expert-selected hard train-speaker challenge | 2 | 17 | 5 | **29.41%** |
| Expert-selected hard unseen test-speaker challenge | 2 | 15 | 4 | **26.67%** |

These are tiny, nonrepresentative samples and **not** a claimed published WER benchmark; the hard set was intentionally chosen for human-rated pronunciation mistakes. The contrast illustrates why a fluent word recognizer must not be mistaken for a robust phoneme evaluator. On the ordinary 12 utterances, 4 of 249 expert phone scores were below 1.5 and there were no explicit corrected mispronunciations; that is why the second, independently rated challenge set matters.

The real Sing private speech-to-singing candidate still yields “Love” in Ear's whole-phrase source-blind word test rather than `la mi na`. Ear's existing browser pitch worklet passes, but *lyric recognition and actual phonetic transcription remain blocked*. The pronunciation results above do not license a claim that a sung human voice was recognized.

## Actual executable evidence

The Mac already had the Apple transcription model installed; **no cloud inference/model download**. Using a small dataset-viewer window, only 16 human WAVs were downloaded (~1.9 MB), not the 520 MB original corpus. Source URLs were constrained to the dataset provider; a stored reference manifest cannot silently change labels or SHA identities on rerun.

The following procedures and unit tests are committed to the **Ear owner**, not copied to Sing:

```sh
# Real human recordings + the expert phone-goodness reference (network to Hugging Face)
python3 scripts/ear_private_human_corpus.py
python3 scripts/ear_private_human_challenge.py

# Private, audio-only independent recognition; no target transcript is passed
swiftc -parse-as-library scripts/ear_private_transcript.swift -o /tmp/ear-human-transcriber
/tmp/ear-human-transcriber --locale en-US \
  /tmp/ear-human-speechocean-20261024/train-*.wav \
  /tmp/ear-human-speechocean-20261024/test-*.wav \
  > /tmp/ear-human-transcripts.json
/tmp/ear-human-transcriber --locale en-US \
  /tmp/ear-human-pronunciation-challenge-20261024/train-*.wav \
  /tmp/ear-human-pronunciation-challenge-20261024/test-*.wav \
  > /tmp/ear-human-challenge-asr.json

python3 scripts/ear_private_human_reference_gate.py \
  --reference /tmp/ear-human-speechocean-20261024/manifest.json \
  --asr /tmp/ear-human-transcripts.json \
  --report /tmp/ear-human-reference-gate.json

python3 scripts/ear_private_human_reference_gate.py \
  --reference /tmp/ear-human-pronunciation-challenge-20261024/challenge.json \
  --asr /tmp/ear-human-challenge-asr.json \
  --report /tmp/ear-human-challenge-gate.json
```

Ear's already-established `scripts/run_private_speech_gate.py` additionally accepts `--human-reference`, `--human-asr`, `--human-challenge-reference`, and `--human-challenge-asr`. The unified witness still runs the **real shipped Ear AudioWorklet in a temporary Chrome graph**, native Apple ASR for `la mi na`, the source-blind bounded synthetic phone probes and original vowel-envelope acoustic comparison. The human reference is **a separate evaluation input**, not fed into singing or recognizer inference. All temporary browser services are stopped afterward.

The actual full run yielded:

- `browser=passed`
- `lexical-gate-blocked`
- `syntheticPhoneticProbe=NOT_QUALIFIED`
- `humanSpeechReference=human-speech-reference-admitted-phoneme-recognizer-blocked`
- `humanPronunciationChallenge=human-speech-reference-admitted-phoneme-recognizer-blocked`
- `phonemeRecognition=NOT_IMPLEMENTED`
- `mediaPublished=false`, `testServicesTerminated=true`

Reference/score validation rejects audio SHA mismatches, apparent phoneme-time alignments that do not exist, missing phone scores, speaker leakage, an unqualified hard-challenge set and implied authorization to clone voices.

## Singing corpus investigation: license and annotation requirements

- [GTSinger](https://huggingface.co/datasets/AaronZ345/GTSinger) offers paired natural speech, professional singing and manual phoneme-level alignment, but the original corpus [dataset license](https://github.com/AaronZ345/GTSinger/blob/main/dataset_license.md) is **CC BY-NC-SA 4.0**, requiring separate legal consideration for commercial Fountain Coach instrument development. We **did not use/download its recordings**, nor copy their annotations or train on them.
- Original [VocalSet, Zenodo 1442513](https://zenodo.org/records/1442513) uses **CC BY 4.0** and includes real human vowel singing, but source archive files are approximately **6.0 GB and 2.1 GB**; another aggregate archive at Zenodo 10200775 is ~2.5 GB. The currently connected Mac has limited disk capacity. VocalSet's technique/vowel exercise metadata is not the independently human-corrected, time-aligned consonant/phoneme reference needed for this acceptance gate, so **we did not download its large archives or invent labels**.

**Next independent requirement:** legally cleared, human-verified time-aligned phoneme labels for real sung utterances, held-out independent singers (not only macOS synthesized voices), positive/confusable/negative controls and calibrated abstention. Even when audio and manual phoneme boundaries become available, they are *references*: implementing an actual recognizer remains a separate, measured milestone. Recognizer output and editorial authorization for a public First Hearing remain distinct.
