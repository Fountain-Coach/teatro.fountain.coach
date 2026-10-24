#!/usr/bin/env python3
"""Stage a SHA-verified, PRIVATE Sing speech-derived vs procedural Ear graph.

Teatro owns all original Ear worklets and this browser measurement scenario.
Source WAVs and generated worklets are copied only into an isolated /tmp
directory. No editing of published site or public media manifest.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def accept_private_wav(path: Path) -> str:
    resolved = path.expanduser().resolve()
    if not str(resolved).startswith("/private/tmp/"):
        raise ValueError("Ear private PCM comparison only accepts sources from /tmp")
    with wave.open(str(resolved), "rb") as file:
        if (file.getnchannels(), file.getsampwidth(), file.getframerate()) != (1, 2, 48000):
            raise ValueError("Expected 48kHz mono PCM16 WAV: " + str(resolved))
        if file.getnframes() != 249600:
            raise ValueError("Expected the same 5.2-second Sing rehearsal score")
    return sha(resolved.read_bytes())


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--procedural", required=True)
    parser.add_argument("--speech-derived", required=True)
    parser.add_argument("--stage", default="/tmp/sing-ear-speech-comparison")
    args = parser.parse_args()
    stage = Path(args.stage).expanduser().resolve()
    if not str(stage).startswith("/private/tmp/"):
        parser.error("Stage must remain private under /tmp")
    procedural = Path(args.procedural).expanduser().resolve()
    speech = Path(args.speech_derived).expanduser().resolve()
    expected = {"procedural": accept_private_wav(procedural),
                "speechDerived": accept_private_wav(speech)}
    stage.mkdir(parents=True, exist_ok=True)
    for label, source in [("procedural", procedural), ("speechDerived", speech)]:
        shutil.copy2(source, stage / (label + ".wav"))
    subprocess.run([sys.executable, str(ROOT / "scripts/extract_shipped_ear.py"),
                    str(stage / "ear-original.js")], check=True)
    shutil.copy2(ROOT / "scripts/ear-singing-features.worklet.js",
                 stage / "ear-features.js")
    template = (ROOT / "scripts/ear-singing-scenario.html").read_text()
    config_js = ("const cfg = [" +
                 ",".join(json.dumps([name, value]) for name, value in expected.items()) +
                 "];")
    rendered, count = re.subn(r"const cfg\s*=\s*\[\s*\[.*?\];",
                              lambda _: config_js, template, flags=re.S)
    if count != 1:
        raise ValueError("Original Ear scenario changed: audit instead of guessing")
    (stage / "index.html").write_text(rendered)
    config = {
        "status": "private-ear-acoustic-only",
        "workletSha256": sha((stage / "ear-original.js").read_bytes()),
        "sources": expected,
        "recognizesPhonemes": False,
        "publicRelease": "not-admitted",
    }
    (stage / "config.json").write_text(json.dumps(config, indent=2) + "\n")
    print(json.dumps({"stage": str(stage), **config}, indent=2))


if __name__ == "__main__":
    main()
