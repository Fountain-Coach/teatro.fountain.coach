#!/usr/bin/env python3
"""Private, synthetic negative controls for Ear's on-device lexical ASR.

No voice cloning, network, service, permanent corpus or media published.
The original score remains the only positive target, tested AFTER inference.
"""
from __future__ import annotations

import argparse
import json
import random
import struct
import subprocess
import wave
from pathlib import Path


def ensure_private(prefix: str) -> Path:
    p = Path(prefix).expanduser().resolve()
    if not str(p).startswith("/private/tmp/"):
        raise ValueError("Negative control files must remain in /tmp")
    p.parent.mkdir(parents=True, exist_ok=True)
    return p


def speak(text: str, target: Path, voice: str) -> None:
    temp = target.with_suffix(".aiff")
    try:
        subprocess.run(["say", "-v", voice, "-r", "125", "-o", str(temp), text], check=True)
        subprocess.run(["afconvert", "-f", "WAVE", "-d", "LEI16@48000",
                        "-c", "1", str(temp), str(target)], check=True)
    finally:
        temp.unlink(missing_ok=True)


def synthetic(target: Path, signal: str) -> None:
    rng = random.Random(30943)
    samples = 4 * 48000
    with wave.open(str(target), "wb") as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(48000)
        for offset in range(0, samples, 4096):
            n = min(4096, samples - offset)
            if signal == "silence":
                values = [0] * n
            elif signal == "noise":
                values = [rng.randint(-1000, 1000) for _ in range(n)]
            else:
                raise ValueError("unknown signal")
            output.writeframesraw(struct.pack("<" + "h" * n, *values))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--prefix", default="/tmp/ear-negative")
    parser.add_argument("--voice", default="Samantha")
    args = parser.parse_args()
    base = ensure_private(args.prefix)
    result = {}
    for name, phrase in (("order", "la na me"), ("consonant", "ma me na")):
        path = Path(str(base) + "-" + name + ".wav")
        speak(phrase, path, args.voice)
        result[name] = str(path)
    for name in ("silence", "noise"):
        path = Path(str(base) + "-" + name + ".wav")
        synthetic(path, name)
        result[name] = str(path)
    print(json.dumps({"status": "private-test-only",
                      "source": "macOS say plus original deterministic PCM",
                      "phoneticLabels": "synthetic test text, not recognition",
                      "files": result}, indent=2))


if __name__ == "__main__":
    main()
