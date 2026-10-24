# Ear — independent native vocal-class evidence and storage recovery
24 October 2026 · Teatro / Ear source owner · research evaluation only

## Decision

**A bounded native vocal-class diagnostic is supported; phoneme recognition and Sing's actual sung intelligibility remain BLOCKED.** Apple SoundAnalysis `SNClassifierIdentifier.version1` independently identifies `speech`, `singing` or `humming` evidence in private reference audio without seeing lyrics, expected phonemes, MIDI 2.0 score or human phone-time alignments. Its output is **not** a human perceptual evaluation or a calibrated probability that words are understood.

The key direct comparison: **19/19** known human vocal/spoken positive controls have vocal-class evidence; **0/11** original and newly generated adversarial non-speech controls are falsely admitted as having such evidence. The **original Sing speech-derived sung WAV fails this vocal-evidence heuristic** (0 positive windows) even while existing acoustics preserve the coarse vowel envelope. SoundAnalysis classifies the same Sing take predominantly as music, a wind instrument or a synthesizer. The source spoken `la mi na` control passes.

This supports a new engineering priority: first make the **speech-to-singing transform preserve actual vocal spectral and articulation structure**, then rerun phone recognition. It does NOT authorize claiming that the independent classifier certified acoustic naturalness, lyrics or publisher approval. The original articulated Sing take remains the development baseline.

## Native algorithm and source separation

Implementation: `scripts/ear_private_apple_sound_gate.swift`. Uses Apple's **OS-provided** SoundAnalysis v1 classifier on private WAVs; fresh `SNAudioFileAnalyzer` and `SNClassifySoundRequest` for each input. Fixed 1.0-second analysis window, 0.5 overlap. A window has vocal evidence if the greatest label score among `speech/singing/humming` is **at least 0.50**; a source passes the *research heuristic* if at least two windows were generated and at least 50% of those windows show vocal evidence. These thresholds were frozen **before creating nine novel adversarial waveforms**.

Unlike the PocketSphinx research wheel, Apple's model is bundled with macOS. **Its model-weight SHA is not supplied**; reproducibility is OS-build-specific, not a cryptographic guarantee for later Apple upgrades. Actual execution: **Version 26.5.1 (Build 25F80)**. Explicitly re-evaluate after macOS changes. Every source used during actual inference is SHA-256 identified in the private receipt.

Role tags (`candidate`, `negative`) are recorded as post-inference evaluation metadata; no score/lyrics/reference phoneme labels/singer identity enter the native model. Independent `scripts/ear_private_native_sound_eval.py` verifies the complete source-addressed private corpus, declared thresholds and role separation after Apple has already inferred its labels. It rejects altered WAV hashes, invented model weights, confidence/phoneme claims, missing controls and changed thresholds. Tests demonstrate that reversing input order gives the same native classification in this OS build.

The singing references remain the two real human WAV/HTK pairs from **one** singer, not independent singer-disjoint evidence. The human spoken references comprise 12 standard and four expert-rated mispronunciation examples from several separate speakers. Only private /tmp reference media and JSON receipts; no media/voicebank/model weights/credentials go into Git.

## Observations: actual private witness

| Class | Source count | Native vocal evidence | Interpretation |
| --- | ---: | ---: | --- |
| Expert-rated human ordinary speech | 12 | 12 | Spoken audio positive |
| Expert-rated human pronunciation challenge | 4 | 4 | Vocal even when difficult to transcribe |
| Published human-sung clips, one singer | 2 | 2 | Singing/humming/voice positive |
| Sing original spoken `la mi na` source | 1 | 1 | Speech positive |
| **Sing speech-derived sung candidate** | **1** | **0** | **FAIL** vocal-evidence diagnostic; primarily music/synth/wind |
| Nine **new** deterministic non-speech challenges generated after frozen thresholds | 9 | 0 | Bounded novel negatives |
| Original noise + original held-out chirp | 2 | 0 | Bounded previously known negatives |

The independent new controls include rising/falling glissandi, repeated synthesizer notes, an oscillating whistle, staccato chords, formant-like synthetic partials, colored and rhythmic noise, percussive rasp and a bell pattern. Every deterministic source WAV has its own private SHA-256 ID. None of the selected reference music or sound-classification sources were copied into the instrument's sample bank.

Important **three-stage diagnostic**: the earlier PocketSphinx decoder produced one false phone from the original *chirp*. The WebRTC activity screen let it survive. The separately OS-supplied classifier reports **no vocal evidence** for that same SHA-verified chirp, so the *experimental triple-screen candidate count* changes from 1 to **0**. That is not a general false-positive-rate guarantee, a calibrated phoneme decision, or proof of a listener-recognized syllable. The raw decoder's original false positive remains recorded, not overwritten.

### Current recognition deficits unchanged

- Ear's end-to-end Apple word-transcript test still returns `Love` for the speech-derived sung phrase whose intended words were `la mi na`, while the spoken source transcript is `La, me, nah.`.
- The separate, order-isolated PocketSphinx all-phone test on 100 seconds of human singing still has **69.54%** and **75.47%** strict phoneme sequence errors, against two tracks by the same singer.
- WebRTC VAD still falsely marks musical tones as voice-like; it is not a phoneme recognizer.
- The Apple sound-event model's `speech`, `singing` and `humming` labels do not imply consonant identity or phone-time recognition.
- Nothing qualified an actual voicebank, public singer identity, intelligible First Hearing or published media.

## Disk-space prerequisite verified

