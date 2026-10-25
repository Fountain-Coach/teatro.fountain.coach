#!/usr/bin/env python3
"""Prepare exactly the existing original Sing/Ear/Csound in a localhost-only,
secure-context private fixture. Media and extracted Ear bytes never enter Git.
"""
from __future__ import annotations
from pathlib import Path
import hashlib
import shutil
import subprocess
import sys

TEATRO=Path(__file__).resolve().parents[2]
SOURCES=Path(__file__).resolve().parent
OUT=Path(sys.argv[1] if len(sys.argv)>1 else "/tmp/fc-composing-by-ear").resolve()
INPUT=Path("/tmp/sing-ear-scenario/articulated.wav")
EXPECTED_INPUT="1d285c6b0a9dd2f7b7be58aac1509b5f55bcac5e3636c530cbec25f20db8f505"
EXPECTED_ORIGINAL_EAR="4f1d800fd5518975c0bc98a5fb0ace93eaa726d8731bf330a8eff59a9d115427"
hashfile=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
if OUT==TEATRO or TEATRO in OUT.parents:
    raise SystemExit("Refusing to put private media or derived worklet in Git")
if not INPUT.is_file() or hashfile(INPUT)!=EXPECTED_INPUT:
    raise SystemExit("Exact owner-protected 5.2s Sing articulated source is unavailable")
for item in ("index.html","compose.mjs","controller.mjs","runner.html","runner.mjs","audio-recorder.worklet.js"):
    if not (SOURCES/item).is_file():
        raise SystemExit("Private source fixture missing "+item)
OUT.mkdir(parents=True,exist_ok=True)
for name in ("index.html","compose.mjs","controller.mjs","runner.html","runner.mjs","audio-recorder.worklet.js"):
    shutil.copy2(SOURCES/name,OUT/name)
shutil.copy2(INPUT,OUT/"articulated.wav")
subprocess.run([sys.executable,str(TEATRO/"scripts/extract_shipped_ear.py"),
                str(OUT/"ear-original.js")],check=True)
if hashfile(OUT/"ear-original.js")!=EXPECTED_ORIGINAL_EAR:
    raise SystemExit("Shipped Ear changed")
assets=OUT/"assets"
if assets.is_symlink():
    if assets.resolve()!=TEATRO/"site/assets":
        raise SystemExit("Do not replace another asset origin")
elif assets.exists():
    raise SystemExit("Expected a symlink to the actual owned Csound bundle")
else:
    assets.symlink_to(TEATRO/"site/assets",target_is_directory=True)
if hashfile(OUT/"articulated.wav")!=EXPECTED_INPUT:
    raise SystemExit("Fixture WAV changed")
print("PRIVATE_COMPOSITION_READY",OUT)
print("SOURCE_WAV_SHA256",EXPECTED_INPUT)
print("EXACT_SHIPPED_EAR_SHA256",EXPECTED_ORIGINAL_EAR)
print("CSOUND_HOST",TEATRO/"site/assets/book-csound-host.js")
print("EXISTING_MIDI2",TEATRO/"site/assets/linotype/book-midi2.mjs")
print("BROWSER_SECURE_ORIGIN http://127.0.0.1:8198/")
print("No media was added to Git or public staging")
