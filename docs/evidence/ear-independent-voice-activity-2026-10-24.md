# Ear: independent voice-activity veto, adversarial non-speech witness
24 October 2026 — Teatro/Ear. **Research-only, source code; not a released singer.**

## Decision

The existing raw all-phone decoder (PocketSphinx 5.1.1; source-order isolated, phoneme/score-blind) sometimes invents phonemes from non-speech. Ear has implemented and independently evaluated a bounded **WebRTC VAD activity screen** with pinned local `webrtcvad-wheels==2.0.14.post1`. It is separate from the phoneme decoder and never receives expected syllables, MIDI score, lyrics or reference labels.

**Do not admit it as a qualified speech detector, phoneme confidence or intelligibility measurement.** At strict mode 3, VAD misclassifies pure musical tones and several unseen non-speech signals as voice activity. One held-out chirp still produces a false phoneme even after both detectors. The new audio gate is therefore **diagnostic only**. Ear reports both the original decoder's raw output and the experimental post-activity-screen count. **Zero phones are certified as recognized.**

## Reproducible frozen screen

- WebRTC VAD, 16-kHz mono PCM16, 20-ms frames, **mode 3**; fresh VAD instance per source, as with the pinned fresh PocketSphinx decoder.
- Source-blind acoustic screen: at least **200 ms** consecutively VAD-active plus at least **15%** active frames across the WAV. This frozen configuration was fixed using original spoken/sung inputs and pre-existing silence/noise/tone fixtures **before the new adversarial corpus was created**. New witness results must not tune it retroactively.
- Exactly one digest-verified PCM16 stream is shared by the activity analyzer and phoneme decoder. Source WAV and resampled PCM SHA-256 receipts remain private.
- No per-phone calibrated likelihood is available; internal PocketSphinx probabilities are **not** interpreted as calibrated. WebRTC VAD can detect tonal periodicity and is not a validated music-vs-speech classifier.
- Threshold changes require a **new** prespecified calibration population and subsequent independently held-out witnesses. Never soften acceptance to call this qualified.

## Actual data, distinct roles

The source-only deterministic negative generator creates **11** separate 3-second, 16-kHz, SHA-256 identified PCM files kept under `/tmp/ear-activity-controls-20261024/`: four calibration controls (low and moderate uniform noise, single sine tone, dual tone) and seven new witness controls (higher uniform noise, brown noise, flutter noise, impulses, frequency sweep/chirp, amplitude-modulated harmonic tone and noisy breath). Source and human reference audio files are never committed.

The activity screen was also independently checked on **20** positive audio files: 12 ordinary human-rated speech references, 4 difficult human-rated speech references, 2 published human-singing clips from one singer, the original Sing spoken control and its speech-derived sung candidate. **20/20 retained** under these bounded conditions. This is a tiny, nonrepresentative positive set; the human-singing clips are from only one singer.

### Negative acceptance

| Source | Raw all-phone false hypotheses | After strict activity screen | Verdict |
| --- | ---: | ---: | --- |
| Original low-level uniform noise | 1 (`F`) | **0** | Local improvement |
| Original pure sine tone | 0 | 0 | Phone decoder abstains; **VAD falsely active** |
| Original two-harmonic tone | 0 | 0 | Phone decoder abstains; **VAD falsely active** |
| Original silence | 0 | 0 | Both abstain |
| **New held-out chirp** | **1** | **1** | **FAIL** |
| Six other held-out negative controls | 0 | 0 | Decoder abstains, but VAD alone falsely activates on flutter noise, noisy breath and high-amplitude noise |

Four of the **seven** held-out non-speech recordings were misclassified as possible voice activity by VAD; one of those four, the chirp, still produced a false phone hypothesis that survived screening. These data demonstrate that VAD cannot be marketed as reliable phonetic noise suppression. The pre-existing pure tones, while labeled speech-like by VAD, produced zero raw PocketSphinx phone hypotheses. This combination has **partial utility** on the original specific noise and **no universal non-speech rejection guarantee**.

## Implementation contract

- `scripts/ear_private_voice_activity.py`: independent VAD proxy accepting raw PCM only, returns activity fraction, longest activity run, frozen thresholds and non-qualification flags.
- `scripts/ear_private_activity_controls.py`: deterministic source-only calibration/novel-negative generator with speaker-independent, label-free PCM.
- `scripts/ear_private_allphone.py`: retains **raw** segments and source SHA; adds `voiceActivityDiagnostic`, `activityScreenedPhoneCandidates` and `phonemesAdmittedAsRecognized=0`. Records separate raw and after-screen negative counts, never claims calibrated phoneme identity.
- `scripts/run_private_speech_gate.py`: optional `--activity-controls-manifest` validates private corpus hashes, frozen-threshold and calibration/heldout partition, runs the independent all-phone model against the seven novel controls, records a failed witness *without causing the browser harness to fail*. The original Ear worklet, original lexical, vowel-envelope, real human speech and human singing acceptance results remain unchanged.
- `scripts/setup_private_allphone.sh`: pin the model and VAD wheels in the local /tmp Python 3.13 environment, no CI/no server code/no installer for Sing.
- `scripts/test_ear_private_voice_activity.py` and `scripts/test_ear_private_allphone.py`: test source-independent inference, private source hashes, human positives retained, melody/sine false-activity distinction, fail-closed post-filter counting, no phone admission, new held-out chirp known failure, reproducible order independence.

### Reproduce

```sh
cd ~/Developer/teatro.fountain.coach
sh scripts/setup_private_allphone.sh
python3 scripts/ear_private_activity_controls.py
/tmp/ear-phoneme-venv/bin/python scripts/test_ear_private_voice_activity.py -q
/tmp/ear-phoneme-venv/bin/python scripts/test_ear_private_allphone.py -q

# Original private Ear tests + local phone engine + human singing and
# separately SHA-verified novel adversarial controls:
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
 --receipt /tmp/ear-integrated-activity-gate-20261024.json
```

The entire test graph uses only private, bounded audio, with temporary browser services stopped after the run. Research evidence, not a public edition.

## Open second-singer and qualification boundary

The one admitted human-sung HTK phoneme-timing corpus still contains **one singer only**. Public [ACV-001](https://github.com/Archivoice/ACV-001) describes a different male singer with manually checked labels under CC BY-SA 4.0, but also warns about defects in the English segment; a small, independently verified WAV/label pair with clear complete recording/underlying-song use rights has **not** been admitted. [GTSinger](https://huggingface.co/datasets/AaronZ345/GTSinger) is multi-singer but noncommercial/share-alike and is not a silent substitute for business use. Dataset licensing does not itself license impersonation or a released commercial voice instrument.

**Outstanding:** an independently annotated, rights-scoped second singer and a validated phone-identity likelihood with calibrated abstention against adversarial non-speech and sung confusables, with held-out singer phoneme and timing errors. Original Sing articulated take remains baseline; editorial authority is separate. No audio, synthetic control WAV, human-source WAV/labels, credential or model weights belong in public Git.
