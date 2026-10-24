#!/usr/bin/env python3
"""Deterministic non-speech adversarial controls, all private and bounded.

Calibration and held-out novel controls have disjoint seeds and signal types.
The VAD mode 3/20ms/200ms/15% settings were frozen before first creating
these controls. No score, lyrics, voice identity or phone labels are involved.
"""
from __future__ import annotations

import hashlib
import json
import math
import random
import struct
import wave
from pathlib import Path

RATE = 16000
DURATION = 3
CONTROLS = (
    ("calibration", "uniform-low", 51931),
    ("calibration", "uniform-mid", 61941),
    ("calibration", "sine", 71951),
    ("calibration", "two-tone", 81961),
    ("witness", "uniform-high", 91971),
    ("witness", "brown-noise", 101981),
    ("witness", "flutter-noise", 111991),
    ("witness", "impulses", 122001),
    ("witness", "chirp", 132011),
    ("witness", "modulated-tone", 142021),
    ("witness", "noisy-breath", 152031),
)


def samples(name: str, seed: int):
    rng = random.Random(seed)
    filtered = 0.0
    for i in range(RATE * DURATION):
        t = i / RATE
        if name == "uniform-low":
            v = rng.randint(-900, 900)
        elif name == "uniform-mid":
            v = rng.randint(-2700, 2700)
        elif name == "uniform-high":
            v = rng.randint(-7000, 7000)
        elif name == "brown-noise":
            filtered = .998 * filtered + rng.uniform(-1, 1) * .002
            v = 18000 * filtered
        elif name == "flutter-noise":
            envelope = .08 + .92 * int((t % .36) < .19)
            v = rng.randint(-9500,9500) * envelope
        elif name == "impulses":
            v = 14000 if (i % int(.14 * RATE)) < 7 else 0
        elif name == "chirp":
            v = 8500 * math.sin(2*math.pi*(180*t + 85*t*t))
        elif name == "sine":
            v = 8200 * math.sin(2*math.pi*261.63*t)
        elif name == "two-tone":
            v = (5200*math.sin(2*math.pi*261.63*t) +
                 3800*math.sin(2*math.pi*523.26*t))
        elif name == "modulated-tone":
            env = .25 + .75*(.5 + .5*math.sin(2*math.pi*4.2*t))
            v = env * (6100*math.sin(2*math.pi*210*t) +
                       1700*math.sin(2*math.pi*420*t))
        elif name == "noisy-breath":
            filtered = .75 * filtered + rng.uniform(-1, 1) * .25
            env = .04 + .96 * (1 if (t % .8) < .58 else 0)
            v = 13000 * env * (rng.uniform(-1,1) - filtered * .18)
        else:
            raise ValueError("Non-speech control not in fixed corpus")
        yield max(-32768, min(32767, round(v)))


def main():
    root = Path("/tmp/ear-activity-controls-20261024").resolve()
    if not str(root).startswith("/private/tmp/"):
        raise RuntimeError("Non-speech controls must remain private")
    root.mkdir(exist_ok=True)
    entries = []
    for part, name, seed in CONTROLS:
        path = root / (part + "-" + name + ".wav")
        with wave.open(str(path), "wb") as wav:
            wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(RATE)
            chunk = []
            for value in samples(name, seed):
                chunk.append(value)
                if len(chunk) == 4096:
                    wav.writeframesraw(struct.pack("<4096h",*chunk))
                    chunk.clear()
            if chunk:
                wav.writeframesraw(struct.pack("<" + "h"*len(chunk),*chunk))
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        entries.append({
            "sourceId": path.name,
            "sourceSHA256": digest,
            "partition": part,
            "expectedSpeech": False,
            "type": "deterministic-synthetic-nonspeech",
            "path": str(path),
        })
    manifest = {
        "schema": "ear.private-adversarial-activity-controls.v1",
        "thresholdsFrozenBeforeCreation": True,
        "allControlsAreNonSpeech": True,
        "entryCount": len(entries),
        "entries": entries,
        "mediaRelease": "not-admitted",
    }
    dest = root / "manifest.json"
    if dest.exists() and json.loads(dest.read_text()) != manifest:
        raise ValueError("Existing adversarial fixture manifest changed")
    dest.write_text(json.dumps(manifest,indent=2,sort_keys=True) + "\n")
    print(json.dumps({
        "manifest": str(dest),"total": len(entries),
        "calibration": sum(r["partition"]=="calibration" for r in entries),
        "heldout": sum(r["partition"]=="witness" for r in entries),
        "mediaPublished": False
    },indent=2))


if __name__ == "__main__":
    main()
