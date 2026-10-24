#!/usr/bin/env python3
"""Create an independently sourced, HELD-OUT, small synthetic CV corpus.

Only macOS system 'say' voices; not Sing. Intended text is LABEL, never
acoustically verified IPA. By default speakers have disjoint train,
calibration and final witness splits; final witness must not be tuned on.
Private WAVs and labels under /tmp only; no network or model download.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import random
import struct
import subprocess
import wave
from pathlib import Path

RATE = 48000
# No training sample from Samantha: Sing's original private speech source
# was produced with Samantha. Keep it reserved for a final unseen check.
SPEAKERS = {
    "train": ("Fred", "Daniel", "Karen", "Rishi"),
    "calibration": ("Moira", "Tessa"),
    "witness": ("Samantha",),
}
# Explicit phonetic intent: exact spelling is passed independently to TTS.
# /ɑ/ and /oʊ/ are approximate English dialect-dependent realizations.
SYLLABLES = {
    "la": ("lah", "l", "ɑ"),
    "mi": ("mee", "m", "i"),
    "na": ("nah", "n", "ɑ"),
    "ma": ("mah", "m", "ɑ"),
    "ni": ("nee", "n", "i"),
    "li": ("lee", "l", "i"),
    "no": ("no", "n", "oʊ"),
    "lo": ("low", "l", "oʊ"),
    "mo": ("mow", "m", "oʊ"),
}
OUT_OF_SET = {"pa": "pah", "ka": "kah", "ta": "tah",
              "sa": "sah", "a": "ah", "i": "ee"}


def wav(source: Path, dest: Path, speaker: str, spoken: str, tempo: int) -> None:
    intermediate = dest.with_suffix(".aiff")
    try:
        subprocess.run(["say", "-v", speaker, "-r", str(tempo),
                        "-o", str(intermediate), spoken],
                       check=True, stdout=subprocess.DEVNULL,
                       stderr=subprocess.PIPE, timeout=15)
        subprocess.run(["afconvert", "-f", "WAVE", "-d", "LEI16@48000",
                        "-c", "1", str(intermediate), str(dest)],
                       check=True, stdout=subprocess.DEVNULL,
                       stderr=subprocess.PIPE, timeout=15)
        with wave.open(str(dest), "rb") as f:
            assert (f.getframerate(), f.getnchannels(),
                    f.getsampwidth()) == (RATE, 1, 2)
            assert 0.12 < f.getnframes() / RATE < 3
    finally:
        intermediate.unlink(missing_ok=True)


def noise_file(dest: Path, noise: bool) -> None:
    randomizer = random.Random(81489)
    with wave.open(str(dest), "wb") as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(RATE)
        for _ in range(RATE // 1024):
            data = [randomizer.randint(-1500, 1500) if noise else 0
                    for _ in range(1024)]
            output.writeframesraw(struct.pack("<1024h", *data))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="/tmp/ear-phonetic-cv-20261024")
    args = parser.parse_args()
    root = Path(args.out).expanduser().resolve()
    if not str(root).startswith("/private/tmp/"):
        parser.error("private corpus must remain in /tmp")
    root.mkdir(parents=True, exist_ok=True)
    manifest = {
        "schema": "ear.private-phonetic-cv.v1",
        "source": "macOS system speech TTS; NOT Sing and not human-verified phoneme ground truth",
        "trainingClaim": "bounded onset-vowel intent classification only",
        "scoreIsExcludedFromInference": True,
        "speakers": SPEAKERS,
        "recordings": [],
        "mediaRelease": "not-admitted",
    }
    for group, speakers in SPEAKERS.items():
        for voice in speakers:
            for label, (word, onset, nucleus) in SYLLABLES.items():
                filename = f"{group}-{voice}-{label}.wav"
                target = root / filename
                if not target.exists():
                    wav(root, target, voice, word, 125)
                manifest["recordings"].append({
                    "id": filename, "path": str(target),
                    "partition": group, "speaker": voice, "target": label,
                    "onsetIntent": onset, "nucleusIntent": nucleus,
                    "spokenPrompt": word,
                    "wavSHA256": hashlib.sha256(target.read_bytes()).hexdigest(),
                })
            if group in ("calibration", "witness"):
                for label, spoken in OUT_OF_SET.items():
                    filename = f"{group}-{voice}-unknown-{label}.wav"
                    target = root / filename
                    if not target.exists():
                        wav(root, target, voice, spoken, 125)
                    manifest["recordings"].append({
                        "id": filename, "path": str(target),
                        "partition": group, "speaker": voice, "target": "unknown",
                        "unknownToken": label, "spokenPrompt": spoken,
                        "wavSHA256": hashlib.sha256(target.read_bytes()).hexdigest()
                    })
    for noise in ("silence", "noise"):
        target = root / (noise + ".wav")
        noise_file(target, noise == "noise")
        manifest["recordings"].append({
            "id": target.name, "path": str(target),
            "partition": "calibration", "speaker": "synthetic",
            "target": "unknown", "unknownToken": noise,
            "wavSHA256": hashlib.sha256(target.read_bytes()).hexdigest(),
        })
    output = root / "corpus.json"
    output.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n")
    print(json.dumps({
        "manifest": str(output), "recordings": len(manifest["recordings"]),
        "train": sum(r["partition"] == "train" for r in manifest["recordings"]),
        "calibration": sum(r["partition"] == "calibration" for r in manifest["recordings"]),
        "witness": sum(r["partition"] == "witness" for r in manifest["recordings"]),
        "mediaPublished": False
    }, indent=2))


if __name__ == "__main__":
    main()
