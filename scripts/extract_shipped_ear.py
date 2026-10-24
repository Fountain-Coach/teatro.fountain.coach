#!/usr/bin/env python3
"""Extract the EXACT shipped Ear AudioWorklet from Teatro's committed bundle.

A temporary acceptance fixture, not a second publication or a new source
of audio runtime authority. Source digest changes require a fresh audit.
"""
from __future__ import annotations
import base64
import hashlib
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUNDLE = ROOT / "site/assets/book-csound-host.js"
EXPECTED_SHA256 = "4f1d800fd5518975c0bc98a5fb0ace93eaa726d8731bf330a8eff59a9d115427"

def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: extract_shipped_ear.py /tmp/scenario/ear-original.js")
    text = BUNDLE.read_text(encoding="utf-8")
    match = re.search(r'new URL\("data:text/javascript;base64,([A-Za-z0-9+/=]+)"', text)
    if not match:
        raise SystemExit("Ear worklet is not present in the committed host bundle")
    original = base64.b64decode(match.group(1), validate=True)
    digest = hashlib.sha256(original).hexdigest()
    if digest != EXPECTED_SHA256:
        raise SystemExit(f"Ear bundle changed: re-audit before running (SHA-256 {digest})")
    if b'registerProcessor("ear-analysis", EarAnalysisProcessor)' not in original:
        raise SystemExit("Expected Ear runtime identity absent")
    destination = Path(sys.argv[1]).resolve()
    if ROOT in destination.parents:
        raise SystemExit("Do not write generated worklet bytes into authoritative Git source")
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(original)
    print("EXACT_SHIPPED_EAR_EXTRACTED", str(destination), digest)

if __name__ == "__main__":
    main()
