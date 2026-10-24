#!/usr/bin/env python3
"""Frozen-threshold novel NON-SPEECH challenges for native Ear sound analysis.

These do NOT contain voice or phoneme labels. Sources constructed AFTER
Apple SoundAnalysis voice-evidence threshold was fixed (0.5 window score,
0.5 frame fraction, >=2 windows). Never train a singer or ASR from them.
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
SECS = 4
SEED = 2026102421
NAMES = (
    "rising-gliss",
    "falling-gliss",
    "staccato-chords",
    "warbled-whistle",
    "rhythmic-noise",
    "pinkish-noise",
    "formantlike-synth",
    "bell-pattern",
    "rasp-pulses",
)


def values(name: str):
    rng = random.Random(SEED + NAMES.index(name) * 743)
    drift = 0.0
    phase = 0.0
    for i in range(RATE * SECS):
        t = i / RATE
        if name == "rising-gliss":
            hz = 170 + t * 195
            amp = 9000
        elif name == "falling-gliss":
            hz = 1000 - t * 165
            amp = 9000
        elif name == "staccato-chords":
            hz = 220 if int(t * 5) % 2 == 0 else 440
            amp = (10500 if t % .2 < .11 else 0)
        elif name == "warbled-whistle":
            hz = 430 + 95 * math.sin(2 * math.pi * 6 * t)
            amp = 10000
        elif name == "rhythmic-noise":
            hz = 0
            amp = (10000 if t % .31 < .19 else 0)
        elif name == "pinkish-noise":
            hz = 0
            amp = 16000
        elif name == "formantlike-synth":
            hz = 160
            amp = 11000
        elif name == "bell-pattern":
            hz = 554.37 if int(t*1.5) % 2 == 0 else 740
            amp = 12000 * math.exp(-7*(t % (2/3)))
        elif name == "rasp-pulses":
            hz = 0
            amp = 9500 if (t % .49) < .24 else 0
        else:
            raise ValueError("Unknown signal fixture")
        if hz:
            phase += 2*math.pi*hz/RATE
            v = amp * math.sin(phase)
            if name == "formantlike-synth":
                v = (amp*.54*math.sin(phase)
                     + amp*.26*math.sin(2*phase)
                     + amp*.12*math.sin(5*phase)
                     + amp*.07*math.sin(8*phase))
        else:
            v = rng.uniform(-1,1) * amp
            if name == "pinkish-noise":
                drift = .97*drift + .03*v
                v = drift * 3
            if name == "rasp-pulses":
                drift = .86*drift + .14*v
                v = drift
        yield max(-32768,min(32767,round(v)))


def main():
    root = Path("/tmp/ear-sound-novel-nonspeech-20261024").resolve()
    if not str(root).startswith("/private/tmp/"):
        raise ValueError("Only private research under /tmp")
    root.mkdir(exist_ok=True)
    rows = []
    for name in NAMES:
        file = root / (name + ".wav")
        with wave.open(str(file),"wb") as output:
            output.setnchannels(1)
            output.setsampwidth(2)
            output.setframerate(RATE)
            chunk=[]
            for v in values(name):
                chunk.append(v)
                if len(chunk)==4096:
                    output.writeframesraw(struct.pack("<4096h",*chunk))
                    chunk.clear()
            if chunk:
                output.writeframesraw(struct.pack("<"+"h"*len(chunk),*chunk))
        rows.append({
            "source": name, "path": str(file),
            "sha256": hashlib.sha256(file.read_bytes()).hexdigest(),
            "expectedHumanVoice": False,
            "role": "held-out-adversarial-nonspeech",
        })
    manifest={
        "schema":"ear.private-native-sound-novel-v1",
        "generatedAfterNativeThresholdFrozen":True,
        "thresholds":{"minimumWindowScore":.5,"minimumEvidenceWindowFraction":.5,
                      "minimumWindows":2},
        "negativeOnly":True,
        "records":rows,
        "audioPublished":False,
    }
    out=root / "manifest.json"
    if out.exists() and json.loads(out.read_text())!=manifest:
        raise ValueError("Digest/manifest drift of novel non-speech set")
    out.write_text(json.dumps(manifest,sort_keys=True,indent=2)+"\n")
    print(json.dumps({"manifest":str(out),"controls":len(rows),
        "bytes":sum(Path(x["path"]).stat().st_size for x in rows),
        "mediaPublished":False},indent=2))


if __name__=="__main__":
    main()
