#!/usr/bin/env python3
"""Generate *new* system TTS witnesses AFTER detector threshold was frozen.

New voices are never training/calibration or the previously inspected
Samantha witness. Do not edit the frozen detector in response to outcomes.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import wave
from pathlib import Path

from ear_private_phonetic_corpus import SYLLABLES, OUT_OF_SET, wav

NEW_VOICES = ("Kathy", "Aman", "Kate (Enhanced)")


def verified_duration(path: Path) -> bool:
    if not path.exists(): return False
    try:
        with wave.open(str(path), "rb") as source:
            return .12 < source.getnframes() / source.getframerate() < 3
    except (ValueError, OSError, wave.Error):
        return False


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="/tmp/ear-phonetic-new-voices-20261024")
    args = parser.parse_args()
    target = Path(args.out).expanduser().resolve()
    if not str(target).startswith("/private/tmp/"):
        parser.error("Private novel witness must remain under /tmp")
    target.mkdir(parents=True, exist_ok=True)
    result = {
        "schema": "ear.private-phonetic-cv.v1",
        "source": "Independent macOS voice system TTS; no Sing and no IPA-human verification",
        "speakers": {"train": [], "calibration": [], "witness": NEW_VOICES},
        "recordings": [],
        "mediaRelease": "not-admitted",
        "thresholdFrozenBeforeNewWitness": True,
    }
    for voice in NEW_VOICES:
        safe = voice.replace(" ", "_").replace("(", "").replace(")", "")
        for label, (prompt, onset, vowel) in SYLLABLES.items():
            name = f"witness-{safe}-{label}.wav"
            path = target / name
            if not verified_duration(path):
                wav(target, path, voice, prompt, 125)
            result["recordings"].append({
                "id": name, "path": str(path),
                "partition": "witness", "speaker": voice,
                "target": label, "onsetIntent": onset, "nucleusIntent": vowel,
                "spokenPrompt": prompt,
                "wavSHA256": hashlib.sha256(path.read_bytes()).hexdigest(),
            })
        for unknown, standard_prompt in OUT_OF_SET.items():
            # The Aman voice silently drops "ah"; audible "ahh" is explicit,
            # with the actual prompt retained in the source manifest.
            prompt = "ahh" if voice == "Aman" and unknown == "a" else standard_prompt
            name = f"witness-{safe}-unknown-{unknown}.wav"
            path = target / name
            if not verified_duration(path):
                wav(target, path, voice, prompt, 125)
            result["recordings"].append({
                "id": name, "path": str(path),
                "partition": "witness", "speaker": voice, "target": "unknown",
                "unknownToken": unknown, "spokenPrompt": prompt,
                "wavSHA256": hashlib.sha256(path.read_bytes()).hexdigest()
            })
    manifest = target / "novel-corpus.json"
    manifest.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n")
    print(json.dumps({"novelManifest": str(manifest),
                      "newVoices": NEW_VOICES,
                      "total": len(result["recordings"]),
                      "source": "not Sing",
                      "mediaPublished": False}, indent=2))


if __name__ == "__main__":
    main()
