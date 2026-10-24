# Ear: real human singing + independently published timed phoneme reference
24 October 2026 · Fountain Coach · Teatro / Ear owner

**Verdict: timed human-sung references are now executable; actual phoneme recognition is NOT IMPLEMENTED / NOT QUALIFIED.** Do not promote Sing's sampled voice or claim listener-intelligible `la mi na` on the basis of these measurements.

## Pinned real human-singing source

Source: [Project AI❤dol Public English Dataset](https://github.com/lottev1991/Project-AIdol-Public-English-Dataset) by **Lotte V**, pinned upstream commit `517c98a02f95c1b4c371a9cc9678ab3a974222a9`. The curator describes it as an actual nonprofessional female English singer's recordings with manually prepared ARPABET phoneme time alignments, including extra `EP`, `GS`, `vf`, `ax`, `dx`, `en`. **These are published labels and have NOT been individually re-audited by independent Ear listeners.**

Licensing: repository's `LICENSE` is **CC BY-SA 4.0**, with a separate README asking not to publicly release any model featuring this singer's voice without prior permission, no RVC/voice-changing use, attribution, and additional source-specific conditions. Underlying cover songs may have separate composition/recording rights. This single source does **not** establish a clear right to clone, train, issue a re-synthesized singer, release a commercial voice model or publish clips as a Fountain Coach edition. Even for private engineering, label/video/voice rights remain distinct. **No singing voice samples, audio or .lab files were committed or deployed.**

Downloaded only **two source-pinned private WAV/.lab pairs**, total **8,845,960 audio bytes** and **100.29 seconds**, kept in `/tmp/ear-sung-human-timed-20261024/`. The source is one performer only, so the second track is a **same-singer, track-disjoint witness, not a held-out independent singer**.

| Source | Duration | ARPABET-style timed intervals | Speech intervals | Vowels | Audio SHA-256 prefix |
| --- | ---: | ---: | ---: | ---: | --- |
| `Spectrum` (development only) | 43.2624 s | 224 | 197 | 77 | `b69c4a7e` |
| `Enjoy_the_Silence` (second song, same singer) | 57.0309 s | 339 | 265 | 104 | `5135007f` |
| **Total** | **100.2933 s** | **563** | **462** | **181** | Source-specific |

Label parser: integer HTK 100-nanosecond ticks, exact positive contiguous interval boundaries, allowed phonetic symbols, source SHA-256 verified separately from label SHA-256; last label end reconciled against the actual 44.1kHz mono PCM16 WAV to within 50 ms. The protected private JSON manifest records both immutable digests, source commit, specific attribution and false/disallowed authority fields (`publicVoiceModelAuthorized=false`, `speakerDisjointEvaluationAvailable=false`, `sourceBlindInferenceRequired=true`).

## Real audio-only onset timing — truthfully limited result

Implemented independent, **label-blind acoustic onset detection**: the inference function accepts only mono PCM, sample rate and fixed RMS/quiet-time thresholds, with **no phonemes, score, expected lyrics, singer ID or aligned label timestamps**. Reference labels are read **only after prediction** to evaluate acoustic phrase-onset times following `SP/AP/EP/GS/vf` regions.

The development-only track selected RMS 0.012 from an explicitly recorded grid, with 20 ms energy window, 10 ms hop, 60 ms pre-onset quiet, 30 ms subsequent voiced duration; no hyperparameter was selected using the second song. One-to-one matching against curated phrase-onset boundaries within +/-120 ms.

| Statistic | Development recording | Track-disjoint witness, same singer |
| --- | ---: | ---: |
| Reference speech phrase starts | 13 | 23 |
| Audio-only detected onset events | 20 | 39 |
| Matched within 120 ms | 9 | 21 |
| False positives | 11 | 18 |
| Missed reference starts | 4 | 2 |
| Precision | 45.00% | 53.85% |
| Recall | 69.23% | 91.30% |
| F1 | 0.5455 | 0.6774 |
| Matched median absolute onset offset | 15.53 ms | 9.48 ms |

**Failed 0.8 precision/recall research threshold:** the second song meets recall but not precision. This is not even consonant-level phone timing: it detects *broad voiced-phrase entries*, misses some and admits many acoustic false positives. It neither recognizes the `l/m/n` onset identity nor the `ɑ/i` vowel identity. The first song is a development fixture and the second is a non-independent singer witness, so none of these numbers describes speaker generalization or actual word intelligibility.

## Combined real Ear regression

The existing `scripts/run_private_speech_gate.py` gained the optional `--human-sung-timing-reference` flag. It validates this additional, SHA-bound external benchmark **after** running the original Ear AudioWorklet browser graph against Sing's private source-addressed WAV. The original spoken/hybrid `la mi na` lexical result remains `La, me, nah.` / `Love`; full phoneme recognition remains unavailable. The single command also checks the synthetic, human-rated **spoken** and independent expert-mispronunciation challenge packs, independent envelope statistics and temporary browser cleanup. All public media and editorial gates remain closed.

```sh
cd ~/Developer/teatro.fountain.coach
python3 scripts/ear_private_sung_alignment.py
python3 scripts/test_ear_private_sung_timing.py -q
python3 scripts/ear_private_sung_timing_gate.py \
  --reference /tmp/ear-sung-human-timed-20261024/manifest.json \
  --report /tmp/ear-real-sung-onset-report.json

# Full original Ear graph + real human singing + spoken human ratings:
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
  --receipt /tmp/ear-integrated-human-singing-20261024.json
```

Temporary private HTTP/Chrome testing services and staged media are terminated by the owning test runner. All human singing data are confined to a separate private research folder, never copied into Sing, midi2sampler, Satzfunk, publishing repos or a voicebank.

## What remains before issue #1 can close

1. A **second legally clear, independently annotated real singer** for speaker-disjoint (rather than only song-disjoint) validation; manual or verified time-aligned **observed** phones and quality audit of exact clips.
2. An actual, independently sourced **phoneme recognizer** which emits raw phoneme sequence + intervals + calibrated confidence and `unknown` without seeing score, lyrics or aligned labels. A forced aligner given reference lyrics does **not** satisfy this.
3. Assess label/recognizer confusion for `la mi na` versus `la na mi`, `na mi la`, `ma mi na`, missing consonant/breath, non-speech pitched tones; report exact held-out phone error, calibration and abstention.
4. Re-run actual Ear graph on the original SHA-verified Sing takes. No internal candidate is promoted until separate phoneme and human-intelligibility gates pass.
5. Source-license, song copyright, performer permissions and editorial approval remain distinct and required before any reusable singer model or First Hearing publication.

**Decision: source admission successful, acoustic phrase onset timing below gate, independent sung-phoneme recognizer still unresolved.**
