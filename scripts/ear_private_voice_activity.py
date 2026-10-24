#!/usr/bin/env python3
"""Offline, label-blind VOICE-ACTIVITY veto for Ear's private allphone research.

This is NOT speech recognition, singing classification, actual phoneme
confidence, or human intelligibility. WebRTC VAD can label pure musical
tones as speech! Always preserve raw phoneme decoder decisions separately.

Frozen settings were chosen using original synthetic controls and human
spoken/sung examples before the new challenge controls were generated.
No transcribed words, score, phoneme references, singer ID, MIDI or music
performance context is passed to this acoustic detector.
"""
from __future__ import annotations

import importlib.metadata
import json

import webrtcvad

VAD_DISTRIBUTION = "webrtcvad-wheels"
VAD_VERSION = "2.0.14.post1"
FRAME_MS = 20
RATE = 16000
MODE = 3
MIN_LONGEST_RUN_MS = 200
MIN_VOICED_FRACTION = .15
MAX_DURATION_SECONDS = 75


def analyze_pcm16(pcm: bytes, sample_rate: int = RATE) -> dict:
    """Return only an independent speech-LIKE activity proxy, not phone truth."""
    if (importlib.metadata.version(VAD_DISTRIBUTION) != VAD_VERSION
            or sample_rate != RATE):
        raise ValueError("Unsupported local VAD build/sample rate")
    if (not isinstance(pcm, bytes) or len(pcm) < RATE * 2 // 10
            or len(pcm) > MAX_DURATION_SECONDS * RATE * 2
            or len(pcm) % 2):
        raise ValueError("PCM16 source not a bounded duration")
    frame_bytes = int(RATE * FRAME_MS / 1000) * 2
    count = len(pcm) // frame_bytes
    if count < 5:
        raise ValueError("Cannot assess too-short source")
    vad = webrtcvad.Vad(MODE)  # always fresh: per-source hidden state
    total_voice = 0
    run = 0
    longest = 0
    for offset in range(0, count * frame_bytes, frame_bytes):
        frame = pcm[offset:offset + frame_bytes]
        active = bool(vad.is_speech(frame, RATE))
        total_voice += int(active)
        run = run + 1 if active else 0
        longest = max(longest, run)
    speech_frac = total_voice / count
    candidate = (longest * FRAME_MS >= MIN_LONGEST_RUN_MS
                 and speech_frac >= MIN_VOICED_FRACTION)
    return {
        "schema": "ear.private-voice-activity-proxy.v1",
        "tool": "WebRTC VAD",
        "distribution": VAD_DISTRIBUTION,
        "version": VAD_VERSION,
        "mode": MODE,
        "sampleRate": RATE,
        "frameMs": FRAME_MS,
        "framesAnalyzed": count,
        "voiceActivityFrames": total_voice,
        "voiceActivityFraction": round(speech_frac, 5),
        "longestConsecutiveActivityMs": longest * FRAME_MS,
        "minActivityFraction": MIN_VOICED_FRACTION,
        "minConsecutiveActivityMs": MIN_LONGEST_RUN_MS,
        "passesActivityScreen": candidate,
        "speechOrSingingIdentified": False,
        "phonemeIdentityInferred": False,
        "confidenceCalibrated": False,
        "scoreProvided": False,
        "knownLimitation": "Pitched musical tones can trigger speech-like VAD",
    }


def main() -> None:
    import argparse
    import subprocess
    import tempfile
    import wave
    import hashlib
    from pathlib import Path

    parser = argparse.ArgumentParser()
    parser.add_argument("--candidate", action="append", default=[])
    parser.add_argument("--negative", action="append", default=[])
    parser.add_argument("--report", default="/tmp/ear-private-voice-activity-report.json")
    args = parser.parse_args()
    selected = args.candidate + args.negative
    if not selected or len(selected) > 30:
        parser.error("Supply one to thirty private audio sources")
    if len(set(str(Path(p).resolve()) for p in selected)) != len(selected):
        parser.error("No duplicate sources")
    observations = []
    for kind, files in (("candidate", args.candidate), ("negative", args.negative)):
        for value in files:
            path = Path(value).expanduser().resolve()
            if not str(path).startswith("/private/tmp/") or not path.is_file():
                parser.error("Private WAV required under /tmp")
            original = path.read_bytes()
            if len(original) > 14_000_000 or path.suffix.lower() != ".wav":
                parser.error("Bounded private WAV only")
            with tempfile.TemporaryDirectory(dir="/tmp",prefix="ear-activity-") as working:
                dest = Path(working) / "source.wav"
                subprocess.run([
                    "/usr/bin/afconvert", "-f", "WAVE", "-d", "LEI16@16000",
                    "-c", "1", str(path), str(dest)
                ], check=True, capture_output=True, timeout=30)
                with wave.open(str(dest), "rb") as wav:
                    if (wav.getframerate(),wav.getnchannels(),wav.getsampwidth()) != (RATE,1,2):
                        raise ValueError("Unexpected converted PCM")
                    audio = wav.readframes(wav.getnframes())
                stats = analyze_pcm16(audio)
            observations.append({
                "sourceId": path.name,
                "SHA256": hashlib.sha256(original).hexdigest(),
                "probeKind": kind, "activity": stats,
            })
    report = Path(args.report).expanduser().resolve()
    if not str(report).startswith("/private/tmp/"):
        parser.error("Report must remain private")
    result = {
        "schema": "ear.private-activity-multi-source.v1",
        "thresholdsFrozenBeforeNovelControls": True,
        "observations": observations,
        "cannotCertifyPhonemes": True,
        "mediaPublished": False,
    }
    report.write_text(json.dumps(result,indent=2,sort_keys=True) + "\n")
    print(json.dumps({
        "report": str(report), "sources": [
            (x["sourceId"], x["activity"]["passesActivityScreen"],
             x["activity"]["voiceActivityFraction"],
             x["activity"]["longestConsecutiveActivityMs"])
            for x in observations],
        "mediaPublished": False}, indent=2))


if __name__ == "__main__":
    main()