The Mac was critically low at **~1.2 GB free** on its internal APFS Data volume. An inactive October 22 EstatePublisher acceptance worktree under `/tmp/fc-m2-shared-shell-acceptance` had **~1.1 GB** of ignored, reproducible Swift `.build` artifacts. Source worktree was clean, no process was using those exact artifacts, and Git confirmed the build directory was ignored. **Only** `/tmp/fc-m2-shared-shell-acceptance/apps/estate-publisher/.build` was removed, after verifying its exact path, not the worktree itself, Git history, original source, releases, private Ear reference data or published assets. Immediately afterward, available space increased to **~2.1 GB** (later observed ~2.3 GB). The larger `/Volumes/DockerDisk` volume has around **65–66 GB** available; future heavy model builds should use the volume, not the constrained internal drive.

## Second human singer — admission audit, still OPEN

1. [ACV-001 male singing corpus](https://github.com/Archivoice/ACV-001) describes Jonathan Huang's 16-bit, 44.1-kHz recordings and partially/manual-checked HTK labels under **CC BY-SA 4.0**, with additional model-use clarifications. **Actual GitHub HEAD and recursive tree were inspected:** it contains its README and language song-list files, **not** corresponding WAV/.lab pairs. The publisher also explicitly warns of faulty English annotations after prior data loss and automatic reconstruction. Therefore no verified audio-label SHA pair, clean English label audit or demonstrated song/right-of-use contract is available here; **not admitted**.
2. [GrimesAI HTK-style labels](https://github.com/lottev1991/grimesai-svs-labs) are separately published under **CC BY 4.0**, but that license covers labels **only**, not the original Grimes vocal stems. The README links to a separate external stem distribution, states distinct performer/audio terms, and reports **50/50 royalties for commercial models** using the labels/stems. No stem or model was downloaded/assumed cleared; **not admitted** without terms review.
3. [Jingju a cappella singing annotations](https://zenodo.org/records/1323561) provide several singers with annotated phone boundaries but list **CC BY-NC** for the annotations and much of the WAV audio. The language-specific phone inventory and separate rights are not a drop-in English singer witness; no bulk recording archive downloaded.
4. [GTSinger](https://huggingface.co/datasets/GTSinger/GTSinger) is multi-singer and aligned, but its source license is **CC BY-NC-SA 4.0**. Do not silently introduce its large restricted samples into a commercial instrument's training/evaluation assets.

**Acceptance requirement:** a *second* independently identified real singer, source-addressed small WAV and published/manual verified timed phoneme labels (preferably matching the English phone inventory), authorized for the precise private evaluation use, a documented audio/singer/song licensing contract, and independent test-witness separation. A documentation URL or song list alone cannot satisfy it.

## Reproduction — source-only

```sh
cd ~/Developer/teatro.fountain.coach
python3 scripts/ear_private_sound_novel_controls.py
swiftc -O scripts/ear_private_apple_sound_gate.swift \
  -o /tmp/ear-private-apple-sound-gate
python3 scripts/test_ear_private_native_sound.py -q

# One comprehensive Ear-controlled run, with the existing private source
# WAVs, human speech and singer manifests previously admitted:
python3 scripts/run_private_speech_gate.py \
  --score ../sing/examples/sustained-melisma.json \
  --manifest /tmp/sing-speech-macos.json \
  --spoken /tmp/sing-speech-macos.wav \
  --procedural /tmp/sing-speech-procedural.wav \
  --speech-derived /tmp/sing-speech-hybrid.wav \
  --phonetic-reference /tmp/ear-phonetic-cv-20261024/corpus.json \
  --novel-phonetic-witness /tmp/ear-phonetic-new-voices-20261024/novel-corpus.json \
  --human-reference /tmp/ear-human-speechocean-20261024/manifest.json \
  --human-asr /tmp/ear-human-transcripts.json \
  --human-challenge-reference /tmp/ear-human-pronunciation-challenge-20261024/challenge.json \
  --human-challenge-asr /tmp/ear-human-challenge-asr.json \
  --human-sung-timing-reference /tmp/ear-sung-human-timed-20261024/manifest.json \
  --allphone-python /tmp/ear-phoneme-venv/bin/python \
  --activity-controls-manifest /tmp/ear-activity-controls-20261024/manifest.json \
  --native-sound-novel-manifest /tmp/ear-sound-novel-nonspeech-20261024/manifest.json \
  --receipt /tmp/ear-integrated-native-sound-20261024.json
```

This is source-controlled, optional, owner-run evaluation using macOS's installed classifier; no GitHub CI, no CoreMIDI or server deployment, no model download or media publication. Ear's lexical and phoneme acceptance and publication authority remain separate and **blocked**.

## Verified integrated acceptance execution

The actual full source-addressed local run completed on the connected Mac, not merely a source review. Eight relevant test suites passed: **79/79 automated test cases** (10 native sound, 11 strict WebRTC, 15 all-phone, 12 real-sung timing, 9 human speech, 11 bounded synthetic phonetic, 6 independent Apple lexical, 5 envelope). Source generator reruns reproduce private SHA identities, the native 3-file order reversal is identical, and the original Ear browser worklet executed.

Observed final receipt: `browser=passed`, `lexical-gate-blocked` (`La, me, nah.` versus `Love`), `phonemeRecognition=RAW_ALLPHONE_HYPOTHESES_NOT_QUALIFIED`, prior allphone 69.54%/75.47% PER, prior WebRTC held-out chirp 1 -> 1 false phone and **failed**, native human/spoken positive vocal evidence 19/19, nine novel sound negatives 0/9, 11 including two previous negatives 0/11, derived Sing candidate `vocalEvidence=false`, old chirp after native diagnostic 1 -> 0. `mediaPublished=false`; `testServicesTerminated=true`. The raw independent phone errors and prior WebRTC failure remain preserved in the receipt. Source WAVs, phoneme labels, speaker metadata and Apple model files were not staged for Git or publication.
